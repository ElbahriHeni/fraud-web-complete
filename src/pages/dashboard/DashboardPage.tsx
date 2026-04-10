import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { dashboardCards, fraudCases } from '../../data/mockData';
import Table from '../../components/Table';

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="High-level view of fraud operations, queue health, and investigation workload."
        action={<Link className="btn primary" to="/app/reports">Generate Report</Link>}
      />
      <section className="dashboard-overview">
        <div className="card dashboard-summary">
          <div className="dashboard-summary-header">
            <div>
              <span className="eyebrow">Overview</span>
              <h3>Today&apos;s operations snapshot</h3>
              <p className="muted">A simpler view of queue health, active investigations, and immediate review pressure.</p>
            </div>
            <Link className="btn" to="/app/queue">Review Queue</Link>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="muted small">Open Cases</span>
              <strong>248</strong>
              <span className="muted small">Across all statuses</span>
            </div>
            <div className="summary-item">
              <span className="muted small">Under Investigation</span>
              <strong>37</strong>
              <span className="muted small">Active analyst workload</span>
            </div>
            <div className="summary-item">
              <span className="muted small">Unassigned</span>
              <strong>8</strong>
              <span className="muted small">Needs immediate pickup</span>
            </div>
            <div className="summary-item">
              <span className="muted small">Suspected Amount</span>
              <strong>SAR 95K</strong>
              <span className="muted small">High-value cases in review</span>
            </div>
          </div>
        </div>
      </section>
      <div className="card-grid">
        {dashboardCards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>
      <div className="two-col">
        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Cases By Status</h3>
              <p className="muted">Work distribution across the operating funnel.</p>
            </div>
            <span className="badge medium">Balanced</span>
          </div>
          <div className="bars">
            <div>
              <span className="bar-label"><span>New</span><span>19</span></span>
              <progress value={19} max={50} />
            </div>
            <div>
              <span className="bar-label"><span>Under Review</span><span>26</span></span>
              <progress value={26} max={50} />
            </div>
            <div>
              <span className="bar-label"><span>Under Investigation</span><span>37</span></span>
              <progress value={37} max={50} />
            </div>
            <div>
              <span className="bar-label"><span>Fraud Confirmed</span><span>14</span></span>
              <progress value={14} max={50} />
            </div>
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>Cases By Priority</h3>
              <p className="muted">Urgency mix used for daily staffing and handoff decisions.</p>
            </div>
            <span className="badge high">Attention</span>
          </div>
          <div className="bars">
            <div>
              <span className="bar-label"><span>High</span><span>11</span></span>
              <progress value={11} max={20} />
            </div>
            <div>
              <span className="bar-label"><span>Medium</span><span>8</span></span>
              <progress value={8} max={20} />
            </div>
            <div>
              <span className="bar-label"><span>Low</span><span>5</span></span>
              <progress value={5} max={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <span className="eyebrow">Team Activity</span>
          <h3>Recent analyst movement</h3>
          <div className="activity-list">
            <div className="activity-item">
              <strong>Fatimah Salem</strong>
              <span>Closed invoice mismatch review and escalated legal referral</span>
            </div>
            <div className="activity-item">
              <strong>Mohammed Hassan</strong>
              <span>Moved one motor violation into Under Review</span>
            </div>
            <div className="activity-item">
              <strong>Noura Khaled</strong>
              <span>Requested supporting attachments for a pending property case</span>
            </div>
          </div>
        </div>
      </div>
      <PageHeader title="Recent Cases" subtitle="Quick snapshot from the shared queue." />
      <Table
        title="Recent cases in motion"
        subtitle="The latest items surfaced for daily review."
        headers={['Case Id', 'Claim Id', 'Case Type', 'Priority', 'Status', 'Assigned User']}
      >
        {fraudCases.slice(0, 4).map((item) => (
          <tr key={item.id}>
            <td><Link className="text-link" to={`/app/cases/${item.id}`}>{item.id}</Link></td>
            <td>{item.claimId}</td>
            <td>{item.caseType}</td>
            <td><span className={`badge ${item.priorityLevel.toLowerCase()}`}>{item.priorityLevel}</span></td>
            <td>{item.caseStatus}</td>
            <td>{item.assignedUser ?? 'Unassigned'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
