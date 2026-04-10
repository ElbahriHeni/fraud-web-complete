import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { reports } from '../../data/mockData';

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Browse and open fraud reports." />
      <div className="card reports-filter">
        <input placeholder="Search reports" />
      </div>
      <div className="reports-grid">
        {reports.map((report) => (
          <div className="card report-card" key={report.name}>
            <span className="eyebrow">Report</span>
            <h3>{report.name}</h3>
            <p className="muted">{report.description}</p>
            <div className="actions-inline">
              <Link className="btn primary" to={`/app/reports/${encodeURIComponent(report.name)}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
