import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases } from '../../data/mockData';

export default function ReportDetailsPage() {
  const { reportName } = useParams();
  const title = decodeURIComponent(reportName ?? 'Report');
  const [filters, setFilters] = useState({
    caseId: '',
    claimId: '',
    caseType: '',
    status: '',
    priority: '',
    insuranceType: '',
  });
  const [dateRange, setDateRange] = useState({
    startDate: '2026-04-01',
    endDate: '2026-04-07',
  });

  const filteredCases = useMemo(() => {
    return fraudCases.filter((item) => {
      return (
        item.id.toLowerCase().includes(filters.caseId.toLowerCase()) &&
        item.claimId.toLowerCase().includes(filters.claimId.toLowerCase()) &&
        item.caseType.toLowerCase().includes(filters.caseType.toLowerCase()) &&
        item.caseStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
        item.priorityLevel.toLowerCase().includes(filters.priority.toLowerCase()) &&
        item.insuranceType.toLowerCase().includes(filters.insuranceType.toLowerCase())
      );
    });
  }, [filters]);

  return (
    <div>
      <PageHeader
        title={title}
        subtitle="Preview page for report output and export actions."
        action={<div className="actions-inline"><button className="btn">Export PDF</button><button className="btn primary">Export Excel</button></div>}
      />
      <div className="card report-detail-filters">
        <input
          placeholder="Filter Case Id"
          value={filters.caseId}
          onChange={(event) => setFilters((current) => ({ ...current, caseId: event.target.value }))}
        />
        <input
          placeholder="Filter Claim Id"
          value={filters.claimId}
          onChange={(event) => setFilters((current) => ({ ...current, claimId: event.target.value }))}
        />
        <select
          value={filters.caseType}
          onChange={(event) => setFilters((current) => ({ ...current, caseType: event.target.value }))}
        >
          <option value="">All Case Types</option>
          <option value="Fraud Suspected">Fraud Suspected</option>
          <option value="Fraud Confirmed">Fraud Confirmed</option>
          <option value="Violation">Violation</option>
        </select>
        <select
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Pending Information">Pending Information</option>
          <option value="Fraud Confirmed">Fraud Confirmed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={filters.insuranceType}
          onChange={(event) => setFilters((current) => ({ ...current, insuranceType: event.target.value }))}
        >
          <option value="">All Insurance Types</option>
          <option value="Motor">Motor</option>
          <option value="Medical">Medical</option>
          <option value="Property">Property</option>
        </select>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(event) => setDateRange((current) => ({ ...current, startDate: event.target.value }))}
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(event) => setDateRange((current) => ({ ...current, endDate: event.target.value }))}
        />
      </div>
      <Table headers={['Case Id', 'Claim Id', 'Case Type', 'Status', 'Priority', 'Insurance Type', 'Amount']}>
        {filteredCases.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.claimId}</td>
            <td>{item.caseType}</td>
            <td>{item.caseStatus}</td>
            <td>{item.priorityLevel}</td>
            <td>{item.insuranceType}</td>
            <td>{item.suspectedAmount}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
