import { Client, Account, Databases, ID, Query } from 'appwrite';

// Configuration Appwrite - À personnaliser avec vos valeurs
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

// IDs des collections
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'school_db';
export const COLLECTIONS = {
  CONTACTS: 'contact_submissions',
  ADMISSIONS: 'admission_submissions',
  STATUS_HISTORY: 'status_history',
  ADMIN_SESSIONS: 'admin_sessions'
};

// Initialisation du client Appwrite
const client = new Client();

if (APPWRITE_ENDPOINT && APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

// Services Appwrite
export const account = new Account(client);
export const databases = new Databases(client);

// Utilitaires
export { ID, Query };
export default client;

// Fonction pour générer une référence unique
export const generateReference = (type: 'CONT' | 'ADM'): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${type}-${year}-${random}`;
};

// Types pour les soumissions
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
  status: 'new' | 'in_progress' | 'processed';
  adminNotes?: string;
  processedAt?: string;
}

export interface AdmissionSubmission {
  $id?: string;
  $createdAt?: string;
  reference: string;
  // Élève
  studentFirstName: string;
  studentLastName: string;
  studentBirthdate: string;
  studentGender?: string;
  currentSchool?: string;
  desiredClass: string;
  // Parent
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentAddress?: string;
  relationship?: string;
  // Autres
  message?: string;
  status: 'new' | 'under_review' | 'interview_scheduled' | 'approved' | 'rejected' | 'waitlist';
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

// Fonctions CRUD pour les contacts
export const contactsService = {
  async create(data: Omit<ContactSubmission, '$id' | '$createdAt' | 'reference' | 'status'>) {
    const reference = generateReference('CONT');
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CONTACTS,
      ID.unique(),
      {
        ...data,
        reference,
        status: 'new'
      }
    );
  },

  async getAll() {
    return databases.listDocuments(DATABASE_ID, COLLECTIONS.CONTACTS, [
      Query.orderDesc('$createdAt')
    ]);
  },

  async getByReference(reference: string) {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CONTACTS, [
      Query.equal('reference', reference)
    ]);
    return result.documents[0] || null;
  },

  async updateStatus(id: string, status: ContactSubmission['status'], adminNotes?: string) {
    return databases.updateDocument(DATABASE_ID, COLLECTIONS.CONTACTS, id, {
      status,
      adminNotes,
      processedAt: status === 'processed' ? new Date().toISOString() : undefined
    });
  }
};

// Fonctions CRUD pour les admissions
export const admissionsService = {
  async create(data: Omit<AdmissionSubmission, '$id' | '$createdAt' | 'reference' | 'status'>) {
    const reference = generateReference('ADM');
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ADMISSIONS,
      ID.unique(),
      {
        ...data,
        reference,
        status: 'new'
      }
    );
  },

  async getAll() {
    return databases.listDocuments(DATABASE_ID, COLLECTIONS.ADMISSIONS, [
      Query.orderDesc('$createdAt')
    ]);
  },

  async getByReference(reference: string) {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADMISSIONS, [
      Query.equal('reference', reference)
    ]);
    return result.documents[0] || null;
  },

  async updateStatus(
    id: string, 
    status: AdmissionSubmission['status'], 
    adminNotes?: string,
    publicNotes?: string
  ) {
    return databases.updateDocument(DATABASE_ID, COLLECTIONS.ADMISSIONS, id, {
      status,
      adminNotes,
      publicNotes,
      processedAt: ['approved', 'rejected'].includes(status) ? new Date().toISOString() : undefined
    });
  }
};

// Fonctions pour l'historique des statuts
export const statusHistoryService = {
  async create(data: Omit<StatusHistory, '$id' | '$createdAt'>) {
    return databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STATUS_HISTORY,
      ID.unique(),
      data
    );
  },

  async getBySubmission(submissionType: 'contact' | 'admission', submissionId: string) {
    return databases.listDocuments(DATABASE_ID, COLLECTIONS.STATUS_HISTORY, [
      Query.equal('submissionType', submissionType),
      Query.equal('submissionId', submissionId),
      Query.orderAsc('$createdAt')
    ]);
  }
};

// Fonction pour rechercher une soumission par référence (contact ou admission)
export const findSubmissionByReference = async (reference: string): Promise<{
  type: 'contact' | 'admission';
  submission: ContactSubmission | AdmissionSubmission;
  history: StatusHistory[];
} | null> => {
  if (reference.startsWith('CONT-')) {
    const submission = await contactsService.getByReference(reference);
    if (submission) {
      const history = await statusHistoryService.getBySubmission('contact', submission.$id!);
      return { 
        type: 'contact', 
        submission: submission as unknown as ContactSubmission, 
        history: history.documents as unknown as StatusHistory[] 
      };
    }
  } else if (reference.startsWith('ADM-')) {
    const submission = await admissionsService.getByReference(reference);
    if (submission) {
      const history = await statusHistoryService.getBySubmission('admission', submission.$id!);
      return { 
        type: 'admission', 
        submission: submission as unknown as AdmissionSubmission, 
        history: history.documents as unknown as StatusHistory[] 
      };
    }
  }
  return null;
};
