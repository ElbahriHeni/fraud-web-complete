import { Link, useOutletContext } from 'react-router-dom';
import { useMemo } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { fraudCases } from '../../data/mockData';
import Table from '../../components/Table';
import type { AppLanguage } from '../../layout/AppLayout';

type DashboardCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  generateReport: string;

  overviewEyebrow: string;
  overviewTitle: string;
  overviewSubtitle: string;
  reviewQueue: string;

  openCases: string;
  acrossAllStatuses: string;
  underInvestigation: string;
  activeAnalystWorkload: string;
  unassigned: string;
  needsImmediatePickup: string;
  suspectedAmount: string;
  highValueCasesInReview: string;

  totalCases: string;
  totalCasesSubtitle: string;
  newCases: string;
  newCasesSubtitle: string;
  casesUnderReview: string;
  casesUnderReviewSubtitle: string;
  casesUnderInvestigation: string;
  casesUnderInvestigationSubtitle: string;
  confirmedFraudCases: string;
  confirmedFraudCasesSubtitle: string;
  closedCases: string;
  closedCasesSubtitle: string;
  unassignedCases: string;
  unassignedCasesSubtitle: string;
  highPriorityCases: string;
  highPriorityCasesSubtitle: string;
  liveWorkloadSnapshot: string;

  casesByStatus: string;
  casesByStatusSubtitle: string;
  balanced: string;

  casesByPriority: string;
  casesByPrioritySubtitle: string;
  attention: string;

  casesByInsuranceType: string;
  casesByInsuranceTypeSubtitle: string;

  casesByCaseType: string;
  casesByCaseTypeSubtitle: string;

  teamActivity: string;
  recentAnalystMovement: string;
  teamPerformance: string;
  teamPerformanceSubtitle: string;
  averageCaseProcessingTime: string;
  averageCaseProcessingTimeSubtitle: string;
  avgProcessingTimeValue: string;
  thisWeek: string;
  thisMonth: string;
  highPriorityProcessing: string;
  thisWeekValue: string;
  thisMonthValue: string;
  highPriorityProcessingValue: string;

  recentCases: string;
  recentCasesSubtitle: string;
  recentCasesTableTitle: string;
  recentCasesTableSubtitle: string;

  caseId: string;
  claimId: string;
  caseType: string;
  priority: string;
  status: string;
  assignedUser: string;

  newLabel: string;
  underReviewLabel: string;
  underInvestigationLabel: string;
  fraudConfirmedLabel: string;

  highLabel: string;
  mediumLabel: string;
  lowLabel: string;

  motor: string;
  medical: string;
  property: string;
  travel: string;

  fraudSuspected: string;
  fraudConfirmedType: string;
  documentMismatch: string;
  identityConcern: string;

  whistleblowing: string;
  internal: string;
  providerAudit: string;
  customerCare: string;

  unassignedValue: string;

  activity1Name: string;
  activity1Text: string;
  activity2Name: string;
  activity2Text: string;
  activity3Name: string;
  activity3Text: string;
};

const pageCopy: Record<AppLanguage, DashboardCopy> = {
  en: {
    eyebrow: 'Workspace',
    title: 'Dashboard Screen',
    subtitle: 'Provide a high-level overview of fraud cases, workload, and performance indicators.',
    generateReport: 'Generate Report',

    overviewEyebrow: 'Overview',
    overviewTitle: "Today's operations snapshot",
    overviewSubtitle:
      'A simpler view of queue health, active investigations, and immediate review pressure.',
    reviewQueue: 'Review Queue',

    openCases: 'Open Cases',
    acrossAllStatuses: 'Across all statuses',
    underInvestigation: 'Under Investigation',
    activeAnalystWorkload: 'Active analyst workload',
    unassigned: 'Unassigned',
    needsImmediatePickup: 'Needs immediate pickup',
    suspectedAmount: 'Suspected Amount',
    highValueCasesInReview: 'High-value cases in review',

    totalCases: 'Total Cases',
    totalCasesSubtitle: '+12 this week',
    newCases: 'New Cases',
    newCasesSubtitle: 'Awaiting assignment',
    casesUnderReview: 'Cases Under Review',
    casesUnderReviewSubtitle: 'Pending analyst assessment',
    casesUnderInvestigation: 'Cases Under Investigation',
    casesUnderInvestigationSubtitle: 'Active workload',
    confirmedFraudCases: 'Confirmed Fraud Cases',
    confirmedFraudCasesSubtitle: 'This month',
    closedCases: 'Closed Cases',
    closedCasesSubtitle: 'Resolved and completed',
    unassignedCases: 'Unassigned Cases',
    unassignedCasesSubtitle: 'Shared queue',
    highPriorityCases: 'High Priority Cases',
    highPriorityCasesSubtitle: 'Immediate review',
    liveWorkloadSnapshot: 'Live workload snapshot',

    casesByStatus: 'Cases By Status',
    casesByStatusSubtitle: 'Work distribution across the operating funnel.',
    balanced: 'Balanced',

    casesByPriority: 'Cases By Priority',
    casesByPrioritySubtitle: 'Urgency mix used for daily staffing and handoff decisions.',
    attention: 'Attention',

    casesByInsuranceType: 'Cases By Insurance Type',
    casesByInsuranceTypeSubtitle: 'Distribution of cases across insurance lines.',

    casesByCaseType: 'Cases By Case Type',
    casesByCaseTypeSubtitle: 'Case mix by fraud reporting category.',

    teamActivity: 'Team Activity',
    recentAnalystMovement: 'Recent analyst movement',
    teamPerformance: 'Team Performance',
    teamPerformanceSubtitle: 'Team workload and case handling distribution.',
    averageCaseProcessingTime: 'Average Case Processing Time',
    averageCaseProcessingTimeSubtitle: 'Average elapsed handling time for fraud cases.',
    avgProcessingTimeValue: '5.2 days',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    highPriorityProcessing: 'High Priority Cases',
    thisWeekValue: '4.8 days',
    thisMonthValue: '5.2 days',
    highPriorityProcessingValue: '3.1 days',

    recentCases: 'Recent Cases',
    recentCasesSubtitle: 'Quick snapshot from the shared queue.',
    recentCasesTableTitle: 'Recent cases in motion',
    recentCasesTableSubtitle: 'The latest items surfaced for daily review.',

    caseId: 'Case Id',
    claimId: 'Claim Id',
    caseType: 'Case Type',
    priority: 'Priority',
    status: 'Status',
    assignedUser: 'Assigned User',

    newLabel: 'New',
    underReviewLabel: 'Under Review',
    underInvestigationLabel: 'Under Investigation',
    fraudConfirmedLabel: 'Fraud Confirmed',

    highLabel: 'High',
    mediumLabel: 'Medium',
    lowLabel: 'Low',

    motor: 'Motor',
    medical: 'Medical',
    property: 'Property',
    travel: 'Travel',

    fraudSuspected: 'Fraud Suspected',
    fraudConfirmedType: 'Fraud Confirmed',
    documentMismatch: 'Document Mismatch',
    identityConcern: 'Identity Concern',

    whistleblowing: 'Whistleblowing',
    internal: 'Internal',
    providerAudit: 'Provider Audit',
    customerCare: 'Customer Care',

    unassignedValue: 'Unassigned',

    activity1Name: 'Fatimah Salem',
    activity1Text: 'Closed invoice mismatch review and escalated legal referral',
    activity2Name: 'Mohammed Hassan',
    activity2Text: 'Moved one motor violation into Under Review',
    activity3Name: 'Noura Khaled',
    activity3Text: 'Requested supporting attachments for a pending property case',
  },
  ar: {
    eyebrow: 'مساحة العمل',
    title: 'شاشة لوحة التحكم',
    subtitle: 'توفير نظرة عامة عالية المستوى على بلاغات الاحتيال، حجم العمل، ومؤشرات الأداء.',
    generateReport: 'إنشاء تقرير',

    overviewEyebrow: 'نظرة عامة',
    overviewTitle: 'ملخص عمليات اليوم',
    overviewSubtitle: 'عرض مبسط لصحة قائمة العمل، والتحقيقات النشطة، والضغط الفوري على المراجعة.',
    reviewQueue: 'مراجعة القائمة',

    openCases: 'إجمالي البلاغات المفتوحة',
    acrossAllStatuses: 'عبر جميع الحالات',
    underInvestigation: 'البلاغات قيد التحقيق',
    activeAnalystWorkload: 'عبء العمل النشط للمحللين',
    unassigned: 'البلاغات غير المعيّنة',
    needsImmediatePickup: 'تحتاج إلى تعيين فوري',
    suspectedAmount: 'المبلغ محل الاشتباه',
    highValueCasesInReview: 'بلاغات عالية القيمة قيد المراجعة',

    totalCases: 'إجمالي البلاغات',
    totalCasesSubtitle: '+12 هذا الأسبوع',
    newCases: 'البلاغات الجديدة',
    newCasesSubtitle: 'بانتظار التعيين',
    casesUnderReview: 'البلاغات قيد المراجعة',
    casesUnderReviewSubtitle: 'بانتظار تقييم المحلل',
    casesUnderInvestigation: 'البلاغات قيد التحقيق',
    casesUnderInvestigationSubtitle: 'عبء العمل النشط',
    confirmedFraudCases: 'البلاغات المؤكدة احتيال',
    confirmedFraudCasesSubtitle: 'خلال هذا الشهر',
    closedCases: 'البلاغات المغلقة',
    closedCasesSubtitle: 'تمت معالجتها وإغلاقها',
    unassignedCases: 'البلاغات غير المعيّنة',
    unassignedCasesSubtitle: 'القائمة المشتركة',
    highPriorityCases: 'البلاغات عالية الأولوية',
    highPriorityCasesSubtitle: 'تتطلب مراجعة فورية',
    liveWorkloadSnapshot: 'لقطة مباشرة لعبء العمل',

    casesByStatus: 'البلاغات حسب الحالة',
    casesByStatusSubtitle: 'توزيع العمل عبر مراحل سير المعالجة.',
    balanced: 'متوازن',

    casesByPriority: 'البلاغات حسب الأولوية',
    casesByPrioritySubtitle: 'مزيج الأولويات المستخدم في التوزيع اليومي واتخاذ قرارات الإحالة.',
    attention: 'يتطلب انتباه',

    casesByInsuranceType: 'البلاغات حسب نوع التأمين',
    casesByInsuranceTypeSubtitle: 'توزيع البلاغات حسب خطوط التأمين.',

    casesByCaseType: 'البلاغات حسب نوع البلاغ',
    casesByCaseTypeSubtitle: 'مزيج البلاغات حسب فئة الإبلاغ عن الاحتيال.',

    teamActivity: 'أداء أعضاء الفريق',
    recentAnalystMovement: 'آخر تحركات المحللين',
    teamPerformance: 'أداء أعضاء الفريق',
    teamPerformanceSubtitle: 'عبء العمل وتوزيع معالجة البلاغات بين أعضاء الفريق.',
    averageCaseProcessingTime: 'متوسط زمن معالجة البلاغ',
    averageCaseProcessingTimeSubtitle: 'متوسط الزمن المستغرق لمعالجة بلاغات الاحتيال.',
    avgProcessingTimeValue: '5.2 أيام',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    highPriorityProcessing: 'البلاغات عالية الأولوية',
    thisWeekValue: '4.8 أيام',
    thisMonthValue: '5.2 أيام',
    highPriorityProcessingValue: '3.1 أيام',

    recentCases: 'البلاغات الحديثة',
    recentCasesSubtitle: 'عرض سريع لأحدث البلاغات في القائمة المشتركة.',
    recentCasesTableTitle: 'البلاغات الحديثة قيد المتابعة',
    recentCasesTableSubtitle: 'أحدث العناصر التي ظهرت للمراجعة اليومية.',

    caseId: 'رقم البلاغ',
    claimId: 'رقم المطالبة',
    caseType: 'نوع البلاغ',
    priority: 'الأولوية',
    status: 'الحالة',
    assignedUser: 'المستخدم المسؤول',

    newLabel: 'جديد',
    underReviewLabel: 'قيد المراجعة',
    underInvestigationLabel: 'قيد التحقيق',
    fraudConfirmedLabel: 'تم تأكيد الاحتيال',

    highLabel: 'عالية',
    mediumLabel: 'متوسطة',
    lowLabel: 'منخفضة',

    motor: 'مركبات',
    medical: 'طبي',
    property: 'ممتلكات',
    travel: 'سفر',

    fraudSuspected: 'اشتباه احتيال',
    fraudConfirmedType: 'احتيال مؤكد',
    documentMismatch: 'عدم تطابق المستندات',
    identityConcern: 'اشتباه في الهوية',

    whistleblowing: 'الإبلاغ الداخلي',
    internal: 'داخلي',
    providerAudit: 'تدقيق مقدم الخدمة',
    customerCare: 'خدمة العملاء',

    unassignedValue: 'غير معيّن',

    activity1Name: 'فاطمة سالم',
    activity1Text: 'أغلقت مراجعة عدم تطابق الفاتورة وصعّدت الحالة إلى الإحالة القانونية',
    activity2Name: 'محمد حسن',
    activity2Text: 'نقل إحدى حالات مخالفات المركبات إلى قيد المراجعة',
    activity3Name: 'نورة خالد',
    activity3Text: 'طلبت مرفقات داعمة لحالة ممتلكات معلّقة',
  },
};

export default function DashboardPage() {
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';

  const cards = useMemo(
    () => [
      { title: t.totalCases, value: '248', subtitle: t.totalCasesSubtitle },
      { title: t.newCases, value: '19', subtitle: t.newCasesSubtitle },
      { title: t.casesUnderReview, value: '26', subtitle: t.casesUnderReviewSubtitle },
      { title: t.casesUnderInvestigation, value: '37', subtitle: t.casesUnderInvestigationSubtitle },
      { title: t.confirmedFraudCases, value: '14', subtitle: t.confirmedFraudCasesSubtitle },
      { title: t.closedCases, value: '52', subtitle: t.closedCasesSubtitle },
      { title: t.unassignedCases, value: '8', subtitle: t.unassignedCasesSubtitle },
      { title: t.highPriorityCases, value: '11', subtitle: t.highPriorityCasesSubtitle },
    ],
    [t]
  );

  const insuranceTypeData = useMemo(
    () => [
      { label: t.motor, value: 15, max: 20 },
      { label: t.medical, value: 12, max: 20 },
      { label: t.property, value: 7, max: 20 },
      { label: t.travel, value: 4, max: 20 },
    ],
    [t]
  );

  const caseTypeData = useMemo(
    () => [
      { label: t.fraudSuspected, value: 18, max: 20 },
      { label: t.fraudConfirmedType, value: 9, max: 20 },
      { label: t.documentMismatch, value: 6, max: 20 },
      { label: t.identityConcern, value: 4, max: 20 },
    ],
    [t]
  );

  const statusData = useMemo(
    () => [
      { label: t.newLabel, value: 19, max: 50 },
      { label: t.underReviewLabel, value: 26, max: 50 },
      { label: t.underInvestigationLabel, value: 37, max: 50 },
      { label: t.fraudConfirmedLabel, value: 14, max: 50 },
    ],
    [t]
  );

  const priorityData = useMemo(
    () => [
      { label: t.highLabel, value: 11, max: 20 },
      { label: t.mediumLabel, value: 8, max: 20 },
      { label: t.lowLabel, value: 5, max: 20 },
    ],
    [t]
  );

  const processingTimeData = useMemo(
    () => [
      { label: t.thisWeek, value: t.thisWeekValue, progress: 48, max: 100 },
      { label: t.thisMonth, value: t.thisMonthValue, progress: 52, max: 100 },
      { label: t.highPriorityProcessing, value: t.highPriorityProcessingValue, progress: 31, max: 100 },
    ],
    [t]
  );

  const activityList = useMemo(
    () => [
      { name: t.activity1Name, text: t.activity1Text },
      { name: t.activity2Name, text: t.activity2Text },
      { name: t.activity3Name, text: t.activity3Text },
    ],
    [t]
  );

  const translatePriority = (value: string) => {
    if (language === 'ar') {
      if (value === 'High') return t.highLabel;
      if (value === 'Medium') return t.mediumLabel;
      if (value === 'Low') return t.lowLabel;
    }
    return value;
  };

  const translateStatus = (value: string) => {
    if (language === 'ar') {
      if (value === 'New') return t.newLabel;
      if (value === 'Under Review') return t.underReviewLabel;
      if (value === 'Under Investigation') return t.underInvestigationLabel;
      if (value === 'Fraud Confirmed') return t.fraudConfirmedLabel;
    }
    return value;
  };

  const translateCaseType = (value: string) => {
    if (language === 'ar') {
      if (value === 'Fraud Suspected') return t.fraudSuspected;
      if (value === 'Fraud Confirmed') return t.fraudConfirmedType;
      if (value === 'Document Mismatch') return t.documentMismatch;
      if (value === 'Identity Concern') return t.identityConcern;
    }
    return value;
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        action={<Link className="btn primary" to="/app/reports">{t.generateReport}</Link>}
      />

      <section className="dashboard-overview">
        <div className="card dashboard-summary">
          <div className="dashboard-summary-header">
            <div>
              <span className="eyebrow">{t.overviewEyebrow}</span>
              <h3>{t.overviewTitle}</h3>
              <p className="muted">{t.overviewSubtitle}</p>
            </div>
            <Link className="btn" to="/app/queue">{t.reviewQueue}</Link>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="muted small">{t.openCases}</span>
              <strong>248</strong>
              <span className="muted small">{t.acrossAllStatuses}</span>
            </div>

            <div className="summary-item">
              <span className="muted small">{t.underInvestigation}</span>
              <strong>37</strong>
              <span className="muted small">{t.activeAnalystWorkload}</span>
            </div>

            <div className="summary-item">
              <span className="muted small">{t.unassigned}</span>
              <strong>8</strong>
              <span className="muted small">{t.needsImmediatePickup}</span>
            </div>

            <div className="summary-item">
              <span className="muted small">{t.suspectedAmount}</span>
              <strong>SAR 95K</strong>
              <span className="muted small">{t.highValueCasesInReview}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="card-grid">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} trendLabel={t.liveWorkloadSnapshot} />
        ))}
      </div>

      <div className="two-col">
        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>{t.casesByStatus}</h3>
              <p className="muted">{t.casesByStatusSubtitle}</p>
            </div>
            <span className="badge medium">{t.balanced}</span>
          </div>

          <div className="bars">
            {statusData.map((item) => (
              <div key={item.label}>
                <span className="bar-label">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </span>
                <progress value={item.value} max={item.max} />
              </div>
            ))}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>{t.casesByPriority}</h3>
              <p className="muted">{t.casesByPrioritySubtitle}</p>
            </div>
            <span className="badge high">{t.attention}</span>
          </div>

          <div className="bars">
            {priorityData.map((item) => (
              <div key={item.label}>
                <span className="bar-label">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </span>
                <progress value={item.value} max={item.max} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>{t.casesByInsuranceType}</h3>
              <p className="muted">{t.casesByInsuranceTypeSubtitle}</p>
            </div>
          </div>

          <div className="bars">
            {insuranceTypeData.map((item) => (
              <div key={item.label}>
                <span className="bar-label">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </span>
                <progress value={item.value} max={item.max} />
              </div>
            ))}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>{t.casesByCaseType}</h3>
              <p className="muted">{t.casesByCaseTypeSubtitle}</p>
            </div>
          </div>

          <div className="bars">
            {caseTypeData.map((item) => (
              <div key={item.label}>
                <span className="bar-label">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </span>
                <progress value={item.value} max={item.max} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <span className="eyebrow">{t.teamActivity}</span>
          <h3>{t.teamPerformance}</h3>
          <p className="muted">{t.teamPerformanceSubtitle}</p>

          <div className="activity-list">
            {activityList.map((activity) => (
              <div className="activity-item" key={`${activity.name}-${activity.text}`}>
                <strong>{activity.name}</strong>
                <span>{activity.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-card-header">
            <div>
              <h3>{t.averageCaseProcessingTime}</h3>
              <p className="muted">{t.averageCaseProcessingTimeSubtitle}</p>
            </div>
            <span className="badge medium">{t.avgProcessingTimeValue}</span>
          </div>

          <div className="bars">
            {processingTimeData.map((item) => (
              <div key={item.label}>
                <span className="bar-label">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </span>
                <progress value={item.progress} max={item.max} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageHeader eyebrow={t.eyebrow} title={t.recentCases} subtitle={t.recentCasesSubtitle} />

      <Table
        title={t.recentCasesTableTitle}
        subtitle={t.recentCasesTableSubtitle}
        headers={[t.caseId, t.claimId, t.caseType, t.priority, t.status, t.assignedUser]}
      >
        {fraudCases.slice(0, 4).map((item) => (
          <tr key={item.id}>
            <td>
              <Link className="text-link" to={`/app/cases/${item.id}`}>
                {item.id}
              </Link>
            </td>
            <td>{item.claimId}</td>
            <td>{translateCaseType(item.caseType)}</td>
            <td>
              <span className={`badge ${item.priorityLevel.toLowerCase()}`}>
                {translatePriority(item.priorityLevel)}
              </span>
            </td>
            <td>{translateStatus(item.caseStatus)}</td>
            <td>{item.assignedUser ?? t.unassignedValue}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
