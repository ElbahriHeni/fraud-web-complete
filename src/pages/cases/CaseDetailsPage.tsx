import { useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { fraudCases, users } from '../../data/mockData';
import type { AppLanguage } from '../../layout/AppLayout';

type PageCopy = {
  title: string;
  titleNew: string;
  subtitle: string;
  subtitleNew: string;
  claim: string;
  releaseAssignment: string;
  saveChanges: string;
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
  unassigned: string;
  notClosed: string;
  notAvailable: string;
  noAttachments: string;
  noSupportingFiles: string;
  noHistory: string;
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
    subtitle:
      'Review the case overview first, then update workflow, indicators, and confirmed fraud details.',
    subtitleNew: 'Create a new fraud case by entering all details below.',
    claim: 'Claim',
    releaseAssignment: 'Release Assignment',
    saveChanges: 'Save Changes',
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
    unassigned: 'Unassigned',
    notClosed: 'Not Closed',
    notAvailable: 'Not Available',
    noAttachments: 'No Attachments',
    noSupportingFiles: 'No supporting files submitted yet.',
    noHistory: 'No assignment history yet.',
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
    subtitle:
      'راجع نظرة عامة البلاغ أولًا، ثم حدّث سير العمل، والمؤشرات، وتفاصيل الاحتيال المؤكد.',
    subtitleNew: 'أنشئ بلاغ احتيال جديدًا من خلال إدخال جميع التفاصيل أدناه.',
    claim: 'استلام البلاغ',
    releaseAssignment: 'إلغاء التعيين',
    saveChanges: 'حفظ التغييرات',
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
    unassigned: 'غير معيّن',
    notClosed: 'غير مغلق',
    notAvailable: 'غير متوفر',
    noAttachments: 'لا توجد مرفقات',
    noSupportingFiles: 'لا توجد ملفات داعمة مرفقة حتى الآن.',
    noHistory: 'لا يوجد سجل تعيين حتى الآن.',
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

export default function CaseDetailsPage() {
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
    attachments: [],
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
    assignmentHistory: [],
    fraudIndicator: {
      fraudIndicatorType: '',
      indicatorDescription: '',
      occurrenceCount: 0,
      fraudOfficerDecision: '',
    },
  };

  const item = isNewCase
    ? emptyCase
    : fraudCases.find((entry) => entry.id === caseId) ?? fraudCases[0];

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader
        title={isNewCase ? t.titleNew : `${t.title} - ${item.id}`}
        subtitle={isNewCase ? t.subtitleNew : t.subtitle}
        action={
          <div className="actions-inline" style={{ gap: 12 }}>
            {!isNewCase ? <button className="btn">{t.claim}</button> : null}
            {!isNewCase ? <button className="btn">{t.releaseAssignment}</button> : null}
            <button className="btn primary">{t.saveChanges}</button>
          </div>
        }
      />

      <section className="case-overview-grid">
        <div className="card case-overview-card">
          <span className="eyebrow">{t.overview}</span>

          <div className="case-overview-top">
            <div>
              {isNewCase ? (
                <div className="form-grid single">
                  <label>
                    <span>{t.caseId}</span>
                    <input defaultValue={item.id ?? ''} placeholder={t.caseId} />
                  </label>
                  <label>
                    <span>{t.claimId}</span>
                    <input defaultValue={item.claimId ?? ''} placeholder={t.claimId} />
                  </label>
                  <label>
                    <span>{t.caseSource}</span>
                    <input defaultValue={item.caseSource ?? ''} placeholder={t.caseSource} />
                  </label>
                </div>
              ) : (
                <>
                  <h3>{item.id}</h3>
                  <p className="muted">
                    {item.claimId} - {item.caseSource}
                  </p>
                </>
              )}
            </div>

            {!isNewCase ? (
              <div className="actions-inline">
                <span className={`badge ${String(item.priorityLevel).toLowerCase()}`}>{item.priorityLevel}</span>
                <span className="case-status-pill">{item.caseStatus}</span>
              </div>
            ) : null}
          </div>

          <div className="case-metric-grid">
            <div className="case-metric">
              <span className="muted small">{t.caseType}</span>
              {isNewCase ? (
                <input defaultValue={item.caseType ?? ''} placeholder={t.caseType} />
              ) : (
                <strong>{item.caseType}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.insuranceType}</span>
              {isNewCase ? (
                <input defaultValue={item.insuranceType ?? ''} placeholder={t.insuranceType} />
              ) : (
                <strong>{item.insuranceType}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.suspectedAmount}</span>
              {isNewCase ? (
                <input defaultValue={item.suspectedAmount ?? ''} placeholder={t.suspectedAmount} />
              ) : (
                <strong>{item.suspectedAmount}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.entryDate}</span>
              {isNewCase ? (
                <input type="date" defaultValue={item.caseEntryDate ?? ''} />
              ) : (
                <strong>{item.caseEntryDate}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.assignedUser}</span>
              {isNewCase ? (
                <select defaultValue={item.assignedUser ?? ''}>
                  <option value="">{t.unassigned}</option>
                  {users
                    .filter((u) => u.role === 'Fraud Team Member')
                    .map((u) => (
                      <option key={u.id}>{u.fullName}</option>
                    ))}
                </select>
              ) : (
                <strong>{item.assignedUser ?? t.unassigned}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.closureDate}</span>
              {isNewCase ? (
                <input type="date" defaultValue={item.closureDate ?? ''} />
              ) : (
                <strong>{item.closureDate || t.notClosed}</strong>
              )}
            </div>
            <div className="case-metric">
              <span className="muted small">{t.closureReason}</span>
              {isNewCase ? (
                <input defaultValue={item.closureReason ?? ''} placeholder={t.closureReason} />
              ) : (
                <strong>{item.closureReason || t.notAvailable}</strong>
              )}
            </div>
          </div>

          <div className="form-grid single top-gap">
            <label>
              <span>{t.description}</span>
              <textarea defaultValue={item.submissionDetails ?? ''} rows={5} />
            </label>

            <div>
              <span>{t.attachmentsView}</span>
              <div className="activity-list top-gap">
                {item.attachments.length > 0 ? (
                  item.attachments.map((attachment: any) => (
                    <div className="activity-item" key={attachment.id}>
                      <strong>{attachment.fileName}</strong>
                      <span>{attachment.fileType}</span>
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
        </div>

        <div className="card case-contact-card compact-reporter-card">
          <span className="eyebrow">{t.reporter}</span>
          {isNewCase ? (
            <div className="form-grid single">
              <label>
                <span>{t.reporter}</span>
                <input defaultValue={item.reporterName ?? ''} placeholder={t.reporter} />
              </label>
              <label>
                <span>{t.email}</span>
                <input defaultValue={item.reporterEmail ?? ''} placeholder={t.email} />
              </label>
              <label>
                <span>{t.mobileNumber}</span>
                <input defaultValue={item.reporterMobile ?? ''} placeholder={t.mobileNumber} />
              </label>
              <label>
                <span>{t.nationalId}</span>
                <input defaultValue={item.nationalIdOrIqama ?? ''} placeholder={t.nationalId} />
              </label>
            </div>
          ) : (
            <>
              <h3>{item.reporterName}</h3>

              <div className="case-contact-list compact">
                <div>
                  <span className="muted small">{t.email}</span>
                  <strong>{item.reporterEmail}</strong>
                </div>
                <div>
                  <span className="muted small">{t.mobileNumber}</span>
                  <strong>{item.reporterMobile}</strong>
                </div>
                <div>
                  <span className="muted small">{t.nationalId}</span>
                  <strong>{item.nationalIdOrIqama}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="case-main-grid">
        <div className="case-main-column">
          <div className="card">
            <span className="eyebrow">{t.workflow}</span>
            <h3>{t.assignmentStatus}</h3>

            <div className="form-grid single">
              <label>
                <span>{t.assignedUser}</span>
                <select defaultValue={item.assignedUser ?? ''}>
                  <option value="">{t.unassigned}</option>
                  {users
                    .filter((u) => u.role === 'Fraud Team Member')
                    .map((u) => (
                      <option key={u.id}>{u.fullName}</option>
                    ))}
                </select>
              </label>

              <label>
                <span>{t.caseStatus}</span>
                <select defaultValue={item.caseStatus ?? ''}>
                  {t.statusOptions.map((status: string) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>

              <div className="two-col-form form-grid">
                <label>
                  <span>{t.assignmentDate}</span>
                  <input defaultValue={item.assignmentDate ?? ''} placeholder={t.assignmentDate} />
                </label>
                <label>
                  <span>{t.assignedBy}</span>
                  <input defaultValue={item.assignedBy ?? ''} placeholder={t.assignedBy} />
                </label>
              </div>

              <label>
                <span>{t.reassignmentReason}</span>
                <input defaultValue={item.reassignmentReason ?? ''} placeholder={t.reassignmentReason} />
              </label>

              <label>
                <span>{t.fraudUnitNotes}</span>
                <textarea defaultValue={item.fraudUnitNotes ?? ''} rows={6} />
              </label>

              <div className="actions-inline">
                <button className="btn primary">{t.saveChanges}</button>
              </div>
            </div>
          </div>

          <div className="card">
            <span className="eyebrow">{t.indicators}</span>
            <h3>{t.fraudIndicators}</h3>

            <div className="form-grid single">
              <label>
                <span>{t.fraudIndicatorType}</span>
                <select defaultValue={item.fraudIndicator.fraudIndicatorType ?? ''}>
                  <option value=""></option>
                  {t.indicatorTypeOptions.map((option: string) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>{t.indicatorDescription}</span>
                <textarea rows={4} defaultValue={item.fraudIndicator.indicatorDescription ?? ''} />
              </label>

              <label>
                <span>{t.occurrenceCount}</span>
                <input defaultValue={String(item.fraudIndicator.occurrenceCount ?? '')} />
              </label>

              <label>
                <span>{t.fraudOfficerDecision}</span>
                <select defaultValue={item.fraudIndicator.fraudOfficerDecision ?? ''}>
                  <option value=""></option>
                  {t.decisionOptions.map((option: string) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="case-side-column">
          <div className="card">
            <span className="eyebrow">{t.confirmedFraud}</span>
            <h3>{t.fraudDetails}</h3>

            <div className="form-grid single">
              <label>
                <span>{t.claimType}</span>
                <input defaultValue={item.claimType ?? ''} />
              </label>
              <label>
                <span>{t.fraudConfirmedDate}</span>
                <input type="date" defaultValue={item.fraudConfirmedDate ?? ''} />
              </label>
              <label>
                <span>{t.fraudDetectionMethod}</span>
                <input defaultValue={item.fraudDetectionMethod ?? ''} />
              </label>
              <label>
                <span>{t.fraudAmount}</span>
                <input defaultValue={item.fraudAmount ?? ''} />
              </label>
              <label>
                <span>{t.actionTaken}</span>
                <input defaultValue={item.actionTaken ?? ''} />
              </label>
              <label>
                <span>{t.referredEntity}</span>
                <input defaultValue={item.referredEntity ?? ''} />
              </label>
            </div>
          </div>

          <Table title={t.assignmentHistory} headers={[t.historyAssignedTo, t.historyDate, t.historyNotes]}>
            {item.assignmentHistory.length > 0 ? (
              item.assignmentHistory.map((entry: any, index: number) => (
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
        </div>
      </section>
    </div>
  );
}
