import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { apiGet } from '../../api';
import type { AppLanguage } from '../../layout/AppLayout';

type BackendFraudCase = {
  id: number;
  case_number: string;
  claim_id: string | null;
  case_type: string | null;
  case_source: string | null;
  case_source_other: string | null;
  priority_level: string | null;
  case_status: string | null;
  assigned_user: string | null;
  case_entry_date: string | null;
  insurance_type: string | null;
  suspected_amount: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_mobile: string | null;
  has_claim: boolean | null;
  claim_status: string | null;
  risk_level: string | null;
  fraud_officer_decision: string | null;
};

type SearchField = 'caseId' | 'claimId' | 'reporterName' | 'reporterEmail' | 'reporterMobile';
type QuickFilter = 'all' | 'draft' | 'received' | 'open' | 'closed' | 'hasClaim' | 'fraudRelated' | 'highRisk';
type DateRangeFilter = '' | 'today' | 'last7' | 'last30' | 'older30';

type Option = {
  value: string;
  label: string;
};

type QueueCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  createCase: string;
  openCase: string;
  searchTitle: string;
  filtersTitle: string;
  searchValue: string;
  allCases: string;
  draft: string;
  received: string;
  open: string;
  closed: string;
  hasClaim: string;
  fraudRelated: string;
  highRisk: string;
  byInsuranceType: string;
  byCaseType: string;
  byCaseSource: string;
  byPriorityLevel: string;
  byClaimStatus: string;
  byRiskLevel: string;
  byDateRange: string;
  today: string;
  last7Days: string;
  last30Days: string;
  olderThan30Days: string;
  resetFilters: string;
  columnsTitle: string;
  columnsSubtitle: string;
  caseId: string;
  claimId: string;
  caseType: string;
  caseSource: string;
  priorityLevel: string;
  caseStatus: string;
  insuranceType: string;
  claimStatus: string;
  riskLevel: string;
  caseEntryDate: string;
  rowActions: string;
  reporterName: string;
  emailAddress: string;
  mobileNumber: string;
  noResults: string;
  loading: string;
  loadError: string;
  yes: string;
  no: string;
};

const pageCopy: Record<AppLanguage, QueueCopy> = {
  en: {
    eyebrow: 'Workspace',
    title: 'Fraud Queue',
    subtitle: 'Review fraud cases using the updated seven-step workflow filters.',
    createCase: 'Create Case',
    openCase: 'Open Case',
    searchTitle: 'Search',
    filtersTitle: 'Filters',
    searchValue: 'Enter search value',
    allCases: 'All Cases',
    draft: 'Draft',
    received: 'Received',
    open: 'Open',
    closed: 'Closed',
    hasClaim: 'Has Claim',
    fraudRelated: 'Fraud Related',
    highRisk: 'High Risk',
    byInsuranceType: 'By Insurance Type',
    byCaseType: 'By Case Type',
    byCaseSource: 'By Case Source',
    byPriorityLevel: 'By Priority Level',
    byClaimStatus: 'By Claim Status',
    byRiskLevel: 'By Risk Level',
    byDateRange: 'By Date Range',
    today: 'Today',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    olderThan30Days: 'Older Than 30 Days',
    resetFilters: 'Reset Filters',
    columnsTitle: 'Queue Cases',
    columnsSubtitle: 'Cases available for review, decisioning, and follow-up.',
    caseId: 'Case ID',
    claimId: 'Claim ID',
    caseType: 'Case Type',
    caseSource: 'Case Source',
    priorityLevel: 'Priority',
    caseStatus: 'Status',
    insuranceType: 'Insurance',
    claimStatus: 'Claim Status',
    riskLevel: 'Risk',
    caseEntryDate: 'Entry Date',
    rowActions: 'Actions',
    reporterName: 'Reporter Name',
    emailAddress: 'Email Address',
    mobileNumber: 'Mobile Number',
    noResults: 'No matching cases found.',
    loading: 'Loading fraud cases from backend...',
    loadError: 'Could not load fraud cases from backend.',
    yes: 'Yes',
    no: 'No',
  },
  ar: {
    eyebrow: 'مساحة العمل',
    title: 'قائمة بلاغات الاحتيال',
    subtitle: 'مراجعة البلاغات حسب فلاتر سير العمل الجديد المكوّن من سبع خطوات.',
    createCase: 'إنشاء بلاغ',
    openCase: 'فتح البلاغ',
    searchTitle: 'البحث',
    filtersTitle: 'الفلاتر',
    searchValue: 'أدخل قيمة البحث',
    allCases: 'جميع البلاغات',
    draft: 'مسودة',
    received: 'مستلم',
    open: 'مفتوح',
    closed: 'مغلق',
    hasClaim: 'يوجد مطالبة',
    fraudRelated: 'بلاغات احتيال',
    highRisk: 'خطورة عالية',
    byInsuranceType: 'حسب نوع التأمين',
    byCaseType: 'حسب نوع البلاغ',
    byCaseSource: 'حسب طريقة الاستقبال',
    byPriorityLevel: 'حسب الأولوية',
    byClaimStatus: 'حسب حالة المطالبة',
    byRiskLevel: 'حسب درجة الخطورة',
    byDateRange: 'حسب تاريخ الإدخال',
    today: 'اليوم',
    last7Days: 'آخر 7 أيام',
    last30Days: 'آخر 30 يوم',
    olderThan30Days: 'أقدم من 30 يوم',
    resetFilters: 'إعادة ضبط الفلاتر',
    columnsTitle: 'قائمة البلاغات',
    columnsSubtitle: 'البلاغات المتاحة للمراجعة واتخاذ القرار والمتابعة.',
    caseId: 'رقم البلاغ',
    claimId: 'رقم المطالبة',
    caseType: 'نوع البلاغ',
    caseSource: 'طريقة الاستقبال',
    priorityLevel: 'الأولوية',
    caseStatus: 'الحالة',
    insuranceType: 'نوع التأمين',
    claimStatus: 'حالة المطالبة',
    riskLevel: 'الخطورة',
    caseEntryDate: 'تاريخ الإدخال',
    rowActions: 'الإجراءات',
    reporterName: 'اسم المبلّغ',
    emailAddress: 'البريد الإلكتروني',
    mobileNumber: 'رقم الجوال',
    noResults: 'لا توجد بلاغات مطابقة.',
    loading: 'جاري تحميل بلاغات الاحتيال من النظام...',
    loadError: 'تعذر تحميل بلاغات الاحتيال من الخادم.',
    yes: 'نعم',
    no: 'لا',
  },
};

const searchFieldOptions = (t: QueueCopy): Array<{ value: SearchField; label: string }> => [
  { value: 'caseId', label: t.caseId },
  { value: 'claimId', label: t.claimId },
  { value: 'reporterName', label: t.reporterName },
  { value: 'reporterEmail', label: t.emailAddress },
  { value: 'reporterMobile', label: t.mobileNumber },
];

const baseOptions = {
  insurance: [
    { value: 'Motor', en: 'Motor', ar: 'مركبات' },
    { value: 'Medical', en: 'Medical', ar: 'طبي' },
    { value: 'Life', en: 'Life', ar: 'حياة' },
    { value: 'General', en: 'General', ar: 'عام' },
  ],
  caseType: [
    { value: 'Fraud Confirmed', en: 'Fraud Confirmed', ar: 'احتيال مؤكد' },
    { value: 'Fraud Suspected', en: 'Fraud Suspected', ar: 'اشتباه الاحتيال' },
    { value: 'Violation', en: 'Violation', ar: 'مخالفة' },
  ],
  caseSource: [
    { value: 'Website', en: 'Website', ar: 'الموقع' },
    { value: 'Other', en: 'Other', ar: 'أخرى' },
  ],
  priority: [
    { value: 'High', en: 'High', ar: 'عالية' },
    { value: 'Medium', en: 'Medium', ar: 'متوسطة' },
    { value: 'Low', en: 'Low', ar: 'منخفضة' },
  ],
  status: [
    { value: 'Draft', en: 'Draft', ar: 'مسودة' },
    { value: 'Received', en: 'Received', ar: 'مستلم' },
    { value: 'Open', en: 'Open', ar: 'مفتوح' },
    { value: 'Closed', en: 'Closed', ar: 'مغلق' },
    { value: 'Reassigned', en: 'Reassigned', ar: 'إعادة التعيين' },
    { value: 'New', en: 'New', ar: 'مستلم' },
    { value: 'Under Review', en: 'Under Review', ar: 'مفتوح' },
    { value: 'Fraud Confirmed', en: 'Fraud Confirmed', ar: 'احتيال مؤكد' },
  ],
  claimStatus: [
    { value: 'Open', en: 'Open', ar: 'مفتوح' },
    { value: 'Suspended', en: 'Suspended', ar: 'معلق' },
  ],
  risk: [
    { value: 'High', en: 'High', ar: 'عالية' },
    { value: 'Medium', en: 'Medium', ar: 'متوسطة' },
    { value: 'Low', en: 'Low', ar: 'منخفضة' },
  ],
};

function toOptions(items: Array<{ value: string; en: string; ar: string }>, language: AppLanguage): Option[] {
  return items.map((item) => ({
    value: item.value,
    label: language === 'ar' ? item.ar : item.en,
  }));
}

function getOptionLabel(items: Array<{ value: string; en: string; ar: string }>, value: string | null | undefined, language: AppLanguage) {
  if (!value) return '-';
  const item = items.find((option) => option.value === value);
  return item ? (language === 'ar' ? item.ar : item.en) : value;
}

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB');
}

function isWithinDateRange(value: string | null, filter: DateRangeFilter) {
  if (!filter) return true;
  if (!value) return false;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  if (filter === 'today') return diffDays === 0;
  if (filter === 'last7') return diffDays >= 0 && diffDays <= 7;
  if (filter === 'last30') return diffDays >= 0 && diffDays <= 30;
  if (filter === 'older30') return diffDays > 30;
  return true;
}

function isFraudRelated(caseType: string) {
  return caseType === 'Fraud Confirmed' || caseType === 'Fraud Suspected';
}

function statusMatchesQuickFilter(status: string, filter: QuickFilter) {
  if (filter === 'draft') return status === 'Draft';
  if (filter === 'received') return status === 'Received' || status === 'New';
  if (filter === 'open') return status === 'Open' || status === 'Under Review' || status === 'Under Investigation';
  if (filter === 'closed') return status === 'Closed';
  return true;
}

export default function FraudQueuePage() {
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';

  const [cases, setCases] = useState<BackendFraudCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState('');

  const [searchField, setSearchField] = useState<SearchField>('caseId');
  const [searchValue, setSearchValue] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [insuranceTypeFilter, setInsuranceTypeFilter] = useState('');
  const [caseTypeFilter, setCaseTypeFilter] = useState('');
  const [caseSourceFilter, setCaseSourceFilter] = useState('');
  const [priorityLevelFilter, setPriorityLevelFilter] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('');

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
          setCasesError(t.loadError);
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
  }, [t.loadError]);

  const options = useMemo(
    () => ({
      insurance: toOptions(baseOptions.insurance, language),
      caseType: toOptions(baseOptions.caseType, language),
      caseSource: toOptions(baseOptions.caseSource, language),
      priority: toOptions(baseOptions.priority, language),
      status: toOptions(baseOptions.status, language),
      claimStatus: toOptions(baseOptions.claimStatus, language),
      risk: toOptions(baseOptions.risk, language),
      searchFields: searchFieldOptions(t),
    }),
    [language, t]
  );

  const quickFilters = useMemo(
    () => [
      { key: 'all' as QuickFilter, label: t.allCases, count: cases.length },
      { key: 'draft' as QuickFilter, label: t.draft, count: cases.filter((item) => item.case_status === 'Draft').length },
      {
        key: 'received' as QuickFilter,
        label: t.received,
        count: cases.filter((item) => item.case_status === 'Received' || item.case_status === 'New').length,
      },
      {
        key: 'open' as QuickFilter,
        label: t.open,
        count: cases.filter((item) => statusMatchesQuickFilter(item.case_status ?? '', 'open')).length,
      },
      { key: 'closed' as QuickFilter, label: t.closed, count: cases.filter((item) => item.case_status === 'Closed').length },
      { key: 'hasClaim' as QuickFilter, label: t.hasClaim, count: cases.filter((item) => Boolean(item.has_claim)).length },
      {
        key: 'fraudRelated' as QuickFilter,
        label: t.fraudRelated,
        count: cases.filter((item) => isFraudRelated(item.case_type ?? '')).length,
      },
      { key: 'highRisk' as QuickFilter, label: t.highRisk, count: cases.filter((item) => item.risk_level === 'High').length },
    ],
    [cases, t]
  );

  const resetFilters = () => {
    setSearchField('caseId');
    setSearchValue('');
    setQuickFilter('all');
    setInsuranceTypeFilter('');
    setCaseTypeFilter('');
    setCaseSourceFilter('');
    setPriorityLevelFilter('');
    setClaimStatusFilter('');
    setRiskLevelFilter('');
    setDateRangeFilter('');
  };

  const filteredCases = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return cases.filter((item) => {
      const caseNumber = item.case_number ?? '';
      const claimId = item.claim_id ?? '';
      const reporterName = item.reporter_name ?? '';
      const reporterEmail = item.reporter_email ?? '';
      const reporterMobile = item.reporter_mobile ?? '';
      const caseType = item.case_type ?? '';
      const caseSource = item.case_source ?? '';
      const priorityLevel = item.priority_level ?? '';
      const caseStatus = item.case_status ?? '';
      const insuranceType = item.insurance_type ?? '';
      const claimStatus = item.claim_status ?? '';
      const riskLevel = item.risk_level ?? '';

      if (quickFilter !== 'all') {
        if (quickFilter === 'hasClaim' && !item.has_claim) return false;
        if (quickFilter === 'fraudRelated' && !isFraudRelated(caseType)) return false;
        if (quickFilter === 'highRisk' && riskLevel !== 'High') return false;
        if (!['hasClaim', 'fraudRelated', 'highRisk'].includes(quickFilter) && !statusMatchesQuickFilter(caseStatus, quickFilter)) {
          return false;
        }
      }

      if (insuranceTypeFilter && insuranceType !== insuranceTypeFilter) return false;
      if (caseTypeFilter && caseType !== caseTypeFilter) return false;
      if (caseSourceFilter && caseSource !== caseSourceFilter) return false;
      if (priorityLevelFilter && priorityLevel !== priorityLevelFilter) return false;
      if (claimStatusFilter && claimStatus !== claimStatusFilter) return false;
      if (riskLevelFilter && riskLevel !== riskLevelFilter) return false;
      if (!isWithinDateRange(item.case_entry_date, dateRangeFilter)) return false;

      if (!normalizedSearch) return true;

      const searchMap: Record<SearchField, string> = {
        caseId: caseNumber,
        claimId,
        reporterName,
        reporterEmail,
        reporterMobile,
      };

      return searchMap[searchField].toLowerCase().includes(normalizedSearch);
    });
  }, [
    cases,
    caseSourceFilter,
    caseTypeFilter,
    claimStatusFilter,
    dateRangeFilter,
    insuranceTypeFilter,
    priorityLevelFilter,
    quickFilter,
    riskLevelFilter,
    searchField,
    searchValue,
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
          {t.loading}
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
          {options.searchFields.map((option) => (
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
              {filter.label} <span className="muted">({filter.count})</span>
            </button>
          ))}
        </div>

        <select value={insuranceTypeFilter} onChange={(event) => setInsuranceTypeFilter(event.target.value)}>
          <option value="">{t.byInsuranceType}</option>
          {options.insurance.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={caseTypeFilter} onChange={(event) => setCaseTypeFilter(event.target.value)}>
          <option value="">{t.byCaseType}</option>
          {options.caseType.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={caseSourceFilter} onChange={(event) => setCaseSourceFilter(event.target.value)}>
          <option value="">{t.byCaseSource}</option>
          {options.caseSource.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={priorityLevelFilter} onChange={(event) => setPriorityLevelFilter(event.target.value)}>
          <option value="">{t.byPriorityLevel}</option>
          {options.priority.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>


        <select value={claimStatusFilter} onChange={(event) => setClaimStatusFilter(event.target.value)}>
          <option value="">{t.byClaimStatus}</option>
          {options.claimStatus.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={riskLevelFilter} onChange={(event) => setRiskLevelFilter(event.target.value)}>
          <option value="">{t.byRiskLevel}</option>
          {options.risk.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select value={dateRangeFilter} onChange={(event) => setDateRangeFilter(event.target.value as DateRangeFilter)}>
          <option value="">{t.byDateRange}</option>
          <option value="today">{t.today}</option>
          <option value="last7">{t.last7Days}</option>
          <option value="last30">{t.last30Days}</option>
          <option value="older30">{t.olderThan30Days}</option>
        </select>

        <button type="button" className="btn" onClick={resetFilters}>
          {t.resetFilters}
        </button>
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
          t.insuranceType,
          t.claimStatus,
          t.riskLevel,
          t.caseEntryDate,
          t.rowActions,
        ]}
      >
        {filteredCases.length > 0 ? (
          filteredCases.map((item) => {
            const priorityLevel = item.priority_level ?? '-';
            const riskLevel = item.risk_level ?? '-';

            return (
              <tr key={item.id}>
                <td>
                  <Link className="text-link" to={`/app/cases/${item.case_number}`}>
                    {item.case_number}
                  </Link>
                </td>
                <td>{item.has_claim ? item.claim_id || '-' : '-'}</td>
                <td>{getOptionLabel(baseOptions.caseType, item.case_type, language)}</td>
                <td>
                  {item.case_source === 'Other'
                    ? `${getOptionLabel(baseOptions.caseSource, item.case_source, language)}${item.case_source_other ? ` - ${item.case_source_other}` : ''}`
                    : getOptionLabel(baseOptions.caseSource, item.case_source, language)}
                </td>
                <td>
                  <span className={`badge ${priorityLevel.toLowerCase()}`}>
                    {getOptionLabel(baseOptions.priority, item.priority_level, language)}
                  </span>
                </td>
                <td>{getOptionLabel(baseOptions.status, item.case_status, language)}</td>
                <td>{getOptionLabel(baseOptions.insurance, item.insurance_type, language)}</td>
                <td>{item.has_claim ? getOptionLabel(baseOptions.claimStatus, item.claim_status, language) : '-'}</td>
                <td>
                  <span className={`badge ${riskLevel.toLowerCase()}`}>
                    {getOptionLabel(baseOptions.risk, item.risk_level, language)}
                  </span>
                </td>
                <td>{formatDate(item.case_entry_date)}</td>
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
              {isLoadingCases ? t.loading : t.noResults}
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
}
