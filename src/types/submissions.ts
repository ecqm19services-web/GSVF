// Types pour les soumissions de formulaires

export type ContactStatus = 'new' | 'in_progress' | 'processed';
export type AdmissionStatus = 'new' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected' | 'waitlist';

export interface ContactSubmission {
  $id?: string;
  $createdAt?: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  processedAt?: string;
}

export interface AdmissionSubmission {
  $id?: string;
  $createdAt?: string;
  reference: string;
  studentFirstName: string;
  studentLastName: string;
  studentBirthdate: string;
  studentGender?: string;
  currentSchool?: string;
  desiredClass: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress?: string;
  relationship?: string;
  message?: string;
  status: AdmissionStatus;
  adminNotes?: string;
  publicNotes?: string;
  processedAt?: string;
  interviewDate?: string;
}

export interface StatusHistory {
  $id?: string;
  $createdAt?: string;
  submissionType: 'contact' | 'admission';
  submissionId: string;
  oldStatus?: string;
  newStatus: string;
  note?: string;
}

// Labels pour les statuts
export const contactStatusLabels: Record<ContactStatus, string> = {
  new: 'Nouveau',
  in_progress: 'En cours',
  processed: 'Traité'
};

export const admissionStatusLabels: Record<AdmissionStatus, string> = {
  new: 'Nouveau',
  under_review: 'En examen',
  interview_scheduled: 'Entretien programmé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  waitlist: 'Liste d\'attente'
};

// Couleurs pour les statuts
export const contactStatusColors: Record<ContactStatus, string> = {
  new: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800'
};

export const admissionStatusColors: Record<AdmissionStatus, string> = {
  new: 'bg-red-100 text-red-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  interview_scheduled: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-100 text-gray-800',
  waitlist: 'bg-orange-100 text-orange-800'
};
