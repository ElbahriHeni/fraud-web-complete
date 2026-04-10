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
        subtitle="Complete view of the external submission, internal enrichment, workflow, indicators, and confirmed fraud details."
        action={<button className="btn primary">Save Changes</button>}
      />

      <section className="case-overview-grid">
        <div className="card case-overview-card">
          <span className="eyebrow">Case Overview</span>
          <div className="case-overview-top">
            <div>
              <h3>{item.id}</h3>
              <p className="muted">
                Claim {item.claimId} from {item.caseSource}
              </p>
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
              <span className="muted small">Case Entry Date</span>
              <strong>{item.caseEntryDate}</strong>
            </div>
            <div className="case-metric">
              <span className="muted small">Closure Date</span>
              <strong>{item.closureDate || 'Not Closed'}</strong>
            </div>
            <div className="case-metric">
              <span className="muted small">Closure Reason</span>
              <strong>{item.closureReason || 'Not Available'}</strong>
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
              <span className="muted small">Mobile Number</span>
              <strong>{item.reporterMobile}</strong>
            </div>
            <div>
              <span className="muted small">National Id / Iqama</span>
              <strong>{item.nationalIdOrIqama}</strong>
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
            <span className="eyebrow">External Submission</span>
            <h3>Reporter submission details</h3>
            <div className="form-grid single">
              <label>
                <span>Submission Details</span>
                <textarea defaultValue={item.submissionDetails} rows={6} />
              </label>

              <label>
                <span>Consent To Terms And Privacy</span>
                <input defaultValue={item.consentToTermsAndPrivacy ? 'Yes' : 'No'} readOnly />
              </label>

              <div>
                <span>Attachments</span>
                <div className="activity-list top-gap">
                  {item.attachments.length > 0 ? (
                    item.attachments.map((attachment) => (
                      <div className="activity-item" key={attachment.id}>
                        <strong>{attachment.fileName}</strong>
                        <span>{attachment.fileType}</span>
                      </div>
                    ))
                  ) : (
                    <div className="activity-item">
                      <strong>No Attachments</strong>
                      <span>No supporting files submitted yet.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="eyebrow">Workflow</span>
            <h3>Assignment and status</h3>
            <div className="form-grid single">
              <label>
                <span>Assigned User</span>
                <select defaultValue={item.assignedUser ?? ''}>
                  <option value="">Unassigned</option>
                  {users
                    .filter((u) => u.role === 'Fraud Team Member')
                    .map((u) => (
                      <option key={u.id}>{u.fullName}</option>
                    ))}
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

              <div className="two-col-form form-grid">
                <label>
                  <span>Assignment Date</span>
                  <input defaultValue={item.assignmentDate} placeholder="Assignment Date" />
                </label>
                <label>
                  <span>Assigned By</span>
                  <input defaultValue={item.assignedBy} placeholder="Assigned By" />
                </label>
              </div>

              <label>
                <span>Reassignment Reason</span>
                <input defaultValue={item.reassignmentReason} placeholder="Reassignment Reason" />
              </label>

              <label>
                <span>Closure Date</span>
                <input type="date" defaultValue={item.closureDate} />
              </label>

              <label>
                <span>Closure Reason</span>
                <input defaultValue={item.closureReason} placeholder="Closure Reason" />
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
              <label>
                <span>Fraud Indicator Type</span>
                <input defaultValue={item.fraudIndicator.fraudIndicatorType} />
              </label>

              <label>
                <span>Indicator Description</span>
                <textarea rows={4} defaultValue={item.fraudIndicator.indicatorDescription} />
              </label>

              <div className="two-col-form form-grid">
                <label>
                  <span>Occurrence Count</span>
                  <input defaultValue={String(item.fraudIndicator.occurrenceCount)} />
                </label>
                <label>
                  <span>Risk Score</span>
                  <input defaultValue={String(item.fraudIndicator.riskScore)} />
                </label>
              </div>

              <label>
                <span>System Recommendation</span>
                <input defaultValue={item.fraudIndicator.systemRecommendation} />
              </label>

              <label>
                <span>Fraud Officer Decision</span>
                <input defaultValue={item.fraudIndicator.fraudOfficerDecision} />
              </label>
            </div>
          </div>
        </div>

        <div className="case-side-column">
          <div className="card">
            <span className="eyebrow">Confirmed Fraud</span>
            <h3>Fraud details</h3>
            <div className="form-grid single">
              <label>
                <span>Claim Type</span>
                <input defaultValue={item.claimType} />
              </label>
              <label>
                <span>Fraud Confirmed Date</span>
                <input type="date" defaultValue={item.fraudConfirmedDate} />
              </label>
              <label>
                <span>Fraud Detection Method</span>
                <input defaultValue={item.fraudDetectionMethod} />
              </label>
              <label>
                <span>Fraud Amount</span>
                <input defaultValue={item.fraudAmount} />
              </label>
              <label>
                <span>Action Taken</span>
                <input defaultValue={item.actionTaken} />
              </label>
              <label>
                <span>Referred Entity</span>
                <input defaultValue={item.referredEntity} />
              </label>
            </div>
          </div>

          <div className="card case-quick-notes">
            <span className="eyebrow">Assignment History</span>
            <h3>Ownership trail</h3>
            <div className="activity-list">
              {item.assignmentHistory.map((entry, index) => (
                <div className="activity-item" key={`${entry.changeDate}-${index}`}>
                  <strong>
                    {entry.previousUser ?? 'Unassigned'} → {entry.newUser ?? 'Unassigned'}
                  </strong>
                  <span>
                    {entry.changeDate} | Changed By: {entry.changedBy} | Reason: {entry.changeReason}
                  </span>
                </div>
              ))}
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
                <span>
                  {item.reporterName} submitted this case through {item.caseSource}.
                </span>
              </div>
              <div className="activity-item">
                <strong>Exposure</strong>
                <span>{item.suspectedAmount} currently marked as suspected amount.</span>
              </div>
              <div className="activity-item">
                <strong>Closure</strong>
                <span>{item.closureReason || 'Case still open and under active handling.'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
