import { useMemo, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases } from '../../data/mockData';
import type { AppLanguage } from '../../layout/AppLayout';

type ReportKey =
  | 'fraudCases'
  | 'confirmedFraud'
  | 'fraudIndicators'
  | 'suspendedClaims'
  | 'fraudPerformance';

type FiltersState = {
  caseId: string;
  claimId: string;
  caseType: string;
  status: string;
  priority: string;
  insuranceType: string;
};

type DateRangeState = {
  startDate: string;
  endDate: string;
};

type ReportPageCopy = {
  eyebrow: string;
  previewSubtitle: string;
  exportPdf: string;
  exportExcel: string;

  filterCaseId: string;
  filterClaimId: string;
  allCaseTypes: string;
  allStatuses: string;
  allPriorities: string;
  allInsuranceTypes: string;

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

  claimType: string;
  fraudConfirmedDate: string;
  fraudDetectionMethod: string;
  fraudAmount: string;
  actionTaken: string;
  referredEntity: string;

  fraudIndicatorType: string;
  indicatorDescription: string;
  occurrenceCount: string;
  riskScore: string;
  systemRecommendation: string;
  fraudOfficerDecision: string;

  suspensionDate: string;
  suspensionReason: string;
  suspensionDurationDays: string;
  currentStatus: string;
  assignedUser: string;

  totalReceivedCases: string;
  totalClosedCases: string;
  totalOpenCases: string;
  averageProcessingTime: string;
  mostFrequentFraudType: string;
  totalFraudAmount: string;

  newLabel: string;
  underReview: string;
  underInvestigation: string;
  pendingInformation: string;
  fraudConfirmed: string;
  closed: string;
  rejected: string;

  high: string;
  medium: string;
  low: string;

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

  reportTitles: Record<ReportKey, string>;
};

const pageCopy: Record<AppLanguage, ReportPageCopy> = {
  en: {
    eyebrow: 'Report',
    previewSubtitle: 'Preview page for report output and export actions.',
    exportPdf: 'Export PDF',
    exportExcel: 'Export Excel',

    filterCaseId: 'Filter Case Id',
    filterClaimId: 'Filter Claim Id',
    allCaseTypes: 'All Case Types',
    allStatuses: 'All Statuses',
    allPriorities: 'All Priorities',
    allInsuranceTypes: 'All Insurance Types',

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

    claimType: 'Claim Type',
    fraudConfirmedDate: 'Fraud Confirmed Date',
    fraudDetectionMethod: 'Fraud Detection Method',
    fraudAmount: 'Fraud Amount',
    actionTaken: 'Action Taken',
    referredEntity: 'Referred Entity',

    fraudIndicatorType: 'Fraud Indicator Type',
    indicatorDescription: 'Indicator Description',
    occurrenceCount: 'Occurrence Count',
    riskScore: 'Risk Score',
    systemRecommendation: 'System Recommendation',
    fraudOfficerDecision: 'Fraud Officer Decision',

    suspensionDate: 'Suspension Date',
    suspensionReason: 'Suspension Reason',
    suspensionDurationDays: 'Suspension Duration Days',
    currentStatus: 'Current Status',
    assignedUser: 'Assigned User',

    totalReceivedCases: 'Total Received Cases',
    totalClosedCases: 'Total Closed Cases',
    totalOpenCases: 'Total Open Cases',
    averageProcessingTime: 'Average Processing Time',
    mostFrequentFraudType: 'Most Frequent Fraud Type',
    totalFraudAmount: 'Total Fraud Amount',

    newLabel: 'New',
    underReview: 'Under Review',
    underInvestigation: 'Under Investigation',
    pendingInformation: 'Pending Information',
    fraudConfirmed: 'Fraud Confirmed',
    closed: 'Closed',
    rejected: 'Rejected',

    high: 'High',
    medium: 'Medium',
    low: 'Low',

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
    previewSubtitle: 'صفحة معاينة لمخرجات التقرير وخيارات التصدير.',
    exportPdf: 'تصدير PDF',
    exportExcel: 'تصدير Excel',

    filterCaseId: 'تصفية رقم البلاغ',
    filterClaimId: 'تصفية رقم المطالبة',
    allCaseTypes: 'جميع أنواع البلاغات',
    allStatuses: 'جميع الحالات',
    allPriorities: 'جميع الأولويات',
    allInsuranceTypes: 'جميع أنواع التأمين',

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

    claimType: 'نوع المطالبة',
    fraudConfirmedDate: 'تاريخ ثبوت الاحتيال',
    fraudDetectionMethod: 'آلية اكتشاف الاحتيال',
    fraudAmount: 'المبلغ المرتبط بالاحتيال',
    actionTaken: 'الإجراء المتخذ',
    referredEntity: 'الجهة المحالة لها',

    fraudIndicatorType: 'نوع مؤشر الاحتيال',
    indicatorDescription: 'وصف المؤشر',
    occurrenceCount: 'عدد مرات التكرار',
    riskScore: 'درجة الخطورة',
    systemRecommendation: 'التوصية الآلية',
    fraudOfficerDecision: 'قرار موظف وحدة مكافحة الاحتيال',

    suspensionDate: 'تاريخ التعليق',
    suspensionReason: 'سبب التعليق',
    suspensionDurationDays: 'مدة التعليق (بالأيام)',
    currentStatus: 'الحالة الحالية',
    assignedUser: 'الموظف المسؤول',

    totalReceivedCases: 'عدد البلاغات المستلمة',
    totalClosedCases: 'عدد البلاغات المغلقة',
    totalOpenCases: 'عدد البلاغات المفتوحة',
    averageProcessingTime: 'متوسط زمن معالجة البلاغ',
    mostFrequentFraudType: 'أكثر أنواع الاحتيال تكرارًا',
    totalFraudAmount: 'إجمالي المبالغ المرتبطة بالاحتيال',

    newLabel: 'جديد',
    underReview: 'قيد المراجعة',
    underInvestigation: 'قيد التحقيق',
    pendingInformation: 'بانتظار معلومات',
    fraudConfirmed: 'تم تأكيد الاحتيال',
    closed: 'مغلق',
    rejected: 'مرفوض',

    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',

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

export default function ReportDetailsPage() {
  const { reportName } = useParams();
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';

  const rawTitle = decodeURIComponent(reportName ?? 'Fraud Cases Report');
  const reportKey = routeToReportKey[rawTitle] ?? 'fraudCases';

  const [filters, setFilters] = useState<FiltersState>({
    caseId: '',
    claimId: '',
    caseType: '',
    status: '',
    priority: '',
    insuranceType: '',
  });

  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: '2026-04-01',
    endDate: '2026-04-07',
  });

  const translateStatus = (value: string) => {
    if (language === 'ar') {
      if (value === 'New') return t.newLabel;
      if (value === 'Under Review') return t.underReview;
      if (value === 'Under Investigation') return t.underInvestigation;
      if (value === 'Pending Information') return t.pendingInformation;
      if (value === 'Fraud Confirmed') return t.fraudConfirmed;
      if (value === 'Closed') return t.closed;
      if (value === 'Rejected') return t.rejected;
    }
    return value;
  };

  const translatePriority = (value: string) => {
    if (language === 'ar') {
      if (value === 'High') return t.high;
      if (value === 'Medium') return t.medium;
      if (value === 'Low') return t.low;
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
    return fraudCases.filter((item) => {
      const entryDate = item.caseEntryDate ?? '2026-04-01';
      const withinDateRange =
        (!dateRange.startDate || entryDate >= dateRange.startDate) &&
        (!dateRange.endDate || entryDate <= dateRange.endDate);

      return (
        withinDateRange &&
        item.id.toLowerCase().includes(filters.caseId.toLowerCase()) &&
        item.claimId.toLowerCase().includes(filters.claimId.toLowerCase()) &&
        item.caseType.toLowerCase().includes(filters.caseType.toLowerCase()) &&
        item.caseStatus.toLowerCase().includes(filters.status.toLowerCase()) &&
        item.priorityLevel.toLowerCase().includes(filters.priority.toLowerCase()) &&
        item.insuranceType.toLowerCase().includes(filters.insuranceType.toLowerCase())
      );
    });
  }, [dateRange.endDate, dateRange.startDate, filters]);

  const headers = useMemo(() => {
    switch (reportKey) {
      case 'fraudCases':
        return [
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
        ];
      case 'confirmedFraud':
        return [
          t.claimId,
          t.claimType,
          t.insuranceType,
          t.fraudConfirmedDate,
          t.fraudDetectionMethod,
          t.fraudAmount,
          t.actionTaken,
          t.referredEntity,
        ];
      case 'fraudIndicators':
        return [
          t.claimId,
          t.fraudIndicatorType,
          t.indicatorDescription,
          t.occurrenceCount,
          t.riskScore,
          t.systemRecommendation,
          t.fraudOfficerDecision,
        ];
      case 'suspendedClaims':
        return [
          t.claimId,
          t.suspensionDate,
          t.suspensionReason,
          t.priorityLevel,
          t.suspensionDurationDays,
          t.currentStatus,
          t.assignedUser,
        ];
      case 'fraudPerformance':
        return [
          t.totalReceivedCases,
          t.totalClosedCases,
          t.totalOpenCases,
          t.averageProcessingTime,
          t.mostFrequentFraudType,
          t.totalFraudAmount,
        ];
      default:
        return [t.caseId, t.claimId];
    }
  }, [reportKey, t]);

  const rows = useMemo(() => {
    if (reportKey === 'fraudPerformance') {
      const totalReceived = filteredCases.length;
      const totalClosed = filteredCases.filter((item) => item.caseStatus === 'Closed').length;
      const totalOpen = totalReceived - totalClosed;

      const typeCounts = filteredCases.reduce<Record<string, number>>((acc, item) => {
        acc[item.caseType] = (acc[item.caseType] ?? 0) + 1;
        return acc;
      }, {});

      const mostFrequentType =
        Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Fraud Suspected';

      const totalAmount = filteredCases.reduce((sum, item) => {
        const parsed = Number(String(item.suspectedAmount).replace(/[^\d.]/g, '')) || 0;
        return sum + parsed;
      }, 0);

      return [
        <tr key="fraud-performance-row">
          <td>{totalReceived}</td>
          <td>{totalClosed}</td>
          <td>{totalOpen}</td>
          <td>{language === 'ar' ? '5 أيام' : '5 days'}</td>
          <td>{translateCaseType(mostFrequentType)}</td>
          <td>{`SAR ${totalAmount.toLocaleString()}`}</td>
        </tr>,
      ];
    }

    return filteredCases.map((item, index) => {
      const confirmedDate = item.caseEntryDate ?? '2026-04-03';
      const suspensionDate = item.caseEntryDate ?? '2026-04-02';
      const assignedUser = item.assignedUser ?? (language === 'ar' ? 'غير معيّن' : 'Unassigned');

      if (reportKey === 'fraudCases') {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.claimId}</td>
            <td>{item.caseEntryDate ?? '2026-04-01'}</td>
            <td>{translateCaseSource(item.caseSource)}</td>
            <td>{translateCaseType(item.caseType)}</td>
            <td>{translatePriority(item.priorityLevel)}</td>
            <td>{translateStatus(item.caseStatus)}</td>
            <td>{language === 'ar' ? 'تمت مراجعة البلاغ من قبل وحدة مكافحة الاحتيال' : 'Reviewed by fraud unit'}</td>
            <td>{item.caseStatus === 'Closed' ? item.caseEntryDate ?? '2026-04-07' : '-'}</td>
            <td>{item.caseStatus === 'Closed' ? (language === 'ar' ? 'تمت المعالجة' : 'Resolved') : '-'}</td>
            <td>{item.suspectedAmount}</td>
            <td>{translateInsuranceType(item.insuranceType)}</td>
          </tr>
        );
      }

      if (reportKey === 'confirmedFraud') {
        return (
          <tr key={item.id}>
            <td>{item.claimId}</td>
            <td>{translateCaseType(item.caseType)}</td>
            <td>{translateInsuranceType(item.insuranceType)}</td>
            <td>{confirmedDate}</td>
            <td>{language === 'ar' ? 'تحليل المؤشرات والمراجعة اليدوية' : 'Indicator analysis and manual review'}</td>
            <td>{item.suspectedAmount}</td>
            <td>{language === 'ar' ? 'تعليق المطالبة' : 'Claim suspended'}</td>
            <td>{index % 2 === 0 ? (language === 'ar' ? 'الإدارة القانونية' : 'Legal Department') : '-'}</td>
          </tr>
        );
      }

      if (reportKey === 'fraudIndicators') {
        return (
          <tr key={item.id}>
            <td>{item.claimId}</td>
            <td>{translateCaseType(item.caseType)}</td>
            <td>{language === 'ar' ? 'تم رصد نمط غير معتاد في البيانات' : 'Unusual pattern detected in case data'}</td>
            <td>{index + 1}</td>
            <td>{80 - index * 3}</td>
            <td>{language === 'ar' ? 'يوصى بالتصعيد للمراجعة' : 'Recommended for escalation'}</td>
            <td>{language === 'ar' ? 'قيد المراجعة' : 'Under Review'}</td>
          </tr>
        );
      }

      if (reportKey === 'suspendedClaims') {
        return (
          <tr key={item.id}>
            <td>{item.claimId}</td>
            <td>{suspensionDate}</td>
            <td>{language === 'ar' ? 'اشتباه باحتيال يتطلب تحققًا إضافيًا' : 'Fraud suspicion requiring additional verification'}</td>
            <td>{translatePriority(item.priorityLevel)}</td>
            <td>{3 + index}</td>
            <td>{translateStatus(item.caseStatus)}</td>
            <td>{assignedUser}</td>
          </tr>
        );
      }

      return null;
    });
  }, [filteredCases, language, reportKey]);

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.reportTitles[reportKey]}
        subtitle={t.previewSubtitle}
        action={
          <div className="actions-inline">
            <button className="btn">{t.exportPdf}</button>
            <button className="btn primary">{t.exportExcel}</button>
          </div>
        }
      />

      {reportKey !== 'fraudPerformance' ? (
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
            value={filters.caseType}
            onChange={(event) => setFilters((current) => ({ ...current, caseType: event.target.value }))}
          >
            <option value="">{t.allCaseTypes}</option>
            <option value="Fraud Suspected">{t.fraudSuspected}</option>
            <option value="Fraud Confirmed">{t.fraudConfirmedType}</option>
            <option value="Violation">{t.violation}</option>
            <option value="Document Mismatch">{t.documentMismatch}</option>
            <option value="Identity Concern">{t.identityConcern}</option>
          </select>
          <select
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">{t.allStatuses}</option>
            <option value="New">{t.newLabel}</option>
            <option value="Under Review">{t.underReview}</option>
            <option value="Under Investigation">{t.underInvestigation}</option>
            <option value="Pending Information">{t.pendingInformation}</option>
            <option value="Fraud Confirmed">{t.fraudConfirmed}</option>
            <option value="Closed">{t.closed}</option>
          </select>
          <select
            value={filters.priority}
            onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}
          >
            <option value="">{t.allPriorities}</option>
            <option value="High">{t.high}</option>
            <option value="Medium">{t.medium}</option>
            <option value="Low">{t.low}</option>
          </select>
          <select
            value={filters.insuranceType}
            onChange={(event) => setFilters((current) => ({ ...current, insuranceType: event.target.value }))}
          >
            <option value="">{t.allInsuranceTypes}</option>
            <option value="Motor">{t.motor}</option>
            <option value="Medical">{t.medical}</option>
            <option value="Property">{t.property}</option>
            <option value="Travel">{t.travel}</option>
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
      ) : null}

      <Table headers={headers}>{rows}</Table>
    </div>
  );
}
