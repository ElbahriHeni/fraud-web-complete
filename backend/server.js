const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const pool = require("./db");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

let supabaseClient = null;

function getSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return supabaseClient;
}

function getStorageBucket() {
  return process.env.SUPABASE_BUCKET || "fraud-documents";
}

function sanitizeFileName(fileName) {
  return String(fileName || "document")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 160);
}

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
  })
);

app.use(express.json());


function safePdfValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function formatPdfDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addPdfSection(doc, title) {
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(14).text(title, { underline: true });
  doc.moveDown(0.4);
}

function addPdfField(doc, label, value) {
  doc.font("Helvetica-Bold").fontSize(10).text(`${label}: `, { continued: true });
  doc.font("Helvetica").fontSize(10).text(safePdfValue(value));
}

function addPdfLongField(doc, label, value) {
  doc.font("Helvetica-Bold").fontSize(10).text(`${label}:`);
  doc.font("Helvetica").fontSize(10).text(safePdfValue(value), { align: "left" });
}


const CASE_FIELDS = [
  "case_number",
  "claim_id",
  "case_type",
  "case_source",
  "case_source_other",
  "priority_level",
  "case_status",
  "assigned_user",
  "assignment_date",
  "assigned_by",
  "reassignment_reason",
  "case_entry_date",
  "closure_date",
  "closure_reason",
  "insurance_type",
  "suspected_amount",
  "fraud_unit_notes",
  "reporter_name",
  "reporter_email",
  "reporter_mobile",
  "national_id_or_iqama",
  "description",
  "consent_to_terms_and_privacy",
  "has_claim",
  "claim_type",
  "claim_status",
  "suspension_date",
  "suspension_reason",
  "fraud_confirmed_date",
  "fraud_detection_method",
  "fraud_amount",
  "action_taken",
  "referred_entity",
  "fraud_indicator_type",
  "indicator_description",
  "occurrence_count",
  "risk_score",
  "risk_level",
  "system_recommendation",
  "fraud_officer_decision",
  "created_by",
];

function emptyToNull(value) {
  if (value === undefined || value === "") return null;
  return value;
}

function toNumber(value, defaultValue = 0) {
  if (value === undefined || value === null || value === "") return defaultValue;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? defaultValue : numeric;
}

function mapDecisionToStatus(decision, fallbackStatus = "Received") {
  if (decision === "Open") return "Open";
  if (decision === "Close") return "Closed";
  return fallbackStatus;
}

async function findCaseByIdOrNumber(id, client = pool) {
  const result = await client.query(
    `
    SELECT *
    FROM fraud_cases
    WHERE id::text = $1::text OR case_number = $1::text
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function insertActionLog(client, fraudCaseId, responsible, status) {
  await client.query(
    `
    INSERT INTO case_action_logs (
      fraud_case_id,
      responsible_user,
      status
    )
    VALUES ($1::integer, $2::text, $3::text)
    `,
    [fraudCaseId, responsible || "System", status || "Updated"]
  );
}

function buildInsertQuery(tableName, data) {
  const keys = Object.keys(data).filter((key) => CASE_FIELDS.includes(key));
  const placeholders = keys.map((_, index) => `$${index + 1}`);
  const values = keys.map((key) => data[key]);

  return {
    text: `
      INSERT INTO ${tableName} (${keys.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `,
    values,
  };
}

async function updateFraudCase(client, id, fields) {
  const entries = Object.entries(fields).filter(([key]) => CASE_FIELDS.includes(key));

  if (entries.length === 0) {
    return findCaseByIdOrNumber(id, client);
  }

  const setSql = entries.map(([key], index) => `${key} = $${index + 1}`).join(",\n          ");
  const values = entries.map(([, value]) => value);
  values.push(id);

  const result = await client.query(
    `
    UPDATE fraud_cases
    SET ${setSql},
        updated_at = CURRENT_TIMESTAMP
    WHERE id::text = $${values.length}::text OR case_number = $${values.length}::text
    RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

app.get("/", (req, res) => {
  res.send("Fraud Management Backend API is running");
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      backend: "running",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      backend: "running",
      database: "not connected",
      message: error.message,
    });
  }
});

app.get("/api/cases", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM fraud_cases
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fraud cases",
      error: error.message,
    });
  }
});

app.get("/api/cases/:id", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case details",
      error: error.message,
    });
  }
});

app.post("/api/cases", async (req, res) => {
  const client = await pool.connect();

  try {
    const body = req.body;
    const createdBy = body.created_by || "Admin";
    const caseNumber = body.case_number || `FC-${Date.now()}`;
    const requestedStatus = emptyToNull(body.case_status) || "Draft";
    const allowedCreateStatuses = ["Draft", "Open"];
    const createStatus = allowedCreateStatuses.includes(requestedStatus) ? requestedStatus : "Draft";

    const caseData = {
      case_number: caseNumber,
      reporter_name: emptyToNull(body.reporter_name),
      reporter_email: emptyToNull(body.reporter_email),
      reporter_mobile: emptyToNull(body.reporter_mobile),
      national_id_or_iqama: emptyToNull(body.national_id_or_iqama),
      consent_to_terms_and_privacy: Boolean(body.consent_to_terms_and_privacy),

      claim_id: emptyToNull(body.claim_id),
      case_type: emptyToNull(body.case_type),
      case_source: emptyToNull(body.case_source),
      case_source_other: emptyToNull(body.case_source_other),
      priority_level: emptyToNull(body.priority_level),
      case_status: createStatus,
      case_entry_date: body.case_entry_date || new Date(),
      insurance_type: emptyToNull(body.insurance_type),
      suspected_amount: toNumber(body.suspected_amount, 0),
      description: emptyToNull(body.description),

      has_claim: Boolean(body.has_claim),
      claim_type: emptyToNull(body.claim_type),
      claim_status: emptyToNull(body.claim_status),
      suspension_date: emptyToNull(body.suspension_date),
      suspension_reason: emptyToNull(body.suspension_reason),

      fraud_confirmed_date: emptyToNull(body.fraud_confirmed_date),
      fraud_detection_method: emptyToNull(body.fraud_detection_method),
      fraud_amount: toNumber(body.fraud_amount, 0),
      action_taken: emptyToNull(body.action_taken),
      referred_entity: emptyToNull(body.referred_entity),
      fraud_indicator_type: emptyToNull(body.fraud_indicator_type),
      indicator_description: emptyToNull(body.indicator_description),
      occurrence_count: toNumber(body.occurrence_count, 0),
      risk_score: toNumber(body.risk_score, 0),
      risk_level: emptyToNull(body.risk_level),
      system_recommendation: emptyToNull(body.system_recommendation),

      fraud_officer_decision: emptyToNull(body.fraud_officer_decision),
      fraud_unit_notes: emptyToNull(body.fraud_unit_notes),
      assigned_user: null,
      assignment_date: null,
      assigned_by: null,
      reassignment_reason: null,
      closure_date: null,
      closure_reason: null,

      created_by: createdBy,
    };

    await client.query("BEGIN");

    const insertQuery = buildInsertQuery("fraud_cases", caseData);
    const result = await client.query(insertQuery.text, insertQuery.values);
    const fraudCase = result.rows[0];

    await insertActionLog(client, fraudCase.id, createdBy, fraudCase.case_status);


    if (Array.isArray(body.documents)) {
      for (const document of body.documents) {
        if (!document.file_name) continue;

        await client.query(
          `
          INSERT INTO case_documents (
            fraud_case_id,
            file_name,
            file_type,
            file_url,
            category,
            uploaded_by
          )
          VALUES ($1::integer, $2::text, $3::text, $4::text, $5::text, $6::text)
          `,
          [
            fraudCase.id,
            document.file_name,
            document.file_type || null,
            document.file_url || null,
            document.category || "supporting_document",
            document.uploaded_by || createdBy,
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json(fraudCase);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      message: "Failed to create fraud case",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

app.patch("/api/cases/:id/reporter", async (req, res) => {
  try {
    const fraudCase = await updateFraudCase(pool, req.params.id, {
      reporter_name: emptyToNull(req.body.reporter_name),
      reporter_email: emptyToNull(req.body.reporter_email),
      reporter_mobile: emptyToNull(req.body.reporter_mobile),
      national_id_or_iqama: emptyToNull(req.body.national_id_or_iqama),
      consent_to_terms_and_privacy:
        typeof req.body.consent_to_terms_and_privacy === "boolean" ? req.body.consent_to_terms_and_privacy : undefined,
    });

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reporter details", error: error.message });
  }
});

app.patch("/api/cases/:id/overview", async (req, res) => {
  try {
    const fraudCase = await updateFraudCase(pool, req.params.id, {
      claim_id: emptyToNull(req.body.claim_id),
      case_type: emptyToNull(req.body.case_type),
      case_source: emptyToNull(req.body.case_source),
      case_source_other: emptyToNull(req.body.case_source_other),
      priority_level: emptyToNull(req.body.priority_level),
      case_entry_date: emptyToNull(req.body.case_entry_date),
      insurance_type: emptyToNull(req.body.insurance_type),
      suspected_amount: req.body.suspected_amount === undefined ? undefined : toNumber(req.body.suspected_amount, 0),
      description: emptyToNull(req.body.description),
      has_claim: typeof req.body.has_claim === "boolean" ? req.body.has_claim : undefined,
    });

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to update case overview", error: error.message });
  }
});

app.patch("/api/cases/:id/claim-info", async (req, res) => {
  try {
    const fraudCase = await updateFraudCase(pool, req.params.id, {
      claim_id: emptyToNull(req.body.claim_id),
      claim_type: emptyToNull(req.body.claim_type),
      claim_status: emptyToNull(req.body.claim_status),
      suspension_date: emptyToNull(req.body.suspension_date),
      suspension_reason: emptyToNull(req.body.suspension_reason),
      has_claim: true,
    });

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to update claim information", error: error.message });
  }
});

app.patch("/api/cases/:id/indicators", async (req, res) => {
  try {
    const fraudCase = await updateFraudCase(pool, req.params.id, {
      fraud_confirmed_date: emptyToNull(req.body.fraud_confirmed_date),
      fraud_detection_method: emptyToNull(req.body.fraud_detection_method),
      fraud_amount: req.body.fraud_amount === undefined ? undefined : toNumber(req.body.fraud_amount, 0),
      action_taken: emptyToNull(req.body.action_taken),
      referred_entity: emptyToNull(req.body.referred_entity),
      fraud_indicator_type: emptyToNull(req.body.fraud_indicator_type),
      indicator_description: emptyToNull(req.body.indicator_description),
      occurrence_count: req.body.occurrence_count === undefined ? undefined : toNumber(req.body.occurrence_count, 0),
      risk_level: emptyToNull(req.body.risk_level),
    });

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to update fraud indicators", error: error.message });
  }
});

// Backward-compatible endpoint used by older frontend versions.
app.patch("/api/cases/:id/confirmed-fraud", async (req, res) => {
  try {
    const fraudCase = await updateFraudCase(pool, req.params.id, {
      claim_type: emptyToNull(req.body.claim_type),
      fraud_confirmed_date: emptyToNull(req.body.fraud_confirmed_date),
      fraud_detection_method: emptyToNull(req.body.fraud_detection_method),
      fraud_amount: req.body.fraud_amount === undefined ? undefined : toNumber(req.body.fraud_amount, 0),
      action_taken: emptyToNull(req.body.action_taken),
      referred_entity: emptyToNull(req.body.referred_entity),
    });

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });
    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({ message: "Failed to update confirmed fraud details", error: error.message });
  }
});

app.patch("/api/cases/:id/decision", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const currentCase = await findCaseByIdOrNumber(id, client);

    if (!currentCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const decision = emptyToNull(req.body.fraud_officer_decision);
    const responsible = req.body.responsible_user || req.body.assigned_by || req.body.changed_by || "Admin";
    const nextStatus = mapDecisionToStatus(decision, currentCase.case_status || "Received");

    if (decision === "Reassign") {
      return res.status(400).json({ message: "Reassignment from the decision tab is disabled." });
    }

    if (!decision || !["Open", "Close"].includes(decision)) {
      return res.status(400).json({ message: "Invalid fraud officer decision." });
    }

    if (currentCase.case_status === "Draft" && decision === "Close") {
      return res.status(400).json({ message: "Draft cases cannot be closed. Open the case first." });
    }

    if (currentCase.case_status === "Closed" && decision === "Close") {
      return res.status(400).json({ message: "Closed cases can only be opened from the decision tab." });
    }

    if (currentCase.case_status === "Open" && decision === "Open") {
      return res.status(400).json({ message: "Open cases are already open. Choose Close if you want to close the case." });
    }

    if (decision === "Close" && !req.body.closure_reason) {
      return res.status(400).json({ message: "Closure reason is required when closing a case." });
    }

    await client.query("BEGIN");

    const fraudCase = await updateFraudCase(client, id, {
      fraud_officer_decision: decision,
      fraud_unit_notes: emptyToNull(req.body.fraud_unit_notes),
      case_status: nextStatus,
      closure_date: decision === "Close" ? req.body.closure_date || new Date() : decision === "Open" ? null : currentCase.closure_date,
      closure_reason: decision === "Close" ? emptyToNull(req.body.closure_reason) : decision === "Open" ? null : currentCase.closure_reason,
    });

    await insertActionLog(client, fraudCase.id, responsible, fraudCase.case_status);
    await client.query("COMMIT");

    res.json(fraudCase);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to save fraud decision", error: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/cases/:id/status", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { case_status, closure_reason, closure_date, responsible_user } = req.body;

    await client.query("BEGIN");

    const fraudCase = await updateFraudCase(client, id, {
      case_status: emptyToNull(case_status),
      closure_reason: case_status === "Closed" ? emptyToNull(closure_reason) : undefined,
      closure_date: case_status === "Closed" ? closure_date || new Date() : undefined,
    });

    if (!fraudCase) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Case not found" });
    }

    await insertActionLog(client, fraudCase.id, responsible_user || "Admin", fraudCase.case_status);
    await client.query("COMMIT");

    res.json(fraudCase);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to update case status", error: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/cases/:id/assign", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { assigned_user, assigned_by, change_reason } = req.body;
    const currentCase = await findCaseByIdOrNumber(id, client);

    if (!currentCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    await client.query("BEGIN");

    const fraudCase = await updateFraudCase(client, id, {
      assigned_user: emptyToNull(assigned_user),
      assignment_date: new Date(),
      assigned_by: assigned_by || "System",
      reassignment_reason: change_reason || "Case assigned",
      case_status: currentCase.case_status === "Draft" || currentCase.case_status === "Received" ? "Reassigned" : currentCase.case_status,
    });

    await client.query(
      `
      INSERT INTO case_assignment_history (
        fraud_case_id,
        previous_user,
        new_user,
        changed_by,
        change_reason
      )
      VALUES ($1::integer, $2::text, $3::text, $4::text, $5::text)
      `,
      [fraudCase.id, currentCase.assigned_user, assigned_user, assigned_by || "System", change_reason || "Case assigned"]
    );

    await insertActionLog(client, fraudCase.id, assigned_by || "System", fraudCase.case_status);
    await client.query("COMMIT");

    res.json(fraudCase);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to assign case", error: error.message });
  } finally {
    client.release();
  }
});

app.patch("/api/cases/:id/release-assignment", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { released_by, change_reason } = req.body;
    const currentCase = await findCaseByIdOrNumber(id, client);

    if (!currentCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    await client.query("BEGIN");

    const fraudCase = await updateFraudCase(client, id, {
      assigned_user: null,
      assignment_date: null,
      assigned_by: null,
      reassignment_reason: change_reason || "Assignment released",
    });

    await client.query(
      `
      INSERT INTO case_assignment_history (
        fraud_case_id,
        previous_user,
        new_user,
        changed_by,
        change_reason
      )
      VALUES ($1::integer, $2::text, $3::text, $4::text, $5::text)
      `,
      [fraudCase.id, currentCase.assigned_user, null, released_by || "System", change_reason || "Assignment released"]
    );

    await insertActionLog(client, fraudCase.id, released_by || "System", fraudCase.case_status);
    await client.query("COMMIT");

    res.json(fraudCase);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Failed to release assignment", error: error.message });
  } finally {
    client.release();
  }
});

app.get("/api/cases/:id/assignment-history", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    const result = await pool.query(
      `
      SELECT *
      FROM case_assignment_history
      WHERE fraud_case_id = $1::integer
      ORDER BY change_date DESC
      `,
      [fraudCase.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment history", error: error.message });
  }
});

app.get("/api/cases/:id/action-log", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    const result = await pool.query(
      `
      SELECT *
      FROM case_action_logs
      WHERE fraud_case_id = $1::integer
      ORDER BY action_time DESC
      `,
      [fraudCase.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch action log", error: error.message });
  }
});

app.get("/api/cases/:id/documents", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    const result = await pool.query(
      `
      SELECT *
      FROM case_documents
      WHERE fraud_case_id = $1::integer
      ORDER BY uploaded_at DESC
      `,
      [fraudCase.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch case documents", error: error.message });
  }
});

app.post("/api/cases/:id/upload-document", upload.single("document"), async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded. Use the field name 'document'." });
    }

    const supabase = getSupabaseClient();
    const bucket = getStorageBucket();
    const safeName = sanitizeFileName(req.file.originalname);
    const storagePath = `cases/${fraudCase.case_number}/${Date.now()}-${safeName}`;

    const uploadResult = await supabase.storage
      .from(bucket)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype || "application/octet-stream",
        upsert: false,
      });

    if (uploadResult.error) {
      return res.status(500).json({
        message: "Failed to upload file to Supabase Storage",
        error: uploadResult.error.message,
      });
    }

    const category = req.body.category || "supporting_document";
    const uploadedBy = req.body.uploaded_by || "Admin";

    const result = await pool.query(
      `
      INSERT INTO case_documents (
        fraud_case_id,
        file_name,
        file_type,
        file_url,
        storage_path,
        category,
        uploaded_by
      )
      VALUES ($1::integer, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text)
      RETURNING *
      `,
      [
        fraudCase.id,
        req.file.originalname,
        req.file.mimetype || null,
        null,
        storagePath,
        category,
        uploadedBy,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload case document", error: error.message });
  }
});

app.get("/api/documents/:documentId/download", async (req, res) => {
  try {
    const { documentId } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM case_documents
      WHERE id = $1::integer
      LIMIT 1
      `,
      [documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const document = result.rows[0];

    if (!document.storage_path) {
      if (document.file_url) return res.redirect(document.file_url);
      return res.status(404).json({ message: "Document has no storage path or URL" });
    }

    const supabase = getSupabaseClient();
    const bucket = getStorageBucket();

    const downloadResult = await supabase.storage
      .from(bucket)
      .download(document.storage_path);

    if (downloadResult.error) {
      return res.status(500).json({
        message: "Failed to download document from Supabase Storage",
        error: downloadResult.error.message,
      });
    }

    const arrayBuffer = await downloadResult.data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = sanitizeFileName(document.file_name || "document");

    res.setHeader("Content-Type", document.file_type || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", buffer.length);
    res.setHeader("Cache-Control", "private, no-store");

    return res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Failed to download document", error: error.message });
  }
});

app.post("/api/cases/:id/documents", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    const { file_name, file_type, file_url, category, uploaded_by } = req.body;

    const result = await pool.query(
      `
      INSERT INTO case_documents (
        fraud_case_id,
        file_name,
        file_type,
        file_url,
        category,
        uploaded_by
      )
      VALUES ($1::integer, $2::text, $3::text, $4::text, $5::text, $6::text)
      RETURNING *
      `,
      [fraudCase.id, file_name, file_type || null, file_url || null, category || null, uploaded_by || "System"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to save case document", error: error.message });
  }
});


app.get("/api/cases/:id/export-pdf", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) return res.status(404).json({ message: "Case not found" });

    const documentsResult = await pool.query(
      `
      SELECT *
      FROM case_documents
      WHERE fraud_case_id = $1::integer
      ORDER BY uploaded_at DESC
      `,
      [fraudCase.id]
    );

    const actionLogsResult = await pool.query(
      `
      SELECT *
      FROM case_action_logs
      WHERE fraud_case_id = $1::integer
      ORDER BY action_time DESC
      `,
      [fraudCase.id]
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 48,
      info: {
        Title: `Fraud Case Report - ${fraudCase.case_number}`,
        Author: "Fraud Management System",
      },
    });

    const fileName = `fraud-case-${fraudCase.case_number || fraudCase.id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);

    doc.font("Helvetica-Bold").fontSize(20).text("Fraud Case Report", { align: "center" });
    doc.moveDown(0.35);
    doc.font("Helvetica").fontSize(11).text(`Case Number: ${safePdfValue(fraudCase.case_number)}`, { align: "center" });
    doc.fontSize(9).text(`Generated At: ${formatPdfDateTime(new Date())}`, { align: "center" });
    doc.moveDown(1);

    addPdfSection(doc, "1. Reporter Details");
    addPdfField(doc, "Reporter Name", fraudCase.reporter_name);
    addPdfField(doc, "Email", fraudCase.reporter_email);
    addPdfField(doc, "Mobile Number", fraudCase.reporter_mobile);
    addPdfField(doc, "ID / Iqama Number", fraudCase.national_id_or_iqama);

    addPdfSection(doc, "2. Case Overview");
    addPdfField(doc, "Case Number", fraudCase.case_number);
    addPdfField(doc, "Case Entry Date", formatPdfDateTime(fraudCase.case_entry_date));
    addPdfField(doc, "Case Source", fraudCase.case_source);
    addPdfField(doc, "Other Case Source", fraudCase.case_source_other);
    addPdfField(doc, "Case Type", fraudCase.case_type);
    addPdfField(doc, "Priority Level", fraudCase.priority_level);
    addPdfField(doc, "Case Status", fraudCase.case_status);
    addPdfField(doc, "Insurance Type", fraudCase.insurance_type);
    addPdfField(doc, "Suspected Amount", fraudCase.suspected_amount);
    addPdfLongField(doc, "Description", fraudCase.description);

    if (fraudCase.has_claim) {
      addPdfSection(doc, "3. Claim Information");
      addPdfField(doc, "Claim Number", fraudCase.claim_id);
      addPdfField(doc, "Claim Type", fraudCase.claim_type);
      addPdfField(doc, "Claim Status", fraudCase.claim_status);
      addPdfField(doc, "Suspension Date", formatPdfDateTime(fraudCase.suspension_date));
      addPdfLongField(doc, "Suspension Reason", fraudCase.suspension_reason);
    }

    const isFraudCase = ["Fraud Confirmed", "Fraud Suspected", "احتيال مؤكد", "اشتباه الاحتيال"].includes(fraudCase.case_type);
    if (isFraudCase) {
      addPdfSection(doc, "4. Fraud Indicators");
      addPdfField(doc, "Fraud Confirmed Date", formatPdfDateTime(fraudCase.fraud_confirmed_date));
      addPdfField(doc, "Fraud Detection Method", fraudCase.fraud_detection_method);
      addPdfField(doc, "Fraud Amount", fraudCase.fraud_amount);
      addPdfField(doc, "Action Taken", fraudCase.action_taken);
      addPdfField(doc, "Referred Entity", fraudCase.referred_entity);
      addPdfField(doc, "Fraud Indicator Type", fraudCase.fraud_indicator_type);
      addPdfLongField(doc, "Indicator Description", fraudCase.indicator_description);
      addPdfField(doc, "Occurrence Count", fraudCase.occurrence_count);
      addPdfField(doc, "Risk Level", fraudCase.risk_level || fraudCase.risk_score);
    }

    addPdfSection(doc, "5. Decisions");
    addPdfField(doc, "Fraud Officer Decision", fraudCase.fraud_officer_decision);
    addPdfLongField(doc, "Fraud Unit Notes", fraudCase.fraud_unit_notes);
    addPdfField(doc, "Closure Date", formatPdfDateTime(fraudCase.closure_date));
    addPdfLongField(doc, "Closure Reason", fraudCase.closure_reason);

    addPdfSection(doc, "6. Attachments");
    if (documentsResult.rows.length === 0) {
      doc.font("Helvetica").fontSize(10).text("No attachments found.");
    } else {
      documentsResult.rows.forEach((item, index) => {
        doc.font("Helvetica-Bold").fontSize(10).text(`Attachment ${index + 1}`);
        addPdfField(doc, "File Name", item.file_name);
        addPdfField(doc, "File Type", item.file_type);
        addPdfField(doc, "Category", item.category);
        addPdfField(doc, "File URL", item.file_url);
        addPdfField(doc, "Uploaded By", item.uploaded_by);
        addPdfField(doc, "Uploaded At", formatPdfDateTime(item.uploaded_at));
        doc.moveDown(0.5);
      });
    }

    addPdfSection(doc, "7. Action Log");
    if (actionLogsResult.rows.length === 0) {
      doc.font("Helvetica").fontSize(10).text("No action logs found.");
    } else {
      actionLogsResult.rows.forEach((item, index) => {
        doc.font("Helvetica-Bold").fontSize(10).text(`Log ${index + 1}`);
        addPdfField(doc, "Responsible User", item.responsible_user);
        addPdfField(doc, "Status", item.status);
        addPdfField(doc, "Time", formatPdfDateTime(item.action_time));
        doc.moveDown(0.5);
      });
    }

    doc.moveDown(1);
    doc.font("Helvetica").fontSize(9).text("Generated by Fraud Management System", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to export case PDF", error: error.message });
  }
});


app.get("/api/reports/fraud-cases", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        case_number AS case_id,
        claim_id,
        case_entry_date,
        case_source,
        case_type,
        priority_level,
        case_status,
        fraud_unit_notes,
        closure_date,
        closure_reason,
        suspected_amount,
        insurance_type
      FROM fraud_cases
      WHERE COALESCE(case_status, '') <> 'Draft'
      ORDER BY case_entry_date DESC NULLS LAST, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fraud cases report",
      error: error.message,
    });
  }
});


app.get("/api/reports/confirmed-fraud", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        case_number AS case_id,
        claim_id,
        case_entry_date,
        case_source,
        case_type,
        priority_level,
        case_status,
        fraud_unit_notes,
        closure_date,
        closure_reason,
        suspected_amount,
        insurance_type
      FROM fraud_cases
      WHERE case_type IN ('Fraud Confirmed', 'احتيال مؤكد')
      ORDER BY case_entry_date DESC NULLS LAST, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch confirmed fraud report",
      error: error.message,
    });
  }
});


app.get("/api/reports/fraud-indicators", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        case_number AS case_id,
        claim_id,
        case_entry_date,
        case_source,
        case_type,
        priority_level,
        case_status,
        fraud_unit_notes,
        closure_date,
        closure_reason,
        suspected_amount,
        insurance_type
      FROM fraud_cases
      WHERE case_status IN ('Open', 'Closed')
        AND case_type IN ('Fraud Confirmed', 'Fraud Suspected', 'احتيال مؤكد', 'اشتباه الاحتيال')
      ORDER BY case_entry_date DESC NULLS LAST, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fraud indicators report",
      error: error.message,
    });
  }
});


app.get("/api/reports/suspended-claims", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        case_number AS case_id,
        claim_id,
        case_entry_date,
        case_source,
        case_type,
        priority_level,
        case_status,
        fraud_unit_notes,
        closure_date,
        closure_reason,
        suspected_amount,
        insurance_type
      FROM fraud_cases
      WHERE claim_status IN ('Suspended', 'معلق')
      ORDER BY case_entry_date DESC NULLS LAST, created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch suspended claims report",
      error: error.message,
    });
  }
});

app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total_cases,
        COUNT(*) FILTER (WHERE case_status IN ('Draft', 'Received'))::int AS new_cases,
        COUNT(*) FILTER (WHERE case_status = 'Open')::int AS cases_under_review,
        COUNT(*) FILTER (WHERE case_status = 'Reassigned')::int AS cases_under_investigation,
        COUNT(*) FILTER (WHERE case_type = 'Fraud Confirmed')::int AS confirmed_fraud_cases,
        COUNT(*) FILTER (WHERE case_status = 'Closed')::int AS closed_cases,
        COUNT(*) FILTER (WHERE assigned_user IS NULL OR assigned_user = '')::int AS unassigned_cases,
        COUNT(*) FILTER (WHERE priority_level = 'High')::int AS high_priority_cases,
        COALESCE(SUM(suspected_amount), 0)::numeric AS suspected_amount
      FROM fraud_cases
    `);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Fraud backend running on port ${PORT}`);
});
