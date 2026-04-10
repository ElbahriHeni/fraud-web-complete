import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { fraudCases, users } from '../../data/mockData';

export default function CaseDetailsPage() {
  const { caseId } = useParams();
  const item = fraudCases.find((entry) => entry.id === caseId) ?? fraudCases[0];

  return (
    <div>
      <PageHeader
        title={`Case Details - ${item.id}`}
        subtitle="Review the case overview first, then update workflow, indicators, and confirmed fraud details."
        action={<button className="btn primary">Save Changes</button>}
      />

      <section className="case-overview-grid">
        <div className="card case-overview-card">
          <span className="eyebrow">Case Overview</span>
          <div className="case-overview-top">
            <div>
              <h3>{item.id}</h3>
              <p className="muted">Claim {item.claimId} from {item.caseSource}</p>
            </div>
            <div className="actions-inline">
              <span className={`badge ${item.priorityLevel.toLowerCase()}`}>{item.priorityLevel}</span>
              <span className="case-status-pill">{item.caseStatus}</span>
            </div>
          </div>
          <div className="case-metric-grid">
            <div className="case-metric">
              <span className="muted small">Case Type</span>
              <strong>{item.caseType}</strong>
            </div>
            <div className="case-metric">
              <span className="muted small">Insurance Type</span>
              <strong>{item.insuranceType}</strong>
            </div>
            <div className="case-metric">
              <span className="muted small">Suspected Amount</span>
              <strong>{item.suspectedAmount}</strong>
            </div>
            <div className="case-metric">
              <span className="muted small">Entry Date</span>
              <strong>{item.caseEntryDate}</strong>
            </div>
          </div>
        </div>

        <div className="card case-contact-card">
          <span className="eyebrow">Reporter</span>
          <h3>{item.reporterName}</h3>
          <div className="case-contact-list">
            <div>
              <span className="muted small">Email</span>
              <strong>{item.reporterEmail}</strong>
            </div>
            <div>
              <span className="muted small">Assigned User</span>
              <strong>{item.assignedUser ?? 'Unassigned'}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="case-main-grid">
        <div className="case-main-column">
          <div className="card">
            <span className="eyebrow">Workflow</span>
            <h3>Assignment and status</h3>
            <div className="form-grid single">
              <label>
                <span>Assigned User</span>
                <select defaultValue={item.assignedUser ?? ''}>
                  <option value="">Unassigned</option>
                  {users.filter((u) => u.role === 'Fraud Team Member').map((u) => <option key={u.id}>{u.fullName}</option>)}
                </select>
              </label>
              <label>
                <span>Case Status</span>
                <select defaultValue={item.caseStatus}>
                  <option>New</option>
                  <option>Under Review</option>
                  <option>Under Investigation</option>
                  <option>Pending Information</option>
                  <option>Fraud Confirmed</option>
                  <option>Rejected</option>
                  <option>Closed</option>
                </select>
              </label>
              <label>
                <span>Fraud Unit Notes</span>
                <textarea defaultValue={item.fraudUnitNotes} rows={6} />
              </label>
              <div className="actions-inline">
                <button className="btn primary">Save Changes</button>
                <button className="btn">Release Assignment</button>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="eyebrow">Indicators</span>
            <h3>Fraud indicators</h3>
            <div className="form-grid single">
              <label><span>Fraud Indicator Type</span><input defaultValue="Duplicate Claims" /></label>
              <label><span>Indicator Description</span><textarea rows={4} defaultValue="Potential duplicate claims submitted within short period." /></label>
              <div className="two-col-form form-grid">
                <label><span>Occurrence Count</span><input defaultValue="3" /></label>
                <label><span>Risk Score</span><input defaultValue="92" /></label>
              </div>
              <label><span>System Recommendation</span><input defaultValue="Escalate for full investigation" /></label>
              <label><span>Fraud Officer Decision</span><input defaultValue="Proceed with investigation" /></label>
            </div>
          </div>
        </div>

        <div className="case-side-column">
          <div className="card">
            <span className="eyebrow">Confirmed Fraud</span>
            <h3>Fraud details</h3>
            <div className="form-grid single">
              <label><span>Claim Type</span><input defaultValue="Reimbursement" /></label>
              <label><span>Fraud Confirmed Date</span><input type="date" defaultValue="2026-04-06" /></label>
              <label><span>Fraud Detection Method</span><input defaultValue="Manual Review + AI Indicator" /></label>
              <label><span>Fraud Amount</span><input defaultValue="SAR 18,000" /></label>
              <label><span>Action Taken</span><input defaultValue="Escalated to legal" /></label>
              <label><span>Referred Entity</span><input defaultValue="Compliance Department" /></label>
            </div>
          </div>

          <div className="card case-quick-notes">
            <span className="eyebrow">Quick View</span>
            <h3>What matters most</h3>
            <div className="activity-list">
              <div className="activity-item">
                <strong>Priority</strong>
                <span>{item.priorityLevel} priority case requiring active follow-up.</span>
              </div>
              <div className="activity-item">
                <strong>Reporter</strong>
                <span>{item.reporterName} submitted this case through {item.caseSource}.</span>
              </div>
              <div className="activity-item">
                <strong>Exposure</strong>
                <span>{item.suspectedAmount} currently marked as suspected amount.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
