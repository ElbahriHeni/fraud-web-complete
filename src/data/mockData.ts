import { FraudCase, KpiCard, User } from '../types';

export const dashboardCards: KpiCard[] = [
  { title: 'Total Cases', value: '248', subtitle: '+12 this week' },
  { title: 'New Cases', value: '19', subtitle: 'Awaiting assignment' },
  { title: 'Cases Under Investigation', value: '37', subtitle: 'Active workload' },
  { title: 'Confirmed Fraud Cases', value: '14', subtitle: 'This month' },
  { title: 'Unassigned Cases', value: '8', subtitle: 'Shared queue' },
  { title: 'High Priority Cases', value: '11', subtitle: 'Immediate review' },
];

export const fraudCases: FraudCase[] = [
  {
    id: 'FC-1001', claimId: 'CL-90811', caseType: 'Fraud Suspected', caseSource: 'Whistleblowing', priorityLevel: 'High',
    caseStatus: 'New', assignedUser: null, caseEntryDate: '2026-04-06', insuranceType: 'Motor', suspectedAmount: 'SAR 18,000',
    fraudUnitNotes: 'External submission pending review.', reporterName: 'Ahmed Ali', reporterEmail: 'ahmed@email.com'
  },
  {
    id: 'FC-1002', claimId: 'CL-90321', caseType: 'Fraud Confirmed', caseSource: 'Internal', priorityLevel: 'High',
    caseStatus: 'Fraud Confirmed', assignedUser: 'Fatimah Salem', caseEntryDate: '2026-04-04', insuranceType: 'Medical', suspectedAmount: 'SAR 42,500',
    fraudUnitNotes: 'Mismatch between invoices and provider records.', reporterName: 'Internal Team', reporterEmail: 'internal@company.com'
  },
  {
    id: 'FC-1003', claimId: 'CL-90201', caseType: 'Violation', caseSource: 'Website', priorityLevel: 'Medium',
    caseStatus: 'Under Review', assignedUser: 'Mohammed Hassan', caseEntryDate: '2026-04-03', insuranceType: 'Motor', suspectedAmount: 'SAR 7,200',
    fraudUnitNotes: 'Needs policy verification.', reporterName: 'Sara Omar', reporterEmail: 'sara@email.com'
  },
  {
    id: 'FC-1004', claimId: 'CL-90012', caseType: 'Fraud Suspected', caseSource: 'Call Center', priorityLevel: 'Low',
    caseStatus: 'Pending Information', assignedUser: 'Noura Khaled', caseEntryDate: '2026-04-01', insuranceType: 'Property', suspectedAmount: 'SAR 3,100',
    fraudUnitNotes: 'Waiting for supporting attachments.', reporterName: 'Call Center Agent', reporterEmail: 'agent@company.com'
  },
  {
    id: 'FC-1005', claimId: 'CL-89988', caseType: 'Fraud Suspected', caseSource: 'Website', priorityLevel: 'High',
    caseStatus: 'Under Investigation', assignedUser: 'Abdullah Saad', caseEntryDate: '2026-03-30', insuranceType: 'Medical', suspectedAmount: 'SAR 24,750',
    fraudUnitNotes: 'AI indicator score is high.', reporterName: 'Anonymous', reporterEmail: 'n/a'
  },
];

export const users: User[] = [
  { id: 'U-001', fullName: 'Fatimah Salem', username: 'fsalem', email: 'fatimah@fraud.sa', mobile: '0500000001', role: 'Fraud Team Member', status: 'Active', creationDate: '2026-01-10' },
  { id: 'U-002', fullName: 'Mohammed Hassan', username: 'mhassan', email: 'mohammed@fraud.sa', mobile: '0500000002', role: 'Fraud Team Member', status: 'Active', creationDate: '2026-01-12' },
  { id: 'U-003', fullName: 'Noura Khaled', username: 'nkhaled', email: 'noura@fraud.sa', mobile: '0500000003', role: 'Fraud Team Member', status: 'Active', creationDate: '2026-01-13' },
  { id: 'U-004', fullName: 'Abdullah Saad', username: 'asaad', email: 'abdullah@fraud.sa', mobile: '0500000004', role: 'Fraud Team Member', status: 'Active', creationDate: '2026-01-14' },
  { id: 'U-005', fullName: 'Admin User', username: 'admin', email: 'admin@fraud.sa', mobile: '0500000099', role: 'System Administrator', status: 'Active', creationDate: '2026-01-05' },
];

export const reports = [
  { name: 'Fraud Cases Report', description: 'All registered fraud cases with case details and closure info.' },
  { name: 'Confirmed Fraud Report', description: 'Cases where fraud has been confirmed.' },
  { name: 'Fraud Indicators Report', description: 'System-detected fraud indicators and analyst decisions.' },
  { name: 'Suspended Claims Report', description: 'Claims suspended due to fraud suspicion.' },
  { name: 'Fraud Performance Report', description: 'Fraud unit workload and performance summary.' },
];
