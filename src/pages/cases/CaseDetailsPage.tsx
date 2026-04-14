import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases, users } from '../../data/mockData';
import type { AppLanguage } from '../../layout/AppLayout';

type WizardStep =
  | 'reporter'
  | 'overview'
  | 'indicators'
  | 'fraudDetails'
  | 'workflow'
  | 'attachments'
  | 'history';

type PageCopy = {
  title: string;
  titleNew: string;
  subtitle: string;
  subtitleNew: string;
  claim: string;
  releaseAssignment: string;
  saveChanges: string;

  stepReporter: string;
  stepOverview: string;
  stepIndicators: string;
  stepFraudDetails: string;
  stepWorkflow: string;
  stepAttachments: string;
  stepHistory: string;

  next: string;
  back: string;

  overview: string;
  reporter: string;
  workflow: string;
  assignmentStatus: string;
  indicators: string;
  fraudIndicators: string;
  confirmedFraud: string;
  fraudDetails: string;
  assignmentHistory: string;

  caseId: string;
  claimId: string;
  caseType: string;
  insuranceType: string;
  suspectedAmount: string;
  entryDate: string;
  assignedUser: string;
  closureDate: string;
  closureReason: string;
  description: string;
  attachmentsView: string;
  email: string;
  mobileNumber: string;
  nationalId: string;
  assignmentDate: string;
  assignedBy: string;
  reassignmentReason: string;
  caseStatus: string;
  fraudUnitNotes: string;
  fraudIndicatorType: string;
  indicatorDescription: string;
  occurrenceCount: string;
  fraudOfficerDecision: string;
  claimType: string;
  fraudConfirmedDate: string;
  fraudDetectionMethod: string;
  fraudAmount: string;
  actionTaken: string;
  referredEntity: string;
  caseSource: string;
  priorityLevel: string;

  unassigned: string;
  notClosed: string;
  notAvailable: string;
  noAttachments: string;
  noSupportingFiles: string;
  noHistory: string;
  remove: string;

  indicatorTypeOptions: string[];
  decisionOptions: string[];
  statusOptions: string[];

  historyAssignedTo: string;
  historyDate: string;
  historyNotes: string;
};

const pageCopy: Record<AppLanguage, PageCopy> = {
  en: {
    title: 'Case Details',
    titleNew: 'New Case',
    subtitle: 'Review and update this case step by step.',
    subtitleNew: 'Create a new fraud case by entering all details below.',
    claim: 'Claim',
    releaseAssignment: 'Release Assignment',
    saveChanges: 'Save Changes',

    stepReporter: 'Reporter',
    stepOverview: 'Case Overview',
    stepIndicators: 'Fraud Indicators',
    stepFraudDetails: 'Confirmed Fraud Details',
    stepWorkflow: 'Workflow',
    stepAttachments: 'Attachments',
    stepHistory: 'Assignment History',

    next: 'Next',
    back: 'Back',

    overview: 'Case Overview',
    reporter: 'Reporter',
    workflow: 'Workflow',
    assignmentStatus: 'Assignment and Status',
    indicators: 'Indicators',
    fraudIndicators: 'Fraud Indicators',
    confirmedFraud: 'Confirmed Fraud',
    fraudDetails: 'Fraud Details',
    assignmentHistory: 'Assignment History',

    caseId: 'Case Id',
    claimId: 'Claim Id',
    caseType: 'Case Type',
    insuranceType: 'Insurance Type',
    suspectedAmount: 'Suspected Amount',
    entryDate: 'Case Entry Date',
    assignedUser: 'Assigned User',
    closureDate: 'Closure Date',
    closureReason: 'Closure Reason',
    description: 'Description',
    attachmentsView: 'Attachments View',
    email: 'Email',
    mobileNumber: 'Mobile Number',
    nationalId: 'ID / Iqama Number',
    assignmentDate: 'Assignment Date',
    assignedBy: 'Assigned By',
    reassignmentReason: 'Reassignment Reason',
    caseStatus: 'Case Status',
    fraudUnitNotes: 'Fraud Unit Notes',
    fraudIndicatorType: 'Fraud Indicator Type',
    indicatorDescription: 'Indicator Description',
    occurrenceCount: 'Occurrence Count',
    fraudOfficerDecision: 'Fraud Officer Decision',
    claimType: 'Claim Type',
    fraudConfirmedDate: 'Fraud Confirmed Date',
    fraudDetectionMethod: 'Fraud Detection Method',
    fraudAmount: 'Fraud Amount',
    actionTaken: 'Action Taken',
    referredEntity: 'Referred Entity',
    caseSource: 'Case Source',
    priorityLevel: 'Priority Level',

    unassigned: 'Unassigned',
    notClosed: 'Not Closed',
    notAvailable: 'Not Available',
    noAttachments: 'No Attachments',
    noSupportingFiles: 'No supporting files submitted yet.',
    noHistory: 'No assignment history yet.',
    remove: 'Remove',

    indicatorTypeOptions: [
      'Duplicate Claims',
      'Billing Pattern Anomaly',
      'Policy Mismatch',
      'Incomplete Evidence',
      'High Value Repetition',
      'Other',
    ],
    decisionOptions: [
      'Proceed with investigation',
      'Pending additional information',
      'Fraud confirmed',
      'Rejected',
      'Close case',
    ],
    statusOptions: [
      'New',
      'Under Review',
      'Under Investigation',
      'Pending Information',
      'Fraud Confirmed',
      'Rejected',
      'Closed',
    ],

    historyAssignedTo: 'Assigned to User',
    historyDate: 'Change Date',
    historyNotes: 'Notes',
  },
  ar: {
    title: 'تفاصيل البلاغ',
    titleNew: 'بلاغ جديد',
    subtitle: 'راجع وحدّث هذا البلاغ خطوة بخطوة.',
    subtitleNew: 'أنشئ بلاغ احتيال جديدًا من خلال إدخال جميع التفاصيل أدناه.',
    claim: 'استلام البلاغ',
    releaseAssignment: 'إلغاء التعيين',
    saveChanges: 'حفظ التغييرات',

    stepReporter: 'بيانات المُبلّغ',
    stepOverview: 'نظرة عامة على البلاغ',
    stepIndicators: 'مؤشرات الاحتيال',
    stepFraudDetails: 'تفاصيل الاحتيال المؤكد',
    stepWorkflow: 'سير العمل',
    stepAttachments: 'المرفقات',
    stepHistory: 'سجل التعيين',

    next: 'التالي',
    back: 'السابق',

    overview: 'نظرة عامة على البلاغ',
    reporter: 'بيانات المُبلّغ',
    workflow: 'سير العمل',
    assignmentStatus: 'التعيين والحالة',
    indicators: 'المؤشرات',
    fraudIndicators: 'مؤشرات الاحتيال',
    confirmedFraud: 'الاحتيال المؤكد',
    fraudDetails: 'تفاصيل الاحتيال',
    assignmentHistory: 'سجل التعيين',

    caseId: 'رقم البلاغ',
    claimId: 'رقم المطالبة',
    caseType: 'نوع البلاغ',
    insuranceType: 'نوع التأمين',
    suspectedAmount: 'المبلغ محل الاشتباه',
    entryDate: 'تاريخ إدخال البلاغ',
    assignedUser: 'المستخدم المسؤول',
    closureDate: 'تاريخ الإغلاق',
    closureReason: 'سبب الإغلاق',
    description: 'الوصف',
    attachmentsView: 'عرض المرفقات',
    email: 'البريد الإلكتروني',
    mobileNumber: 'رقم الجوال',
    nationalId: 'رقم الهوية / الإقامة',
    assignmentDate: 'تاريخ التعيين',
    assignedBy: 'تم التعيين بواسطة',
    reassignmentReason: 'سبب إعادة التعيين',
    caseStatus: 'حالة البلاغ',
    fraudUnitNotes: 'ملاحظات وحدة مكافحة الاحتيال',
    fraudIndicatorType: 'نوع مؤشر الاحتيال',
    indicatorDescription: 'وصف المؤشر',
    occurrenceCount: 'عدد مرات التكرار',
    fraudOfficerDecision: 'قرار موظف وحدة مكافحة الاحتيال',
    claimType: 'نوع المطالبة',
    fraudConfirmedDate: 'تاريخ ثبوت الاحتيال',
    fraudDetectionMethod: 'آلية اكتشاف الاحتيال',
    fraudAmount: 'المبلغ المرتبط بالاحتيال',
    actionTaken: 'الإجراء المتخذ',
    referredEntity: 'الجهة المحالة لها',
    caseSource: 'طريقة استقبال البلاغ',
    priorityLevel: 'مستوى الأولوية',

    unassigned: 'غير معيّن',
    notClosed: 'غير مغلق',
    notAvailable: 'غير متوفر',
    noAttachments: 'لا توجد مرفقات',
    noSupportingFiles: 'لا توجد ملفات داعمة مرفقة حتى الآن.',
    noHistory: 'لا يوجد سجل تعيين حتى الآن.',
    remove: 'إزالة',

    indicatorTypeOptions: [
      'مطالبات مكررة',
      'شذوذ في نمط الفوترة',
      'عدم تطابق الوثيقة',
      'أدلة غير مكتملة',
      'تكرار مبالغ عالية',
      'أخرى',
    ],
    decisionOptions: [
      'المتابعة والتحقيق',
      'بانتظار معلومات إضافية',
      'تم تأكيد الاحتيال',
      'مرفوض',
      'إغلاق البلاغ',
    ],
    statusOptions: ['جديد', 'قيد المراجعة', 'قيد التحقيق', 'بانتظار معلومات', 'تم تأكيد الاحتيال', 'مرفوض', 'مغلق'],

    historyAssignedTo: 'المستخدم المسؤول',
    historyDate: 'تاريخ التغيير',
    historyNotes: 'ملاحظات',
  },
};

const stepOrder: WizardStep[] = [
  'reporter',
  'overview',
  'indicators',
  'fraudDetails',
  'workflow',
  'attachments',
  'history',
];

export default function CaseDetailsPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { language } = useOutletContext<{ language: AppLanguage }>();
  const t = useMemo(() => pageCopy[language], [language]);
  const isArabic = language === 'ar';
  const isNewCase = !caseId || caseId === 'new';

  const emptyCase = {
    id: '',
    claimId: '',
    caseSource: '',
    priorityLevel: '',
    caseStatus: '',
    caseType: '',
    insuranceType: '',
    suspectedAmount: '',
    caseEntryDate: '',
    assignedUser: '',
    closureDate: '',
    closureReason: '',
    submissionDetails: '',
    attachments: [] as Array<{ id?: string; fileName: string; fileType: string }>,
    reporterName: '',
    reporterEmail: '',
    reporterMobile: '',
    nationalIdOrIqama: '',
    assignmentDate: '',
    assignedBy: '',
    reassignmentReason: '',
    fraudUnitNotes: '',
    claimType: '',
    fraudConfirmedDate: '',
    fraudDetectionMethod: '',
    fraudAmount: '',
    actionTaken: '',
    referredEntity: '',
    assignmentHistory: [] as Array<{ newUser?: string; changeDate: string; changeReason: string }>,
    fraudIndicator: {
      fraudIndicatorType: '',
      indicatorDescription: '',
      occurrenceCount: 0,
      fraudOfficerDecision: '',
    },
  };

  const sourceItem =
    isNewCase ? emptyCase : fraudCases.find((entry) => entry.id === caseId) ?? fraudCases[0];

  const [currentStep, setCurrentStep] = useState<WizardStep>('reporter');
  const [attachments, setAttachments] = useState(sourceItem.attachments);

  const [form, setForm] = useState({
    id: sourceItem.id ?? '',
    claimId: sourceItem.claimId ?? '',
    caseSource: sourceItem.caseSource ?? '',
    priorityLevel: sourceItem.priorityLevel ?? '',
    caseStatus: sourceItem.caseStatus ?? '',
    caseType: sourceItem.caseType ?? '',
    insuranceType: sourceItem.insuranceType ?? '',
    suspectedAmount: sourceItem.suspectedAmount ?? '',
    caseEntryDate: sourceItem.caseEntryDate ?? '',
    assignedUser: sourceItem.assignedUser ?? '',
    closureDate: sourceItem.closureDate ?? '',
    closureReason: sourceItem.closureReason ?? '',
    submissionDetails: sourceItem.submissionDetails ?? '',
    reporterName: sourceItem.reporterName ?? '',
    reporterEmail: sourceItem.reporterEmail ?? '',
    reporterMobile: sourceItem.reporterMobile ?? '',
    nationalIdOrIqama: sourceItem.nationalIdOrIqama ?? '',
    assignmentDate: sourceItem.assignmentDate ?? '',
    assignedBy: sourceItem.assignedBy ?? '',
    reassignmentReason: sourceItem.reassignmentReason ?? '',
    fraudUnitNotes: sourceItem.fraudUnitNotes ?? '',
    claimType: sourceItem.claimType ?? '',
    fraudConfirmedDate: sourceItem.fraudConfirmedDate ?? '',
    fraudDetectionMethod: sourceItem.fraudDetectionMethod ?? '',
    fraudAmount: sourceItem.fraudAmount ?? '',
    actionTaken: sourceItem.actionTaken ?? '',
    referredEntity: sourceItem.referredEntity ?? '',
    fraudIndicatorType: sourceItem.fraudIndicator.fraudIndicatorType ?? '',
    indicatorDescription: sourceItem.fraudIndicator.indicatorDescription ?? '',
    occurrenceCount: String(sourceItem.fraudIndicator.occurrenceCount ?? ''),
    fraudOfficerDecision: sourceItem.fraudIndicator.fraudOfficerDecision ?? '',
  });

  const currentStepIndex = stepOrder.indexOf(currentStep);

  const stepLabels: Record<WizardStep, string> = {
    reporter: t.stepReporter,
    overview: t.stepOverview,
    indicators: t.stepIndicators,
    fraudDetails: t.stepFraudDetails,
    workflow: t.stepWorkflow,
    attachments: t.stepAttachments,
    history: t.stepHistory,
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const goNext = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentStepIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepOrder[currentStepIndex - 1]);
    }
  };

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    const mapped = Array.from(incomingFiles).map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      fileName: file.name,
      fileType: file.type || 'file',
    }));
    setAttachments((current) => [...current, ...mapped]);
  };

  const removeAttachment = (idToRemove?: string) => {
    setAttachments((current) => current.filter((item) => item.id !== idToRemove));
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        title={isNewCase ? t.titleNew : `${t.title} - ${sourceItem.id}`}
        subtitle={isNewCase ? t.subtitleNew : t.subtitle}
        action={
          <div className="actions-inline" style={{ gap: 12 }}>
            {!isNewCase ? <button className="btn">{t.claim}</button> : null}
            {!isNewCase ? <button className="btn">{t.releaseAssignment}</button> : null}
            <button className="btn primary" type="button" onClick={() => navigate('/app/queue')}>
              {t.saveChanges}
            </button>
          </div>
        }
      />

      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${stepOrder.length}, minmax(0, 1fr))`,
            gap: 12,
            alignItems: 'stretch',
          }}
        >
          {stepOrder.map((step, index) => {
            const isActive = currentStep === step;
            const isCompleted = index < currentStepIndex;
            const stepNumber = index + 1;

            return (
              <button
                key={step}
                type="button"
                onClick={() => setCurrentStep(step)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  textAlign: isArabic ? 'right' : 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        minWidth: 34,
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                        color: isActive || isCompleted ? '#fff' : '#0f172a',
                        background:
                          isActive || isCompleted
                            ? 'rgba(13, 108, 104, 0.95)'
                            : 'rgba(15, 23, 42, 0.08)',
                        border: isActive ? '2px solid rgba(13, 108, 104, 1)' : '2px solid transparent',
                        marginTop: 2,
                      }}
                    >
                      {isCompleted ? '✓' : stepNumber}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        minHeight: 58,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: 'rgba(15, 23, 42, 0.55)',
                          marginBottom: 2,
                        }}
                      >
                        {language === 'ar' ? `الخطوة ${stepNumber}` : `Step ${stepNumber}`}
                      </div>
                      <div
                        style={{
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? 'rgba(13, 108, 104, 1)' : 'inherit',
                          lineHeight: 1.25,
                        }}
                      >
                        {stepLabels[step]}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      background: 'rgba(15, 23, 42, 0.08)',
                      overflow: 'hidden',
                      marginTop: 'auto',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: isCompleted ? '100%' : isActive ? '60%' : '0%',
                        background: 'rgba(13, 108, 104, 0.95)',
                        borderRadius: 999,
                        transition: 'width 0.25s ease',
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card">
        {currentStep === 'reporter' ? (
          <div className="form-grid">
            <label>
              <span>{t.reporter}</span>
              <input
                value={form.reporterName}
                onChange={(e) => updateField('reporterName', e.target.value)}
                placeholder={t.reporter}
              />
            </label>
            <label>
              <span>{t.email}</span>
              <input
                value={form.reporterEmail}
                onChange={(e) => updateField('reporterEmail', e.target.value)}
                placeholder={t.email}
              />
            </label>
            <label>
              <span>{t.mobileNumber}</span>
              <input
                value={form.reporterMobile}
                onChange={(e) => updateField('reporterMobile', e.target.value)}
                placeholder={t.mobileNumber}
              />
            </label>
            <label>
              <span>{t.nationalId}</span>
              <input
                value={form.nationalIdOrIqama}
                onChange={(e) => updateField('nationalIdOrIqama', e.target.value)}
                placeholder={t.nationalId}
              />
            </label>
          </div>
        ) : null}

        {currentStep === 'overview' ? (
          <div className="form-grid">
            <label>
              <span>{t.caseId}</span>
              <input value={form.id} onChange={(e) => updateField('id', e.target.value)} placeholder={t.caseId} />
            </label>
            <label>
              <span>{t.claimId}</span>
              <input
                value={form.claimId}
                onChange={(e) => updateField('claimId', e.target.value)}
                placeholder={t.claimId}
              />
            </label>
            <label>
              <span>{t.caseSource}</span>
              <input
                value={form.caseSource}
                onChange={(e) => updateField('caseSource', e.target.value)}
                placeholder={t.caseSource}
              />
            </label>
            <label>
              <span>{t.priorityLevel}</span>
              <input
                value={form.priorityLevel}
                onChange={(e) => updateField('priorityLevel', e.target.value)}
                placeholder={t.priorityLevel}
              />
            </label>
            <label>
              <span>{t.caseType}</span>
              <input
                value={form.caseType}
                onChange={(e) => updateField('caseType', e.target.value)}
                placeholder={t.caseType}
              />
            </label>
            <label>
              <span>{t.insuranceType}</span>
              <input
                value={form.insuranceType}
                onChange={(e) => updateField('insuranceType', e.target.value)}
                placeholder={t.insuranceType}
              />
            </label>
            <label>
              <span>{t.suspectedAmount}</span>
              <input
                value={form.suspectedAmount}
                onChange={(e) => updateField('suspectedAmount', e.target.value)}
                placeholder={t.suspectedAmount}
              />
            </label>
            <label>
              <span>{t.entryDate}</span>
              <input type="date" value={form.caseEntryDate} onChange={(e) => updateField('caseEntryDate', e.target.value)} />
            </label>
            <label>
              <span>{t.closureDate}</span>
              <input type="date" value={form.closureDate} onChange={(e) => updateField('closureDate', e.target.value)} />
            </label>
            <label>
              <span>{t.closureReason}</span>
              <input
                value={form.closureReason}
                onChange={(e) => updateField('closureReason', e.target.value)}
                placeholder={t.closureReason}
              />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span>{t.description}</span>
              <textarea
                rows={5}
                value={form.submissionDetails}
                onChange={(e) => updateField('submissionDetails', e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {currentStep === 'indicators' ? (
          <div className="form-grid">
            <label>
              <span>{t.fraudIndicatorType}</span>
              <select
                value={form.fraudIndicatorType}
                onChange={(e) => updateField('fraudIndicatorType', e.target.value)}
              >
                <option value=""></option>
                {t.indicatorTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{t.occurrenceCount}</span>
              <input
                value={form.occurrenceCount}
                onChange={(e) => updateField('occurrenceCount', e.target.value)}
                placeholder={t.occurrenceCount}
              />
            </label>
            <label>
              <span>{t.fraudOfficerDecision}</span>
              <select
                value={form.fraudOfficerDecision}
                onChange={(e) => updateField('fraudOfficerDecision', e.target.value)}
              >
                <option value=""></option>
                {t.decisionOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              <span>{t.indicatorDescription}</span>
              <textarea
                rows={5}
                value={form.indicatorDescription}
                onChange={(e) => updateField('indicatorDescription', e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {currentStep === 'fraudDetails' ? (
          <div className="form-grid">
            <label>
              <span>{t.claimType}</span>
              <input value={form.claimType} onChange={(e) => updateField('claimType', e.target.value)} />
            </label>
            <label>
              <span>{t.fraudConfirmedDate}</span>
              <input
                type="date"
                value={form.fraudConfirmedDate}
                onChange={(e) => updateField('fraudConfirmedDate', e.target.value)}
              />
            </label>
            <label>
              <span>{t.fraudDetectionMethod}</span>
              <input
                value={form.fraudDetectionMethod}
                onChange={(e) => updateField('fraudDetectionMethod', e.target.value)}
              />
            </label>
            <label>
              <span>{t.fraudAmount}</span>
              <input value={form.fraudAmount} onChange={(e) => updateField('fraudAmount', e.target.value)} />
            </label>
            <label>
              <span>{t.actionTaken}</span>
              <input value={form.actionTaken} onChange={(e) => updateField('actionTaken', e.target.value)} />
            </label>
            <label>
              <span>{t.referredEntity}</span>
              <input value={form.referredEntity} onChange={(e) => updateField('referredEntity', e.target.value)} />
            </label>
          </div>
        ) : null}

        {currentStep === 'workflow' ? (
          <div className="form-grid">
            <label>
              <span>{t.assignedUser}</span>
              <select
                value={form.assignedUser}
                onChange={(e) => updateField('assignedUser', e.target.value)}
              >
                <option value="">{t.unassigned}</option>
                {users
                  .filter((u) => u.role === 'Fraud Team Member')
                  .map((u) => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName}
                    </option>
                  ))}
              </select>
            </label>

            <label>
              <span>{t.caseStatus}</span>
              <select
                value={form.caseStatus}
                onChange={(e) => updateField('caseStatus', e.target.value)}
              >
                <option value=""></option>
                {t.statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <label>
              <span>{t.assignmentDate}</span>
              <input
                type="date"
                value={form.assignmentDate}
                onChange={(e) => updateField('assignmentDate', e.target.value)}
              />
            </label>

            <label>
              <span>{t.assignedBy}</span>
              <input
                value={form.assignedBy}
                onChange={(e) => updateField('assignedBy', e.target.value)}
                placeholder={t.assignedBy}
              />
            </label>

            <label>
              <span>{t.reassignmentReason}</span>
              <input
                value={form.reassignmentReason}
                onChange={(e) => updateField('reassignmentReason', e.target.value)}
                placeholder={t.reassignmentReason}
              />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              <span>{t.fraudUnitNotes}</span>
              <textarea
                rows={6}
                value={form.fraudUnitNotes}
                onChange={(e) => updateField('fraudUnitNotes', e.target.value)}
              />
            </label>
          </div>
        ) : null}

        {currentStep === 'attachments' ? (
          <div className="form-grid single">
            <div>
              <span>{t.attachmentsView}</span>

              <label
                style={{
                  display: 'block',
                  marginTop: 12,
                  border: '2px dashed rgba(15, 23, 42, 0.18)',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <input
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <strong>{t.attachmentsView}</strong>
                <div className="muted" style={{ marginTop: 8 }}>
                  {t.noSupportingFiles}
                </div>
              </label>

              <div className="activity-list top-gap">
                {attachments.length > 0 ? (
                  attachments.map((attachment) => (
                    <div className="activity-item" key={attachment.id ?? attachment.fileName}>
                      <div>
                        <strong>{attachment.fileName}</strong>
                        <span>{attachment.fileType}</span>
                      </div>
                      <button className="btn" type="button" onClick={() => removeAttachment(attachment.id)}>
                        {t.remove}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="activity-item">
                    <strong>{t.noAttachments}</strong>
                    <span>{t.noSupportingFiles}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {currentStep === 'history' ? (
          <Table title={t.assignmentHistory} headers={[t.historyAssignedTo, t.historyDate, t.historyNotes]}>
            {sourceItem.assignmentHistory.length > 0 ? (
              sourceItem.assignmentHistory.map((entry, index) => (
                <tr key={`${entry.changeDate}-${index}`}>
                  <td>{entry.newUser ?? t.unassigned}</td>
                  <td>{entry.changeDate}</td>
                  <td>{entry.changeReason}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="muted" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  {t.noHistory}
                </td>
              </tr>
            )}
          </Table>
        ) : null}

        <div className="actions-inline" style={{ gap: 12, marginTop: 24 }}>
          {currentStepIndex > 0 ? (
            <button className="btn" type="button" onClick={goBack}>
              {t.back}
            </button>
          ) : null}

          {currentStepIndex < stepOrder.length - 1 ? (
            <button className="btn primary" type="button" onClick={goNext}>
              {t.next}
            </button>
          ) : (
            <button className="btn primary" type="button" onClick={() => navigate('/app/queue')}>
              {t.saveChanges}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
