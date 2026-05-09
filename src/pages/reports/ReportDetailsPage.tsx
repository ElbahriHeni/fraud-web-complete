import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { apiGet } from '../../api';
import type { AppLanguage } from '../../layout/AppLayout';

type ReportKey =
  | 'fraudCases'
  | 'confirmedFraud'
  | 'fraudIndicators'
  | 'suspendedClaims'
  | 'fraudPerformance';

type FraudCaseReportRow = {
  case_id: string | null;
  claim_id: string | null;
  case_entry_date: string | null;
  case_source: string | null;
  case_type: string | null;
  priority_level: string | null;
  case_status: string | null;
  fraud_unit_notes: string | null;
  closure_date: string | null;
  closure_reason: string | null;
  suspected_amount: string | number | null;
  insurance_type: string | null;
};

type FiltersState = {
  caseId: string;
  claimId: string;
  caseSource: string;
  caseType: string;
  priorityLevel: string;
  caseStatus: string;
  insuranceType: string;
  startDate: string;
  endDate: string;
};

type ReportPageCopy = {
  eyebrow: string;
  previewSubtitle: string;
  exportExcel: string;
  resetFilters: string;
  loading: string;
  error: string;
  noRows: string;
  filterCaseId: string;
  filterClaimId: string;
  allCaseSources: string;
  allCaseTypes: string;
  allPriorities: string;
  allStatuses: string;
  allInsuranceTypes: string;
  startDate: string;
  endDate: string;
  caseId: string;
  claimId: string;
  caseEntryDate: string;
  caseSource: string;
  caseType: string;
  priorityLevel: string;
  caseStatus: string;
  fraudUnitNotes: string;
  closureDate: string;
  closureReason: string;
  suspectedAmount: string;
  insuranceType: string;
  website: string;
  other: string;
  fraudConfirmedType: string;
  fraudSuspected: string;
  violation: string;
  high: string;
  medium: string;
  low: string;
  open: string;
  closed: string;
  motor: string;
  medical: string;
  life: string;
  general: string;
  reportTitles: Record<ReportKey, string>;
};

const pageCopy: Record<AppLanguage, ReportPageCopy> = {
  en: {
    eyebrow: 'Report',
    previewSubtitle: 'All submitted fraud cases excluding draft cases.',
    exportExcel: 'Export Excel',
    resetFilters: 'Reset Filters',
    loading: 'Loading report data...',
    error: 'Could not load fraud cases report from backend.',
    noRows: 'No matching cases found.',
    filterCaseId: 'Filter Case Id',
    filterClaimId: 'Filter Claim Id',
    allCaseSources: 'All Case Sources',
    allCaseTypes: 'All Case Types',
    allPriorities: 'All Priorities',
    allStatuses: 'All Statuses',
    allInsuranceTypes: 'All Insurance Types',
    startDate: 'Start Date',
    endDate: 'End Date',
    caseId: 'Case Id',
    claimId: 'Claim Id',
    caseEntryDate: 'Case Entry Date',
    caseSource: 'Case Source',
    caseType: 'Case Type',
    priorityLevel: 'Priority Level',
    caseStatus: 'Case Status',
    fraudUnitNotes: 'Fraud Unit Notes',
    closureDate: 'Closure Date',
    closureReason: 'Closure Reason',
    suspectedAmount: 'Suspected Amount',
    insuranceType: 'Insurance Type',
    website: 'Website',
    other: 'Other',
    fraudConfirmedType: 'Fraud Confirmed',
    fraudSuspected: 'Fraud Suspected',
    violation: 'Violation',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    open: 'Open',
    closed: 'Closed',
    motor: 'Motor',
    medical: 'Medical',
    life: 'Life',
    general: 'General',
    reportTitles: {
      fraudCases: 'Fraud Cases Report',
      confirmedFraud: 'Confirmed Fraud Report',
      fraudIndicators: 'Fraud Indicators Report',
      suspendedClaims: 'Suspended Claims Report',
      fraudPerformance: 'Fraud Performance Report',
    },
  },
  ar: {
    eyebrow: 'تقرير',
    previewSubtitle: 'جميع بلاغات الاحتيال المعتمدة باستثناء البلاغات المسودة.',
    exportExcel: 'تصدير Excel',
    resetFilters: 'إعادة ضبط الفلاتر',
    loading: 'جاري تحميل بيانات التقرير...',
    error: 'تعذر تحميل تقرير البلاغات من الخادم.',
    noRows: 'لا توجد بلاغات مطابقة.',
    filterCaseId: 'تصفية رقم البلاغ',
    filterClaimId: 'تصفية رقم المطالبة',
    allCaseSources: 'جميع طرق استقبال البلاغ',
    allCaseTypes: 'جميع أنواع البلاغات',
    allPriorities: 'جميع الأولويات',
    allStatuses: 'جميع الحالات',
    allInsuranceTypes: 'جميع أنواع التأمين',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    caseId: 'رقم البلاغ',
    claimId: 'رقم المطالبة',
    caseEntryDate: 'تاريخ إدخال البلاغ',
    caseSource: 'طريقة استقبال البلاغ',
    caseType: 'نوع البلاغ',
    priorityLevel: 'مستوى الأولوية',
    caseStatus: 'حالة البلاغ',
    fraudUnitNotes: 'ملاحظات وحدة مكافحة الاحتيال',
    closureDate: 'تاريخ الإغلاق',
    closureReason: 'سبب الإغلاق',
    suspectedAmount: 'المبلغ محل الاشتباه',
    insuranceType: 'نوع التأمين',
    website: 'الموقع',
    other: 'أخرى',
    fraudConfirmedType: 'احتيال مؤكد',
    fraudSuspected: 'اشتباه الاحتيال',
    violation: 'مخالفة',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    open: 'مفتوح',
    closed: 'مغلق',
    motor: 'مركبات',
    medical: 'طبي',
    life: 'حياة',
    general: 'عام',
    reportTitles: {
      fraudCases: 'تقرير البلاغات',
      confirmedFraud: 'تقرير البلاغات المثبتة احتيال',
      fraudIndicators: 'تقرير مؤشرات الاحتيال',
      suspendedClaims: 'تقرير المطالبات المعلقة بسبب الاشتباه بالاحتيال',
      fraudPerformance: 'تقرير أداء وحدة مكافحة الاحتيال',
    },
  },
};

const routeToReportKey: Record<string, ReportKey> = {
  'Fraud Cases Report': 'fraudCases',
  'Confirmed Fraud Report': 'confirmedFraud',
  'Fraud Indicators Report': 'fraudIndicators',
  'Suspended Claims Report': 'suspendedClaims',
  'Fraud Performance Report': 'fraudPerformance',
};

const initialFilters: FiltersState = {
  caseId: '',
  claimId: '',
  caseSource: '',
  caseType: '',
  priorityLevel: '',
  caseStatus: '',
  insuranceType: '',
  startDate: '',
  endDate: '',
};

function normalize(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB');
}

function formatMoney(value: string | number | null) {
  const numeric = Number(value ?? 0);
  if (Number.isNaN(numeric)) return String(value ?? '-');
  return `SAR ${numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function toDateKey(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function csvEscape(value: unknown) {
  const text = String(value ?? '').replace(/"/g, '""');
  return `"${text}"`;
}

function downloadCsv(fileName: string, headers: string[], rows: Array<Array<string | number | null>>) {
  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');

  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ReportDetailsPage() {
  const { reportName } = useParams();
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';

  const rawTitle = decodeURIComponent(reportName ?? 'Fraud Cases Report');
  const reportKey = routeToReportKey[rawTitle] ?? 'fraudCases';

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [reportRows, setReportRows] = useState<FraudCaseReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadReport() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await apiGet<FraudCaseReportRow[]>('/api/reports/fraud-cases');
        if (isMounted) setReportRows(data);
      } catch (error) {
        console.error(error);
        if (isMounted) setErrorMessage(t.error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [t.error]);

  const translateCaseSource = (value: string | null) => {
    if (language !== 'ar') return value || '-';
    if (value === 'Website') return t.website;
    if (value === 'Other') return t.other;
    return value || '-';
  };

  const translateCaseType = (value: string | null) => {
    if (language !== 'ar') return value || '-';
    if (value === 'Fraud Confirmed') return t.fraudConfirmedType;
    if (value === 'Fraud Suspected') return t.fraudSuspected;
    if (value === 'Violation') return t.violation;
    return value || '-';
  };

  const translatePriority = (value: string | null) => {
    if (language !== 'ar') return value || '-';
    if (value === 'High') return t.high;
    if (value === 'Medium') return t.medium;
    if (value === 'Low') return t.low;
    return value || '-';
  };

  const translateStatus = (value: string | null) => {
    if (language !== 'ar') return value || '-';
    if (value === 'Open') return t.open;
    if (value === 'Closed') return t.closed;
    return value || '-';
  };

  const translateInsuranceType = (value: string | null) => {
    if (language !== 'ar') return value || '-';
    if (value === 'Motor') return t.motor;
    if (value === 'Medical') return t.medical;
    if (value === 'Life') return t.life;
    if (value === 'General') return t.general;
    return value || '-';
  };

  const filteredRows = useMemo(() => {
    return reportRows.filter((item) => {
      const entryDate = toDateKey(item.case_entry_date);
      const matchesStart = !filters.startDate || (entryDate && entryDate >= filters.startDate);
      const matchesEnd = !filters.endDate || (entryDate && entryDate <= filters.endDate);

      return (
        matchesStart &&
        matchesEnd &&
        normalize(item.case_id).includes(normalize(filters.caseId)) &&
        normalize(item.claim_id).includes(normalize(filters.claimId)) &&
        (!filters.caseSource || item.case_source === filters.caseSource) &&
        (!filters.caseType || item.case_type === filters.caseType) &&
        (!filters.priorityLevel || item.priority_level === filters.priorityLevel) &&
        (!filters.caseStatus || item.case_status === filters.caseStatus) &&
        (!filters.insuranceType || item.insurance_type === filters.insuranceType)
      );
    });
  }, [filters, reportRows]);

  const headers = useMemo(
    () => [
      t.caseId,
      t.claimId,
      t.caseEntryDate,
      t.caseSource,
      t.caseType,
      t.priorityLevel,
      t.caseStatus,
      t.fraudUnitNotes,
      t.closureDate,
      t.closureReason,
      t.suspectedAmount,
      t.insuranceType,
    ],
    [t]
  );

  const exportFilteredExcel = () => {
    const excelRows = filteredRows.map((item) => [
      item.case_id ?? '',
      item.claim_id ?? '',
      formatDate(item.case_entry_date),
      translateCaseSource(item.case_source),
      translateCaseType(item.case_type),
      translatePriority(item.priority_level),
      translateStatus(item.case_status),
      item.fraud_unit_notes ?? '',
      formatDate(item.closure_date),
      item.closure_reason ?? '',
      item.suspected_amount ?? '',
      translateInsuranceType(item.insurance_type),
    ]);

    downloadCsv('fraud-cases-report.csv', headers, excelRows);
  };

  const rows = useMemo(() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={headers.length}>{t.loading}</td>
        </tr>
      );
    }

    if (errorMessage) {
      return (
        <tr>
          <td colSpan={headers.length}>{errorMessage}</td>
        </tr>
      );
    }

    if (filteredRows.length === 0) {
      return (
        <tr>
          <td colSpan={headers.length}>{t.noRows}</td>
        </tr>
      );
    }

    return filteredRows.map((item) => (
      <tr key={item.case_id ?? `${item.claim_id}-${item.case_entry_date}`}>
        <td>{item.case_id ?? '-'}</td>
        <td>{item.claim_id ?? '-'}</td>
        <td>{formatDate(item.case_entry_date)}</td>
        <td>{translateCaseSource(item.case_source)}</td>
        <td>{translateCaseType(item.case_type)}</td>
        <td>{translatePriority(item.priority_level)}</td>
        <td>{translateStatus(item.case_status)}</td>
        <td>{item.fraud_unit_notes || '-'}</td>
        <td>{formatDate(item.closure_date)}</td>
        <td>{item.closure_reason || '-'}</td>
        <td>{formatMoney(item.suspected_amount)}</td>
        <td>{translateInsuranceType(item.insurance_type)}</td>
      </tr>
    ));
  }, [errorMessage, filteredRows, headers.length, isLoading, language, t]);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.reportTitles[reportKey]}
        subtitle={t.previewSubtitle}
        action={
          <div className="actions-inline">
            <button className="btn primary" onClick={exportFilteredExcel} type="button">
              {t.exportExcel}
            </button>
          </div>
        }
      />

      <div className="card report-detail-filters">
        <input
          placeholder={t.filterCaseId}
          value={filters.caseId}
          onChange={(event) => setFilters((current) => ({ ...current, caseId: event.target.value }))}
        />
        <input
          placeholder={t.filterClaimId}
          value={filters.claimId}
          onChange={(event) => setFilters((current) => ({ ...current, claimId: event.target.value }))}
        />
        <select
          value={filters.caseSource}
          onChange={(event) => setFilters((current) => ({ ...current, caseSource: event.target.value }))}
        >
          <option value="">{t.allCaseSources}</option>
          <option value="Website">{t.website}</option>
          <option value="Other">{t.other}</option>
        </select>
        <select
          value={filters.caseType}
          onChange={(event) => setFilters((current) => ({ ...current, caseType: event.target.value }))}
        >
          <option value="">{t.allCaseTypes}</option>
          <option value="Fraud Confirmed">{t.fraudConfirmedType}</option>
          <option value="Fraud Suspected">{t.fraudSuspected}</option>
          <option value="Violation">{t.violation}</option>
        </select>
        <select
          value={filters.priorityLevel}
          onChange={(event) => setFilters((current) => ({ ...current, priorityLevel: event.target.value }))}
        >
          <option value="">{t.allPriorities}</option>
          <option value="High">{t.high}</option>
          <option value="Medium">{t.medium}</option>
          <option value="Low">{t.low}</option>
        </select>
        <select
          value={filters.caseStatus}
          onChange={(event) => setFilters((current) => ({ ...current, caseStatus: event.target.value }))}
        >
          <option value="">{t.allStatuses}</option>
          <option value="Open">{t.open}</option>
          <option value="Closed">{t.closed}</option>
        </select>
        <select
          value={filters.insuranceType}
          onChange={(event) => setFilters((current) => ({ ...current, insuranceType: event.target.value }))}
        >
          <option value="">{t.allInsuranceTypes}</option>
          <option value="Motor">{t.motor}</option>
          <option value="Medical">{t.medical}</option>
          <option value="Life">{t.life}</option>
          <option value="General">{t.general}</option>
        </select>
        <input
          aria-label={t.startDate}
          type="date"
          value={filters.startDate}
          onChange={(event) => setFilters((current) => ({ ...current, startDate: event.target.value }))}
        />
        <input
          aria-label={t.endDate}
          type="date"
          value={filters.endDate}
          onChange={(event) => setFilters((current) => ({ ...current, endDate: event.target.value }))}
        />
        <button className="btn" type="button" onClick={() => setFilters(initialFilters)}>
          {t.resetFilters}
        </button>
      </div>

      <Table headers={headers}>{rows}</Table>
    </div>
  );
}
