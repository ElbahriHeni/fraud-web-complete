import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases } from '../../data/mockData';
import type { AppLanguage } from '../../layout/AppLayout';

const CURRENT_USER = 'Fatimah Salem';

type QueueTab = 'all' | 'unassigned' | 'assignedToMe' | 'inProgress' | 'closed';

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

  const [activeTab, setActiveTab] = useState<QueueTab>('all');
  const [searchField, setSearchField] = useState<SearchField>('caseId');
  const [searchValue, setSearchValue] = useState('');
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useState('');
  const [caseTypeFilter, setCaseTypeFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('');

  const insuranceOptions = useMemo(
    () => Array.from(new Set(fraudCases.map((item) => item.insuranceType))),
    []
  );

  const caseTypeOptions = useMemo(
    () => Array.from(new Set(fraudCases.map((item) => item.caseType))),
    []
  );

  const dateOptions = useMemo(
    () => Array.from(new Set(fraudCases.map((item) => item.caseEntryDate))),
    []
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

  const tabs = useMemo(
    () => [
      { key: 'all' as QueueTab, label: t.all },
      { key: 'unassigned' as QueueTab, label: t.unassigned },
      { key: 'assignedToMe' as QueueTab, label: t.assignedToMe },
      { key: 'inProgress' as QueueTab, label: t.inProgress },
      { key: 'closed' as QueueTab, label: t.closed },
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

    return fraudCases.filter((item) => {
      const assignedValue = item.assignedUser ?? t.unassignedValue;

      if (activeTab === 'unassigned' && item.assignedUser) return false;
      if (activeTab === 'assignedToMe' && item.assignedUser !== CURRENT_USER) return false;
      if (
        activeTab === 'inProgress' &&
        !['Under Review', 'Under Investigation', 'Pending Information'].includes(item.caseStatus)
      ) {
        return false;
      }
      if (activeTab === 'closed' && item.caseStatus !== 'Closed') return false;

      if (quickFilter === 'unassigned' && item.assignedUser) return false;
      if (quickFilter === 'assignedToMe' && item.assignedUser !== CURRENT_USER) return false;
      if (quickFilter === 'highPriority' && item.priorityLevel !== 'High') return false;
      if (quickFilter === 'underReview' && item.caseStatus !== 'Under Review') return false;
      if (quickFilter === 'underInvestigation' && item.caseStatus !== 'Under Investigation') return false;
      if (quickFilter === 'fraudConfirmed' && item.caseStatus !== 'Fraud Confirmed') return false;
      if (quickFilter === 'closed' && item.caseStatus !== 'Closed') return false;

      if (insuranceTypeFilter && item.insuranceType !== insuranceTypeFilter) return false;
      if (caseTypeFilter && item.caseType !== caseTypeFilter) return false;
      if (dateRangeFilter && item.caseEntryDate !== dateRangeFilter) return false;

      if (!normalizedSearch) return true;

      const searchMap: Record<SearchField, string> = {
        caseId: item.id,
        claimId: item.claimId,
        reporterName: item.reporterName,
        reporterEmail: item.reporterEmail,
        reporterMobile: item.reporterMobile,
      };

      return (
        searchMap[searchField].toLowerCase().includes(normalizedSearch) ||
        assignedValue.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [
    activeTab,
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

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="actions-inline" style={{ gap: 10, flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className="btn"
              onClick={() => setActiveTab(tab.key)}
              style={{
                borderColor: activeTab === tab.key ? 'rgba(13, 108, 104, 0.35)' : undefined,
                background: activeTab === tab.key ? 'rgba(221, 244, 240, 0.9)' : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

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
          filteredCases.map((item) => (
            <tr key={item.id}>
              <td>
                <Link className="text-link" to={`/app/cases/${item.id}`}>
                  {item.id}
                </Link>
              </td>
              <td>{item.claimId}</td>
              <td>{translateCaseType(item.caseType)}</td>
              <td>{translateCaseSource(item.caseSource)}</td>
              <td>
                <span className={`badge ${item.priorityLevel.toLowerCase()}`}>
                  {translatePriority(item.priorityLevel)}
                </span>
              </td>
              <td>{translateStatus(item.caseStatus)}</td>
              <td>{item.assignedUser ?? t.unassignedValue}</td>
              <td>{item.caseEntryDate}</td>
              <td>{translateInsuranceType(item.insuranceType)}</td>
              <td>{item.suspectedAmount}</td>
              <td>
                <div className="actions-inline" style={{ gap: 8, flexWrap: 'wrap' }}>
                  <Link className="mini-btn primary" to={`/app/cases/${item.id}`}>
                    {t.openCase}
                  </Link>
                  {!item.assignedUser ? (
                    <button className="mini-btn" type="button">
                      {t.assignToMe}
                    </button>
                  ) : (
                    <>
                      <button className="mini-btn" type="button">
                        {t.reassign}
                      </button>
                      <button className="mini-btn" type="button">
                        {t.releaseAssignment}
                      </button>
                    </>
                  )}
                  <button className="mini-btn" type="button">
                    {t.updateStatus}
                  </button>
                  <button className="mini-btn" type="button">
                    {t.addNote}
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={11} className="muted" style={{ textAlign: 'center', padding: '24px 16px' }}>
              {t.noResults}
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
}
