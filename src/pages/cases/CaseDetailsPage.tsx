import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { users } from '../../data/mockData';
import { apiGet, apiPatch, apiPost } from '../../api';
import type { AppLanguage } from '../../layout/AppLayout';

type WizardStep =
  | 'reporter'
  | 'overview'
  | 'indicators'
  | 'fraudDetails'
  | 'workflow'
  | 'attachments'
  | 'history';


type BackendFraudCase = {
  id: number;
  case_number: string;
  claim_id: string | null;
  case_type: string | null;
  case_source: string | null;
  priority_level: string | null;
  case_status: string | null;
  assigned_user: string | null;
  assignment_date: string | null;
  assigned_by: string | null;
  reassignment_reason: string | null;
  case_entry_date: string | null;
  closure_date: string | null;
  closure_reason: string | null;
  insurance_type: string | null;
  suspected_amount: string | null;
  fraud_unit_notes: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_mobile: string | null;
  national_id_or_iqama: string | null;
  description: string | null;
  fraud_indicator_type: string | null;
  indicator_description: string | null;
  occurrence_count: number | null;
  fraud_officer_decision: string | null;
  claim_type: string | null;
  fraud_confirmed_date: string | null;
  fraud_detection_method: string | null;
  fraud_amount: string | null;
  action_taken: string | null;
  referred_entity: string | null;
};

type BackendAssignmentHistoryEntry = {
  id: number;
  previous_user: string | null;
  new_user: string | null;
  changed_by: string | null;
  change_reason: string | null;
  change_date: string | null;
};

type BackendDocument = {
  id: number;
  file_name: string;
  file_type: string | null;
  file_url: string | null;
  category: string | null;
  uploaded_by: string | null;
  uploaded_at: string | null;
};

type CaseForm = {
  id: string;
  claimId: string;
  caseSource: string;
  priorityLevel: string;
  caseStatus: string;
  caseType: string;
  insuranceType: string;
  suspectedAmount: string;
  caseEntryDate: string;
  assignedUser: string;
  closureDate: string;
  closureReason: string;
  submissionDetails: string;
  reporterName: string;
  reporterEmail: string;
  reporterMobile: string;
  nationalIdOrIqama: string;
  assignmentDate: string;
  assignedBy: string;
  reassignmentReason: string;
  fraudUnitNotes: string;
  claimType: string;
  fraudConfirmedDate: string;
  fraudDetectionMethod: string;
  fraudAmount: string;
  actionTaken: string;
  referredEntity: string;
  fraudIndicatorType: string;
  indicatorDescription: string;
  occurrenceCount: string;
  fraudOfficerDecision: string;
};

type AssignmentHistoryEntry = {
  id?: string;
  previousUser?: string;
  newUser?: string;
  changedBy?: string;
  changeDate: string;
  changeReason: string;
};

type AttachmentItem = {
  id?: string;
  fileName: string;
  fileType: string;
  fileUrl?: string;
  category?: string;
};

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

  const emptyForm: CaseForm = {
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
    fraudIndicatorType: '',
    indicatorDescription: '',
    occurrenceCount: '',
    fraudOfficerDecision: '',
  };

  const toInputDate = (value: string | null | undefined) => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value.includes('T') ? value.split('T')[0] : value;
    }

    return date.toISOString().slice(0, 10);
  };

  const mapBackendCaseToForm = (item: BackendFraudCase): CaseForm => ({
    id: item.case_number ?? '',
    claimId: item.claim_id ?? '',
    caseSource: item.case_source ?? '',
    priorityLevel: item.priority_level ?? '',
    caseStatus: item.case_status ?? '',
    caseType: item.case_type ?? '',
    insuranceType: item.insurance_type ?? '',
    suspectedAmount: item.suspected_amount ?? '',
    caseEntryDate: toInputDate(item.case_entry_date),
    assignedUser: item.assigned_user ?? '',
    closureDate: toInputDate(item.closure_date),
    closureReason: item.closure_reason ?? '',
    submissionDetails: item.description ?? '',
    reporterName: item.reporter_name ?? '',
    reporterEmail: item.reporter_email ?? '',
    reporterMobile: item.reporter_mobile ?? '',
    nationalIdOrIqama: item.national_id_or_iqama ?? '',
    assignmentDate: toInputDate(item.assignment_date),
    assignedBy: item.assigned_by ?? '',
    reassignmentReason: item.reassignment_reason ?? '',
    fraudUnitNotes: item.fraud_unit_notes ?? '',
    claimType: item.claim_type ?? '',
    fraudConfirmedDate: toInputDate(item.fraud_confirmed_date),
    fraudDetectionMethod: item.fraud_detection_method ?? '',
    fraudAmount: item.fraud_amount ?? '',
    actionTaken: item.action_taken ?? '',
    referredEntity: item.referred_entity ?? '',
    fraudIndicatorType: item.fraud_indicator_type ?? '',
    indicatorDescription: item.indicator_description ?? '',
    occurrenceCount: String(item.occurrence_count ?? ''),
    fraudOfficerDecision: item.fraud_officer_decision ?? '',
  });


  const mapBackendHistoryToRows = (items: BackendAssignmentHistoryEntry[]): AssignmentHistoryEntry[] =>
    items.map((item) => ({
      id: String(item.id),
      previousUser: item.previous_user ?? undefined,
      newUser: item.new_user ?? undefined,
      changedBy: item.changed_by ?? undefined,
      changeDate: item.change_date ? new Date(item.change_date).toLocaleString() : '',
      changeReason: item.change_reason ?? '',
    }));

  const mapBackendDocumentsToAttachments = (items: BackendDocument[]): AttachmentItem[] =>
    items.map((item) => ({
      id: String(item.id),
      fileName: item.file_name,
      fileType: item.file_type ?? 'file',
      fileUrl: item.file_url ?? undefined,
      category: item.category ?? undefined,
    }));

  const [currentStep, setCurrentStep] = useState<WizardStep>('reporter');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [assignmentHistory, setAssignmentHistory] = useState<AssignmentHistoryEntry[]>([]);
  const [form, setForm] = useState<CaseForm>(emptyForm);
  const [isLoadingCase, setIsLoadingCase] = useState(!isNewCase);
  const [isSavingCase, setIsSavingCase] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasLoadedDocuments, setHasLoadedDocuments] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [caseError, setCaseError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (isNewCase) {
      setForm(emptyForm);
      setAttachments([]);
      setAssignmentHistory([]);
      setHasLoadedDocuments(false);
      setHasLoadedHistory(false);
      setIsLoadingDocuments(false);
      setIsLoadingHistory(false);
      setIsLoadingCase(false);
      setCaseError('');
      setSaveMessage('');
      return;
    }

    let isMounted = true;

    async function loadCaseDetails() {
      try {
        setIsLoadingCase(true);
        setCaseError('');
        setSaveMessage('');
        setHasLoadedDocuments(false);
        setHasLoadedHistory(false);
        setAttachments([]);
        setAssignmentHistory([]);

        // Load only the main case at first. Documents and history are loaded lazily
        // when the user opens those wizard steps, so tab switching stays fast.
        const caseData = await apiGet<BackendFraudCase>(`/api/cases/${caseId}`);

        if (!isMounted) return;

        setForm(mapBackendCaseToForm(caseData));
      } catch (error) {
        if (isMounted) {
          setCaseError('Could not load case details from backend.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingCase(false);
        }
      }
    }

    loadCaseDetails();

    return () => {
      isMounted = false;
    };
  }, [caseId, isNewCase]);

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

  const backendStatusOptions = [
    'New',
    'Under Review',
    'Under Investigation',
    'Pending Information',
    'Fraud Confirmed',
    'Rejected',
    'Closed',
  ];

  const getStatusLabel = (status: string) => {
    const statusIndex = backendStatusOptions.indexOf(status);

    if (language === 'ar' && statusIndex >= 0) {
      return t.statusOptions[statusIndex] ?? status;
    }

    return status;
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaveMessage('');
  };

  const updateFormFromBackend = (updatedCase: BackendFraudCase) => {
    setForm(mapBackendCaseToForm(updatedCase));
  };

  const reloadAssignmentHistory = async () => {
    if (isNewCase || !caseId) return;

    try {
      setIsLoadingHistory(true);
      const historyData = await apiGet<BackendAssignmentHistoryEntry[]>(`/api/cases/${caseId}/assignment-history`);
      setAssignmentHistory(mapBackendHistoryToRows(historyData));
      setHasLoadedHistory(true);
    } catch (error) {
      setAssignmentHistory([]);
      setCaseError((current) => current || 'Assignment history could not be refreshed.');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const reloadDocuments = async () => {
    if (isNewCase || !caseId) return;

    try {
      setIsLoadingDocuments(true);
      const documentsData = await apiGet<BackendDocument[]>(`/api/cases/${caseId}/documents`);
      setAttachments(mapBackendDocumentsToAttachments(documentsData));
      setHasLoadedDocuments(true);
    } catch (error) {
      setAttachments([]);
      setCaseError((current) => current || 'Documents could not be refreshed.');
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  useEffect(() => {
    if (currentStep === 'history' && !hasLoadedHistory && !isLoadingHistory) {
      reloadAssignmentHistory();
    }

    if (currentStep === 'attachments' && !hasLoadedDocuments && !isLoadingDocuments) {
      reloadDocuments();
    }
  }, [currentStep, hasLoadedDocuments, hasLoadedHistory, isLoadingDocuments, isLoadingHistory]);

  const saveCurrentStep = async () => {
    if (isNewCase || !caseId) return;

    try {
      setIsSavingCase(true);
      setCaseError('');
      setSaveMessage('');

      if (currentStep === 'reporter') {
        const updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/reporter`, {
          reporter_name: form.reporterName,
          reporter_email: form.reporterEmail,
          reporter_mobile: form.reporterMobile,
          national_id_or_iqama: form.nationalIdOrIqama,
        });
        updateFormFromBackend(updatedCase);
      }

      if (currentStep === 'overview') {
        const updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/overview`, {
          claim_id: form.claimId,
          case_type: form.caseType,
          case_source: form.caseSource,
          insurance_type: form.insuranceType,
          priority_level: form.priorityLevel,
          suspected_amount: form.suspectedAmount || 0,
          description: form.submissionDetails,
          fraud_unit_notes: form.fraudUnitNotes,
        });
        updateFormFromBackend(updatedCase);
      }

      if (currentStep === 'indicators') {
        const updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/indicators`, {
          fraud_indicator_type: form.fraudIndicatorType,
          indicator_description: form.indicatorDescription,
          occurrence_count: Number(form.occurrenceCount || 0),
          fraud_officer_decision: form.fraudOfficerDecision,
        });
        updateFormFromBackend(updatedCase);
      }

      if (currentStep === 'fraudDetails') {
        const updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/confirmed-fraud`, {
          claim_type: form.claimType,
          fraud_confirmed_date: form.fraudConfirmedDate || null,
          fraud_detection_method: form.fraudDetectionMethod,
          fraud_amount: form.fraudAmount || 0,
          action_taken: form.actionTaken,
          referred_entity: form.referredEntity,
        });
        updateFormFromBackend(updatedCase);
      }

      if (currentStep === 'workflow') {
        let updatedCase: BackendFraudCase | null = null;

        if (form.caseStatus) {
          updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/status`, {
            case_status: form.caseStatus,
            closure_reason: form.closureReason,
            closure_date: form.closureDate || null,
          });
        }

        if (form.assignedUser) {
          updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/assign`, {
            assigned_user: form.assignedUser,
            assigned_by: form.assignedBy || 'Admin',
            change_reason: form.reassignmentReason || 'Case assigned from case details',
          });
          await reloadAssignmentHistory();
        }

        if (updatedCase) {
          updateFormFromBackend(updatedCase);
        }
      }

      if (currentStep === 'attachments') {
        await reloadDocuments();
      }

      setSaveMessage('Saved successfully.');
    } catch (error) {
      setCaseError('Could not save changes to backend.');
    } finally {
      setIsSavingCase(false);
    }
  };

  const handleReleaseAssignment = async () => {
    if (isNewCase || !caseId) return;

    try {
      setIsSavingCase(true);
      setCaseError('');
      setSaveMessage('');

      const updatedCase = await apiPatch<BackendFraudCase>(`/api/cases/${caseId}/release-assignment`, {
        released_by: form.assignedBy || 'Admin',
        change_reason: form.reassignmentReason || 'Assignment released from case details',
      });

      updateFormFromBackend(updatedCase);
      await reloadAssignmentHistory();
      setSaveMessage('Assignment released successfully.');
    } catch (error) {
      setCaseError('Could not release assignment.');
    } finally {
      setIsSavingCase(false);
    }
  };

  const goNext = () => {
    // Move between wizard steps instantly. Saving is done only when the user clicks Save Changes.
    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentStepIndex + 1]);
      setSaveMessage('');
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepOrder[currentStepIndex - 1]);
    }
  };

  const handleFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    if (isNewCase || !caseId) {
      const mapped = Array.from(incomingFiles).map((file, index) => ({
        id: `${file.name}-${index}-${Date.now()}`,
        fileName: file.name,
        fileType: file.type || 'file',
      }));
      setAttachments((current) => [...current, ...mapped]);
      return;
    }

    try {
      setIsSavingCase(true);
      setCaseError('');
      setSaveMessage('');

      for (const file of Array.from(incomingFiles)) {
        await apiPost<BackendDocument>(`/api/cases/${caseId}/documents`, {
          file_name: file.name,
          file_type: file.type || 'file',
          file_url: '',
          category: 'supporting_document',
          uploaded_by: form.assignedBy || 'Admin',
        });
      }

      await reloadDocuments();
      setSaveMessage('Document metadata saved successfully.');
    } catch (error) {
      setCaseError('Could not save document metadata.');
    } finally {
      setIsSavingCase(false);
    }
  };

  const removeAttachment = (idToRemove?: string) => {
    setAttachments((current) => current.filter((item) => item.id !== idToRemove));
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        title={isNewCase ? t.titleNew : `${t.title} - ${form.id || caseId}`}
        subtitle={isNewCase ? t.subtitleNew : t.subtitle}
        action={
          <div className="actions-inline" style={{ gap: 12 }}>
            {!isNewCase ? <button className="btn" type="button">{t.claim}</button> : null}
            {!isNewCase ? <button className="btn" type="button" onClick={handleReleaseAssignment} disabled={isSavingCase}>{t.releaseAssignment}</button> : null}
            {!isNewCase ? (
              <button className="btn primary" type="button" onClick={saveCurrentStep} disabled={isSavingCase}>
                {isSavingCase ? 'Saving...' : t.saveChanges}
              </button>
            ) : null}
          </div>
        }
      />

      {isLoadingCase ? (
        <div className="card" style={{ marginBottom: 16 }}>
          Loading case details from backend...
        </div>
      ) : null}

      {caseError ? (
        <div className="card" style={{ marginBottom: 16, color: '#b42318' }}>
          {caseError}
        </div>
      ) : null}

      {saveMessage ? (
        <div className="card" style={{ marginBottom: 16, color: '#0d6c68' }}>
          {saveMessage}
        </div>
      ) : null}

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
                {backendStatusOptions.map((status) => (
                  <option key={status} value={status}>{getStatusLabel(status)}</option>
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

              {isLoadingDocuments ? (
                <div className="card" style={{ marginTop: 16, marginBottom: 16 }}>
                  Loading documents...
                </div>
              ) : null}

              <div className="activity-list top-gap">
                {attachments.length > 0 ? (
                  attachments.map((attachment) => (
                    <div className="activity-item" key={attachment.id ?? attachment.fileName}>
                      <div>
                        <strong>{attachment.fileName}</strong>
                        <span>{attachment.category ? `${attachment.fileType} · ${attachment.category}` : attachment.fileType}</span>
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
            {isLoadingHistory ? (
              <tr>
                <td colSpan={3} className="muted" style={{ textAlign: 'center', padding: '24px 16px' }}>
                  Loading assignment history...
                </td>
              </tr>
            ) : assignmentHistory.length > 0 ? (
              assignmentHistory.map((entry, index) => (
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
            <button className="btn primary" type="button" onClick={saveCurrentStep} disabled={isSavingCase}>
              {isSavingCase ? 'Saving...' : t.saveChanges}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
