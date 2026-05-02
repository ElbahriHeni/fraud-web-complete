import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { apiGet } from '../../api';
import type { AppLanguage } from '../../layout/AppLayout';

const CURRENT_USER = 'Fatimah Salem';

type BackendFraudCase = {
  id: number;
  case_number: string;
  claim_id: string | null;
  case_type: string | null;
  case_source: string | null;
  priority_level: string | null;
  case_status: string | null;
  assigned_user: string | null;
  case_entry_date: string | null;
  insurance_type: string | null;
  suspected_amount: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_mobile: string | null;
};

type QueueCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;

  export: string;
  viewCases: string;
  assignToMe: string;
  reassign: string;
  releaseAssignment: string;
  openCase: string;
  updateStatus: string;
  addNote: string;
  createCase: string;

  all: string;
  unassigned: string;
  assignedToMe: string;
  inProgress: string;
  closed: string;

  filtersTitle: string;
  allCases: string;
  highPriority: string;
  underReview: string;
  underInvestigation: string;
  fraudConfirmed: string;
  byInsuranceType: string;
  byCaseType: string;
  byDateRange: string;

  searchTitle: string;
  searchBy: string;
  searchValue: string;
  caseId: string;
  claimId: string;
  caseType: string;
  reporterName: string;
  emailAddress: string;
  mobileNumber: string;

  columnsTitle: string;
  columnsSubtitle: string;
  caseSource: string;
  priorityLevel: string;
  caseStatus: string;
  assignedUser: string;
  caseEntryDate: string;
  insuranceType: string;
  suspectedAmount: string;
  rowActions: string;

  newLabel: string;
  pendingInformation: string;
  rejected: string;

  motor: string;
  medical: string;
  property: string;
  travel: string;

  fraudSuspected: string;
  fraudConfirmedType: string;
  violation: string;
  documentMismatch: string;
  identityConcern: string;

  whistleblowing: string;
  internal: string;
  website: string;
  callCenter: string;
  providerAudit: string;
  customerCare: string;

  high: string;
  medium: string;
  low: string;

  unassignedValue: string;
  noResults: string;
};

const pageCopy: Record<AppLanguage, QueueCopy> = {
  en: {
    eyebrow: 'Workspace',
    title: 'Fraud Queue',
    subtitle: 'Shared team queue with assignment, prioritization, and workflow tracking.',

    export: 'Export',
    viewCases: 'View Cases',
    assignToMe: 'Assign To Me',
    reassign: 'Reassign',
    releaseAssignment: 'Release Assignment',
    openCase: 'Open Case',
    updateStatus: 'Update Status',
    addNote: 'Add Note',
    createCase: 'Create Case',

    all: 'All',
    unassigned: 'Unassigned',
    assignedToMe: 'Assigned To Me',
    inProgress: 'In Progress',
    closed: 'Closed',

    filtersTitle: 'Filters',
    allCases: 'All Cases',
    highPriority: 'High Priority',
    underReview: 'Under Review',
    underInvestigation: 'Under Investigation',
    fraudConfirmed: 'Fraud Confirmed',
    byInsuranceType: 'By Insurance Type',
    byCaseType: 'By Case Type',
    byDateRange: 'By Date Range',

    searchTitle: 'Search',
    searchBy: 'Search By',
    searchValue: 'Enter search value',
    caseId: 'Case Id',
    claimId: 'Claim Id',
    caseType: 'Case Type',
    reporterName: 'Reporter Name',
    emailAddress: 'Email Address',
    mobileNumber: 'Mobile Number',

    columnsTitle: 'Queue Cases',
    columnsSubtitle: 'Cases available for review, assignment, and status follow-up.',
    caseSource: 'Case Source',
    priorityLevel: 'Priority Level',
    caseStatus: 'Case Status',
    assignedUser: 'Assigned User',
    caseEntryDate: 'Case Entry Date',
    insuranceType: 'Insurance Type',
    suspectedAmount: 'Suspected Amount',
    rowActions: 'Actions',

    newLabel: 'New',
    pendingInformation: 'Pending Information',
    rejected: 'Rejected',

    motor: 'Motor',
    medical: 'Medical',
    property: 'Property',
    travel: 'Travel',

    fraudSuspected: 'Fraud Suspected',
    fraudConfirmedType: 'Fraud Confirmed',
    violation: 'Violation',
    documentMismatch: 'Document Mismatch',
    identityConcern: 'Identity Concern',

    whistleblowing: 'Whistleblowing',
    internal: 'Internal',
    website: 'Website',
    callCenter: 'Call Center',
    providerAudit: 'Provider Audit',
    customerCare: 'Customer Care',

    high: 'High',
    medium: 'Medium',
    low: 'Low',

    unassignedValue: 'Unassigned',
    noResults: 'No matching cases found.',
  },
  ar: {
    eyebrow: 'مساحة العمل',
    title: 'قائمة بلاغات الاحتيال',
    subtitle: 'قائمة مشتركة للفريق مع التعيين، وتحديد الأولوية، ومتابعة سير العمل.',

    export: 'تصدير',
    viewCases: 'عرض البلاغات',
    assignToMe: 'تعيين لنفسي',
    reassign: 'إعادة التعيين',
    releaseAssignment: 'إلغاء التعيين',
    openCase: 'فتح البلاغ',
    updateStatus: 'تحديث الحالة',
    addNote: 'إضافة ملاحظة',
    createCase: 'إنشاء بلاغ',

    all: 'الكل',
    unassigned: 'غير المعيّنة',
    assignedToMe: 'المعيّنة لي',
    inProgress: 'قيد العمل',
    closed: 'المغلقة',

    filtersTitle: 'الفلاتر',
    allCases: 'جميع البلاغات',
    highPriority: 'عالية الأولوية',
    underReview: 'قيد المراجعة',
    underInvestigation: 'قيد التحقيق',
    fraudConfirmed: 'تم تأكيد الاحتيال',
    byInsuranceType: 'حسب نوع التأمين',
    byCaseType: 'حسب نوع البلاغ',
    byDateRange: 'حسب الفترة الزمنية',

    searchTitle: 'البحث',
    searchBy: 'البحث حسب',
    searchValue: 'أدخل قيمة البحث',
    caseId: 'رقم البلاغ',
    claimId: 'رقم المطالبة',
    caseType: 'نوع البلاغ',
    reporterName: 'اسم المبلّغ',
    emailAddress: 'البريد الإلكتروني',
    mobileNumber: 'رقم الجوال',

    columnsTitle: 'قائمة البلاغات',
    columnsSubtitle: 'البلاغات المتاحة للمراجعة، والتعيين، ومتابعة الحالة.',
    caseSource: 'طريقة استقبال البلاغ',
    priorityLevel: 'مستوى الأولوية',
    caseStatus: 'حالة البلاغ',
    assignedUser: 'المستخدم المسؤول',
    caseEntryDate: 'تاريخ إدخال البلاغ',
    insuranceType: 'نوع التأمين',
    suspectedAmount: 'المبلغ محل الاشتباه',
    rowActions: 'الإجراءات',

    newLabel: 'جديد',
    pendingInformation: 'بانتظار معلومات',
    rejected: 'مرفوض',

    motor: 'مركبات',
    medical: 'طبي',
    property: 'ممتلكات',
    travel: 'سفر',

    fraudSuspected: 'اشتباه احتيال',
    fraudConfirmedType: 'تم تأكيد الاحتيال',
    violation: 'مخالفة',
    documentMismatch: 'عدم تطابق المستندات',
    identityConcern: 'اشتباه في الهوية',

    whistleblowing: 'الإبلاغ الداخلي',
    internal: 'داخلي',
    website: 'الموقع الإلكتروني',
    callCenter: 'مركز الاتصال',
    providerAudit: 'تدقيق مقدم الخدمة',
    customerCare: 'خدمة العملاء',

    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',

    unassignedValue: 'غير معيّن',
    noResults: 'لا توجد بلاغات مطابقة.',
  },
};

type SearchField = 'caseId' | 'claimId' | 'reporterName' | 'reporterEmail' | 'reporterMobile';

export default function FraudQueuePage() {
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';

  const [cases, setCases] = useState<BackendFraudCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState('');

  const [searchField, setSearchField] = useState<SearchField>('caseId');
  const [searchValue, setSearchValue] = useState('');
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useState('');
  const [caseTypeFilter, setCaseTypeFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCases() {
      try {
        setIsLoadingCases(true);
        setCasesError('');

        const data = await apiGet<BackendFraudCase[]>('/api/cases');

        if (isMounted) {
          setCases(data);
        }
      } catch (error) {
        if (isMounted) {
          setCasesError('Could not load fraud cases from backend.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingCases(false);
        }
      }
    }

    loadCases();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (value: string | null) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-GB');
  };

  const formatAmount = (value: string | null) => {
    const numericValue = Number(value || 0);
    return `${numericValue.toLocaleString()} SAR`;
  };

  const insuranceOptions = useMemo(
    () =>
      Array.from(
        new Set(cases.map((item) => item.insurance_type).filter(Boolean))
      ) as string[],
    [cases]
  );

  const caseTypeOptions = useMemo(
    () =>
      Array.from(
        new Set(cases.map((item) => item.case_type).filter(Boolean))
      ) as string[],
    [cases]
  );

  const dateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          cases
            .map((item) => formatDate(item.case_entry_date))
            .filter((value) => value && value !== '-')
        )
      ),
    [cases]
  );

  const searchFieldOptions = useMemo(
    () => [
      { value: 'caseId', label: t.caseId },
      { value: 'claimId', label: t.claimId },
      { value: 'reporterName', label: t.reporterName },
      { value: 'reporterEmail', label: t.emailAddress },
      { value: 'reporterMobile', label: t.mobileNumber },
    ],
    [t]
  );

  const quickFilters = useMemo(
    () => [
      { key: 'all', label: t.allCases },
      { key: 'unassigned', label: t.unassigned },
      { key: 'assignedToMe', label: t.assignedToMe },
      { key: 'highPriority', label: t.highPriority },
      { key: 'underReview', label: t.underReview },
      { key: 'underInvestigation', label: t.underInvestigation },
      { key: 'fraudConfirmed', label: t.fraudConfirmed },
      { key: 'closed', label: t.closed },
    ],
    [t]
  );

  const translatePriority = (value: string) => {
    if (language === 'ar') {
      if (value === 'High') return t.high;
      if (value === 'Medium') return t.medium;
      if (value === 'Low') return t.low;
    }

    return value;
  };

  const translateStatus = (value: string) => {
    if (language === 'ar') {
      if (value === 'New') return t.newLabel;
      if (value === 'Under Review') return t.underReview;
      if (value === 'Under Investigation') return t.underInvestigation;
      if (value === 'Pending Information') return t.pendingInformation;
      if (value === 'Fraud Confirmed') return t.fraudConfirmed;
      if (value === 'Rejected') return t.rejected;
      if (value === 'Closed') return t.closed;
    }

    return value;
  };

  const translateInsuranceType = (value: string) => {
    if (language === 'ar') {
      if (value === 'Motor') return t.motor;
      if (value === 'Medical') return t.medical;
      if (value === 'Property') return t.property;
      if (value === 'Travel') return t.travel;
    }

    return value;
  };

  const translateCaseType = (value: string) => {
    if (language === 'ar') {
      if (value === 'Fraud Suspected') return t.fraudSuspected;
      if (value === 'Fraud Confirmed') return t.fraudConfirmedType;
      if (value === 'Violation') return t.violation;
      if (value === 'Document Mismatch') return t.documentMismatch;
      if (value === 'Identity Concern') return t.identityConcern;
    }

    return value;
  };

  const translateCaseSource = (value: string) => {
    if (language === 'ar') {
      if (value === 'Whistleblowing') return t.whistleblowing;
      if (value === 'Internal') return t.internal;
      if (value === 'Website') return t.website;
      if (value === 'Call Center') return t.callCenter;
      if (value === 'Provider Audit') return t.providerAudit;
      if (value === 'Customer Care') return t.customerCare;
    }

    return value;
  };

  const filteredCases = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return cases.filter((item) => {
      const caseNumber = item.case_number ?? '';
      const claimId = item.claim_id ?? '';
      const caseType = item.case_type ?? '';
      const caseSource = item.case_source ?? '';
      const priorityLevel = item.priority_level ?? '';
      const caseStatus = item.case_status ?? '';
      const assignedUser = item.assigned_user ?? '';
      const insuranceType = item.insurance_type ?? '';
      const caseEntryDate = formatDate(item.case_entry_date);
      const reporterName = item.reporter_name ?? '';
      const reporterEmail = item.reporter_email ?? '';
      const reporterMobile = item.reporter_mobile ?? '';

      const assignedValue = assignedUser || t.unassignedValue;

      if (quickFilter === 'unassigned' && assignedUser) return false;
      if (quickFilter === 'assignedToMe' && assignedUser !== CURRENT_USER) return false;
      if (quickFilter === 'highPriority' && priorityLevel !== 'High') return false;
      if (quickFilter === 'underReview' && caseStatus !== 'Under Review') return false;
      if (quickFilter === 'underInvestigation' && caseStatus !== 'Under Investigation') return false;
      if (quickFilter === 'fraudConfirmed' && caseStatus !== 'Fraud Confirmed') return false;
      if (quickFilter === 'closed' && caseStatus !== 'Closed') return false;

      if (insuranceTypeFilter && insuranceType !== insuranceTypeFilter) return false;
      if (caseTypeFilter && caseType !== caseTypeFilter) return false;
      if (dateRangeFilter && caseEntryDate !== dateRangeFilter) return false;

      if (!normalizedSearch) return true;

      const searchMap: Record<SearchField, string> = {
        caseId: caseNumber,
        claimId,
        reporterName,
        reporterEmail,
        reporterMobile,
      };

      return (
        searchMap[searchField].toLowerCase().includes(normalizedSearch) ||
        assignedValue.toLowerCase().includes(normalizedSearch) ||
        caseSource.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [
    cases,
    caseTypeFilter,
    dateRangeFilter,
    insuranceTypeFilter,
    quickFilter,
    searchField,
    searchValue,
    t.unassignedValue,
  ]);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        action={
          <Link className="btn primary" to="/app/cases/new">
            {t.createCase}
          </Link>
        }
      />

      {isLoadingCases ? (
        <div className="card" style={{ marginBottom: 16 }}>
          Loading fraud cases from backend...
        </div>
      ) : null}

      {casesError ? (
        <div className="card" style={{ marginBottom: 16, color: '#b42318' }}>
          {casesError}
        </div>
      ) : null}

      <div className="card queue-filters" style={{ marginBottom: 20 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <span className="eyebrow">{t.searchTitle}</span>
        </div>

        <select value={searchField} onChange={(event) => setSearchField(event.target.value as SearchField)}>
          {searchFieldOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          placeholder={t.searchValue}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />

        <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
          <span className="eyebrow">{t.filtersTitle}</span>
        </div>

        <div className="actions-inline" style={{ gridColumn: '1 / -1', gap: 10, flexWrap: 'wrap' }}>
          {quickFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className="btn"
              onClick={() => setQuickFilter(filter.key)}
              style={{
                borderColor: quickFilter === filter.key ? 'rgba(13, 108, 104, 0.35)' : undefined,
                background: quickFilter === filter.key ? 'rgba(221, 244, 240, 0.9)' : undefined,
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <select value={insuranceTypeFilter} onChange={(event) => setInsuranceTypeFilter(event.target.value)}>
          <option value="">{t.byInsuranceType}</option>
          {insuranceOptions.map((option) => (
            <option key={option} value={option}>
              {translateInsuranceType(option)}
            </option>
          ))}
        </select>

        <select value={caseTypeFilter} onChange={(event) => setCaseTypeFilter(event.target.value)}>
          <option value="">{t.byCaseType}</option>
          {caseTypeOptions.map((option) => (
            <option key={option} value={option}>
              {translateCaseType(option)}
            </option>
          ))}
        </select>

        <select value={dateRangeFilter} onChange={(event) => setDateRangeFilter(event.target.value)}>
          <option value="">{t.byDateRange}</option>
          {dateOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Table
        title={t.columnsTitle}
        subtitle={t.columnsSubtitle}
        headers={[
          t.caseId,
          t.claimId,
          t.caseType,
          t.caseSource,
          t.priorityLevel,
          t.caseStatus,
          t.assignedUser,
          t.caseEntryDate,
          t.insuranceType,
          t.suspectedAmount,
          t.rowActions,
        ]}
      >
        {filteredCases.length > 0 ? (
          filteredCases.map((item) => {
            const priorityLevel = item.priority_level ?? '-';

            return (
              <tr key={item.id}>
                <td>
                  <Link className="text-link" to={`/app/cases/${item.case_number}`}>
                    {item.case_number}
                  </Link>
                </td>
                <td>{item.claim_id ?? '-'}</td>
                <td>{translateCaseType(item.case_type ?? '-')}</td>
                <td>{translateCaseSource(item.case_source ?? '-')}</td>
                <td>
                  <span className={`badge ${priorityLevel.toLowerCase()}`}>
                    {translatePriority(priorityLevel)}
                  </span>
                </td>
                <td>{translateStatus(item.case_status ?? '-')}</td>
                <td>{item.assigned_user || t.unassignedValue}</td>
                <td>{formatDate(item.case_entry_date)}</td>
                <td>{translateInsuranceType(item.insurance_type ?? '-')}</td>
                <td>{formatAmount(item.suspected_amount)}</td>
                <td>
                  <div className="actions-inline" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <Link className="mini-btn primary" to={`/app/cases/${item.case_number}`}>
                      {t.openCase}
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={11} className="muted" style={{ textAlign: 'center', padding: '24px 16px' }}>
              {isLoadingCases ? 'Loading...' : t.noResults}
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
}