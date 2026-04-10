import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases } from '../../data/mockData';

const uniqueValues = <T,>(values: T[]) => Array.from(new Set(values));

interface SearchableFilterProps {
  listId: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function SearchableFilter({ listId, placeholder, value, options, onChange }: SearchableFilterProps) {
  return (
    <>
      <input
        list={listId}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={listId}>
        {options.map((option) => <option key={option} value={option} />)}
      </datalist>
    </>
  );
}

export default function FraudQueuePage() {
  const [filters, setFilters] = useState({
    caseId: '',
    claimId: '',
    caseType: '',
    caseSource: '',
    priorityLevel: '',
    caseStatus: '',
    assignedUser: '',
    caseEntryDate: '',
    insuranceType: '',
  });

  const filterOptions = useMemo(() => {
    return {
      caseIds: uniqueValues(fraudCases.map((item) => item.id)),
      claimIds: uniqueValues(fraudCases.map((item) => item.claimId)),
      caseTypes: uniqueValues(fraudCases.map((item) => item.caseType)),
      caseSources: uniqueValues(fraudCases.map((item) => item.caseSource)),
      priorities: uniqueValues(fraudCases.map((item) => item.priorityLevel)),
      statuses: uniqueValues(fraudCases.map((item) => item.caseStatus)),
      assignedUsers: uniqueValues(fraudCases.map((item) => item.assignedUser ?? 'Unassigned')),
      caseEntryDates: uniqueValues(fraudCases.map((item) => item.caseEntryDate)),
      insuranceTypes: uniqueValues(fraudCases.map((item) => item.insuranceType)),
    };
  }, []);

  const filteredCases = useMemo(() => {
    return fraudCases.filter((item) => {
      const assignedValue = item.assignedUser ?? 'Unassigned';

      return (
        (!filters.caseId || item.id === filters.caseId) &&
        (!filters.claimId || item.claimId === filters.claimId) &&
        (!filters.caseType || item.caseType === filters.caseType) &&
        (!filters.caseSource || item.caseSource === filters.caseSource) &&
        (!filters.priorityLevel || item.priorityLevel === filters.priorityLevel) &&
        (!filters.caseStatus || item.caseStatus === filters.caseStatus) &&
        (!filters.assignedUser || assignedValue === filters.assignedUser) &&
        (!filters.caseEntryDate || item.caseEntryDate === filters.caseEntryDate) &&
        (!filters.insuranceType || item.insuranceType === filters.insuranceType)
      );
    });
  }, [filters]);

  return (
    <div>
      <PageHeader title="Fraud Queue" subtitle="Shared team queue with assignment and status tracking." action={<button className="btn">Export</button>} />
      <div className="card queue-filters">
        <SearchableFilter
          listId="queue-case-ids"
          placeholder="Search Case Id"
          value={filters.caseId}
          options={filterOptions.caseIds}
          onChange={(value) => setFilters((current) => ({ ...current, caseId: value }))}
        />
        <SearchableFilter
          listId="queue-claim-ids"
          placeholder="Search Claim Id"
          value={filters.claimId}
          options={filterOptions.claimIds}
          onChange={(value) => setFilters((current) => ({ ...current, claimId: value }))}
        />
        <SearchableFilter
          listId="queue-case-types"
          placeholder="Search Case Type"
          value={filters.caseType}
          options={filterOptions.caseTypes}
          onChange={(value) => setFilters((current) => ({ ...current, caseType: value }))}
        />
        <SearchableFilter
          listId="queue-case-sources"
          placeholder="Search Case Source"
          value={filters.caseSource}
          options={filterOptions.caseSources}
          onChange={(value) => setFilters((current) => ({ ...current, caseSource: value }))}
        />
        <SearchableFilter
          listId="queue-priorities"
          placeholder="Search Priority"
          value={filters.priorityLevel}
          options={filterOptions.priorities}
          onChange={(value) => setFilters((current) => ({ ...current, priorityLevel: value }))}
        />
        <SearchableFilter
          listId="queue-statuses"
          placeholder="Search Status"
          value={filters.caseStatus}
          options={filterOptions.statuses}
          onChange={(value) => setFilters((current) => ({ ...current, caseStatus: value }))}
        />
        <SearchableFilter
          listId="queue-assigned-users"
          placeholder="Search Assigned User"
          value={filters.assignedUser}
          options={filterOptions.assignedUsers}
          onChange={(value) => setFilters((current) => ({ ...current, assignedUser: value }))}
        />
        <SearchableFilter
          listId="queue-entry-dates"
          placeholder="Search Entry Date"
          value={filters.caseEntryDate}
          options={filterOptions.caseEntryDates}
          onChange={(value) => setFilters((current) => ({ ...current, caseEntryDate: value }))}
        />
        <SearchableFilter
          listId="queue-insurance-types"
          placeholder="Search Insurance Type"
          value={filters.insuranceType}
          options={filterOptions.insuranceTypes}
          onChange={(value) => setFilters((current) => ({ ...current, insuranceType: value }))}
        />
      </div>
      <Table headers={['Case Id', 'Claim Id', 'Case Type', 'Case Source', 'Priority Level', 'Case Status', 'Assigned User', 'Case Entry Date', 'Insurance Type', 'Suspected Amount']}>
        {filteredCases.map((item) => (
          <tr key={item.id}>
            <td><Link className="text-link" to={`/app/cases/${item.id}`}>{item.id}</Link></td>
            <td>{item.claimId}</td>
            <td>{item.caseType}</td>
            <td>{item.caseSource}</td>
            <td><span className={`badge ${item.priorityLevel.toLowerCase()}`}>{item.priorityLevel}</span></td>
            <td>{item.caseStatus}</td>
            <td>{item.assignedUser ?? 'Unassigned'}</td>
            <td>{item.caseEntryDate}</td>
            <td>{item.insuranceType}</td>
            <td>{item.suspectedAmount}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
