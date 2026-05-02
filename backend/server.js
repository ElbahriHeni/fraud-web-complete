const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL].filter(Boolean),
  })
);

app.use(express.json());

async function findCaseByIdOrNumber(id) {
  const result = await pool.query(
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
      return res.status(404).json({
        message: "Case not found",
      });
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
    const {
      claim_id,
      case_type,
      case_source,
      insurance_type,
      priority_level,
      suspected_amount,
      description,
      reporter_name,
      reporter_email,
      reporter_mobile,
      national_id_or_iqama,
      consent_to_terms_and_privacy,
      created_by,

      // Workflow / assignment fields
      case_status,
      assigned_user,
      assigned_by,
      reassignment_reason,
      assignment_date,
      closure_date,
      closure_reason,
      fraud_unit_notes,

      // Fraud indicators
      fraud_indicator_type,
      indicator_description,
      occurrence_count,
      risk_score,
      system_recommendation,
      fraud_officer_decision,

      // Confirmed fraud details
      claim_type,
      fraud_confirmed_date,
      fraud_detection_method,
      fraud_amount,
      action_taken,
      referred_entity,

      // Document metadata only for now
      documents,
    } = req.body;

    const caseNumber = `FC-${Date.now()}`;
    const createdBy = created_by || "Admin";
    const assignedBy = assigned_by || createdBy;
    const normalizedStatus = case_status || "New";

    await client.query("BEGIN");

    const result = await client.query(
      `
      INSERT INTO fraud_cases (
        case_number,
        claim_id,
        case_type,
        case_source,
        insurance_type,
        priority_level,
        suspected_amount,
        description,
        reporter_name,
        reporter_email,
        reporter_mobile,
        national_id_or_iqama,
        consent_to_terms_and_privacy,
        created_by,

        case_status,
        assigned_user,
        assignment_date,
        assigned_by,
        reassignment_reason,
        closure_date,
        closure_reason,
        fraud_unit_notes,

        fraud_indicator_type,
        indicator_description,
        occurrence_count,
        risk_score,
        system_recommendation,
        fraud_officer_decision,

        claim_type,
        fraud_confirmed_date,
        fraud_detection_method,
        fraud_amount,
        action_taken,
        referred_entity
      )
      VALUES (
        $1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::numeric,
        $8::text, $9::text, $10::text, $11::text, $12::text, $13::boolean, $14::text,
        $15::text, $16::text, $17::timestamp, $18::text, $19::text, $20::timestamp, $21::text, $22::text,
        $23::text, $24::text, $25::integer, $26::integer, $27::text, $28::text,
        $29::text, $30::timestamp, $31::text, $32::numeric, $33::text, $34::text
      )
      RETURNING *
      `,
      [
        caseNumber,
        claim_id || null,
        case_type || null,
        case_source || null,
        insurance_type || null,
        priority_level || null,
        suspected_amount || 0,
        description || null,
        reporter_name || null,
        reporter_email || null,
        reporter_mobile || null,
        national_id_or_iqama || null,
        Boolean(consent_to_terms_and_privacy),
        createdBy,

        normalizedStatus,
        assigned_user || null,
        assigned_user ? assignment_date || new Date() : null,
        assigned_user ? assignedBy : null,
        reassignment_reason || null,
        closure_date || null,
        closure_reason || null,
        fraud_unit_notes || null,

        fraud_indicator_type || null,
        indicator_description || null,
        occurrence_count ?? 0,
        risk_score ?? 0,
        system_recommendation || null,
        fraud_officer_decision || null,

        claim_type || null,
        fraud_confirmed_date || null,
        fraud_detection_method || null,
        fraud_amount || 0,
        action_taken || null,
        referred_entity || null,
      ]
    );

    const fraudCase = result.rows[0];

    if (assigned_user) {
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
        [
          fraudCase.id,
          null,
          assigned_user,
          assignedBy,
          reassignment_reason || "Case assigned during creation",
        ]
      );
    }

    if (Array.isArray(documents) && documents.length > 0) {
      for (const document of documents) {
        if (!document?.file_name) continue;

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

app.patch("/api/cases/:id/overview", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      claim_id,
      case_type,
      case_source,
      insurance_type,
      priority_level,
      suspected_amount,
      description,
      fraud_unit_notes,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE fraud_cases
      SET claim_id = COALESCE($1::text, claim_id),
          case_type = COALESCE($2::text, case_type),
          case_source = COALESCE($3::text, case_source),
          insurance_type = COALESCE($4::text, insurance_type),
          priority_level = COALESCE($5::text, priority_level),
          suspected_amount = COALESCE($6::numeric, suspected_amount),
          description = COALESCE($7::text, description),
          fraud_unit_notes = COALESCE($8::text, fraud_unit_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $9::text OR case_number = $9::text
      RETURNING *
      `,
      [
        claim_id ?? null,
        case_type ?? null,
        case_source ?? null,
        insurance_type ?? null,
        priority_level ?? null,
        suspected_amount ?? null,
        description ?? null,
        fraud_unit_notes ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update case overview",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/reporter", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reporter_name,
      reporter_email,
      reporter_mobile,
      national_id_or_iqama,
      consent_to_terms_and_privacy,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE fraud_cases
      SET reporter_name = COALESCE($1::text, reporter_name),
          reporter_email = COALESCE($2::text, reporter_email),
          reporter_mobile = COALESCE($3::text, reporter_mobile),
          national_id_or_iqama = COALESCE($4::text, national_id_or_iqama),
          consent_to_terms_and_privacy = COALESCE($5::boolean, consent_to_terms_and_privacy),
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $6::text OR case_number = $6::text
      RETURNING *
      `,
      [
        reporter_name ?? null,
        reporter_email ?? null,
        reporter_mobile ?? null,
        national_id_or_iqama ?? null,
        typeof consent_to_terms_and_privacy === "boolean" ? consent_to_terms_and_privacy : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update reporter details",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/indicators", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fraud_indicator_type,
      indicator_description,
      occurrence_count,
      risk_score,
      system_recommendation,
      fraud_officer_decision,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE fraud_cases
      SET fraud_indicator_type = COALESCE($1::text, fraud_indicator_type),
          indicator_description = COALESCE($2::text, indicator_description),
          occurrence_count = COALESCE($3::integer, occurrence_count),
          risk_score = COALESCE($4::integer, risk_score),
          system_recommendation = COALESCE($5::text, system_recommendation),
          fraud_officer_decision = COALESCE($6::text, fraud_officer_decision),
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $7::text OR case_number = $7::text
      RETURNING *
      `,
      [
        fraud_indicator_type ?? null,
        indicator_description ?? null,
        occurrence_count ?? null,
        risk_score ?? null,
        system_recommendation ?? null,
        fraud_officer_decision ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update fraud indicators",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/confirmed-fraud", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      claim_type,
      fraud_confirmed_date,
      fraud_detection_method,
      fraud_amount,
      action_taken,
      referred_entity,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE fraud_cases
      SET claim_type = COALESCE($1::text, claim_type),
          fraud_confirmed_date = COALESCE($2::timestamp, fraud_confirmed_date),
          fraud_detection_method = COALESCE($3::text, fraud_detection_method),
          fraud_amount = COALESCE($4::numeric, fraud_amount),
          action_taken = COALESCE($5::text, action_taken),
          referred_entity = COALESCE($6::text, referred_entity),
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $7::text OR case_number = $7::text
      RETURNING *
      `,
      [
        claim_type ?? null,
        fraud_confirmed_date || null,
        fraud_detection_method ?? null,
        fraud_amount ?? null,
        action_taken ?? null,
        referred_entity ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update confirmed fraud details",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { case_status, closure_reason, closure_date } = req.body;

    const result = await pool.query(
      `
      UPDATE fraud_cases
      SET case_status = $1::text,
          closure_reason = CASE
            WHEN $1::text = 'Closed' THEN COALESCE($2::text, closure_reason)
            ELSE closure_reason
          END,
          closure_date = CASE
            WHEN $1::text = 'Closed' THEN COALESCE($3::timestamp, CURRENT_TIMESTAMP)
            ELSE closure_date
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $4::text OR case_number = $4::text
      RETURNING *
      `,
      [case_status, closure_reason || null, closure_date || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update case status",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/assign", async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_user, assigned_by, change_reason } = req.body;

    const currentCase = await findCaseByIdOrNumber(id);

    if (!currentCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const caseResult = await pool.query(
      `
      UPDATE fraud_cases
      SET assigned_user = $1::text,
          assignment_date = CURRENT_TIMESTAMP,
          assigned_by = $2::text,
          reassignment_reason = $3::text,
          case_status = CASE
            WHEN case_status = 'New' THEN 'Under Review'
            ELSE case_status
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $4::text OR case_number = $4::text
      RETURNING *
      `,
      [assigned_user, assigned_by || "System", change_reason || "Case assigned", id]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    const fraudCase = caseResult.rows[0];

    await pool.query(
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
      [
        fraudCase.id,
        currentCase.assigned_user,
        assigned_user,
        assigned_by || "System",
        change_reason || "Case assigned",
      ]
    );

    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign case",
      error: error.message,
    });
  }
});

app.patch("/api/cases/:id/release-assignment", async (req, res) => {
  try {
    const { id } = req.params;
    const { released_by, change_reason } = req.body;

    const currentCase = await findCaseByIdOrNumber(id);

    if (!currentCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    const caseResult = await pool.query(
      `
      UPDATE fraud_cases
      SET assigned_user = NULL,
          assignment_date = NULL,
          assigned_by = NULL,
          reassignment_reason = $1::text,
          updated_at = CURRENT_TIMESTAMP
      WHERE id::text = $2::text OR case_number = $2::text
      RETURNING *
      `,
      [change_reason || "Assignment released", id]
    );

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    const fraudCase = caseResult.rows[0];

    await pool.query(
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
      [
        fraudCase.id,
        currentCase.assigned_user,
        null,
        released_by || "System",
        change_reason || "Assignment released",
      ]
    );

    res.json(fraudCase);
  } catch (error) {
    res.status(500).json({
      message: "Failed to release assignment",
      error: error.message,
    });
  }
});

app.get("/api/cases/:id/assignment-history", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

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
    res.status(500).json({
      message: "Failed to fetch assignment history",
      error: error.message,
    });
  }
});

app.get("/api/cases/:id/documents", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

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
    res.status(500).json({
      message: "Failed to fetch case documents",
      error: error.message,
    });
  }
});

app.post("/api/cases/:id/documents", async (req, res) => {
  try {
    const fraudCase = await findCaseByIdOrNumber(req.params.id);

    if (!fraudCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

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
      [
        fraudCase.id,
        file_name,
        file_type || null,
        file_url || null,
        category || null,
        uploaded_by || "System",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save case document",
      error: error.message,
    });
  }
});

app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total_cases,
        COUNT(*) FILTER (WHERE case_status = 'New')::int AS new_cases,
        COUNT(*) FILTER (WHERE case_status = 'Under Review')::int AS cases_under_review,
        COUNT(*) FILTER (WHERE case_status = 'Under Investigation')::int AS cases_under_investigation,
        COUNT(*) FILTER (WHERE case_status = 'Fraud Confirmed')::int AS confirmed_fraud_cases,
        COUNT(*) FILTER (WHERE case_status = 'Closed')::int AS closed_cases,
        COUNT(*) FILTER (WHERE assigned_user IS NULL OR assigned_user = '')::int AS unassigned_cases,
        COUNT(*) FILTER (WHERE priority_level = 'High')::int AS high_priority_cases,
        COALESCE(SUM(suspected_amount), 0)::numeric AS suspected_amount
      FROM fraud_cases
    `);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Fraud backend running on port ${PORT}`);
});
