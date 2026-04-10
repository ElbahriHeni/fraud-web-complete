export type CaseStatus = 'New' | 'Under Review' | 'Under Investigation' | 'Pending Information' | 'Fraud Confirmed' | 'Rejected' | 'Closed';
export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface FraudCase {
  id: string;
  claimId: string;
  caseType: string;
  caseSource: string;
  priorityLevel: PriorityLevel;
  caseStatus: CaseStatus;
  assignedUser: string | null;
  caseEntryDate: string;
  insuranceType: string;
  suspectedAmount: string;
  fraudUnitNotes: string;
  reporterName: string;
  reporterEmail: string;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  status: 'Active' | 'Inactive';
  creationDate: string;
}

export interface KpiCard {
  title: string;
  value: string;
  subtitle?: string;
}
