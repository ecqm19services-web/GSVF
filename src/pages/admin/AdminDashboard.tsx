import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GraduationCap, 
  FileText,
  Monitor,
  BriefcaseBusiness,
  LogOut, 
  ShieldAlert,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  X,
  Users,
  UserPlus,
  ShieldOff,
  Shield,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Image,
  Database,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchAdminAdmissions, fetchAdminContacts, adminUpdateStatus, adminDeleteSubmission } from '@/lib/adminApi';
import {
  createAdminBackup,
  downloadAdminBackup,
  listAdminBackups,
  restoreAdminBackup,
  type BackupItem,
  type RestoreMode,
} from '@/lib/adminBackupApi';
import { 
  contactStatusLabels, 
  admissionStatusLabels,
  contactStatusColors,
  admissionStatusColors,
  type ContactSubmission,
  type AdmissionSubmission,
  type ContactStatus,
  type AdmissionStatus
} from '@/types/submissions';
import {
  fetchOperators,
  createOperator,
  toggleOperator,
  resetOperatorPassword,
  clearOperatorLockout,
  type Operator,
} from '@/lib/adminOperatorsApi';

type TabType = 'contacts' | 'admissions' | 'operators' | 'documentation';
type ContactFilterStatus = ContactStatus | 'all';
type AdmissionFilterStatus = AdmissionStatus | 'all';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('admissions');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionSubmission[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactFilterStatus | AdmissionFilterStatus>('all');
  const [opActionMessage, setOpActionMessage] = useState<string>('');
  const [opTempPassword, setOpTempPassword] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | AdmissionSubmission | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupError, setBackupError] = useState('');
  const [lastBackupInfo, setLastBackupInfo] = useState<{
    fileName: string;
    savedPath: string;
    createdAt: string;
  } | null>(null);
  const [backupItems, setBackupItems] = useState<BackupItem[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMode, setRestoreMode] = useState<RestoreMode>('A');
  const [restoreFileName, setRestoreFileName] = useState('');
  const [restoreConfirmation, setRestoreConfirmation] = useState('');
  const [developerCode, setDeveloperCode] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState('');
  const [isRestorePanelOpen, setIsRestorePanelOpen] = useState(false);
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [backupSuccess, setBackupSuccess] = useState('');

  const OP_PASSPHRASE = 'op01-op02-op03-op04-op05-op06-op07-op08-op09-op10';
  const [opConfirmModal, setOpConfirmModal] = useState<{
    open: boolean;
    label: string;
    onConfirmed: (phrase: string) => void;
  }>({ open: false, label: '', onConfirmed: () => {} });
  const [opConfirmInput, setOpConfirmInput] = useState('');
  const [opConfirmError, setOpConfirmError] = useState('');

  const requireOpPassphrase = (label: string, onConfirmed: (phrase: string) => void) => {
    setOpConfirmInput('');
    setOpConfirmError('');
    setOpConfirmModal({ open: true, label, onConfirmed });
  };

  const submitOpPassphrase = () => {
    if (opConfirmInput !== OP_PASSPHRASE) {
      setOpConfirmError('Phrase de confirmation incorrecte. Veuillez réessayer.');
      return;
    }
    const fn = opConfirmModal.onConfirmed;
    setOpConfirmModal({ open: false, label: '', onConfirmed: () => {} });
    setOpConfirmInput('');
    setOpConfirmError('');
    fn(opConfirmInput);
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadBackups();
      loadOperators();
    }
  }, [isAuthenticated, token]);

  const loadBackups = async () => {
    if (!token) return;

    setIsLoadingBackups(true);
    try {
      const res = await listAdminBackups(token);
      setBackupItems(res.backups);
      if (!restoreFileName && res.backups.length > 0) {
        setRestoreFileName(res.backups[0].fileName);
      }
    } catch (error) {
      console.error('Erreur chargement sauvegardes:', error);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const loadOperators = async () => {
    if (!token) return;
    setIsLoadingOperators(true);
    setOpActionMessage('');
    setOpTempPassword('');
    try {
      const res = await fetchOperators(token);
      setOperators(res.operators);
    } catch (error) {
      console.error('Erreur chargement opérateurs:', error);
    } finally {
      setIsLoadingOperators(false);
    }
  };

  const handleCreateOperator = () => {
    requireOpPassphrase('Créer un nouvel opérateur', async (phrase) => {
      if (!token) return;
      setOpActionMessage('');
      setOpTempPassword('');
      try {
        const res = await createOperator(token, phrase);
        setOperators((prev) => [...prev, res.operator]);
        setOpTempPassword(res.tempPassword);
        setOpActionMessage(`Opérateur ${res.operator.id} créé. Mot de passe temporaire prêt.`);
      } catch (error) {
        alert((error as Error).message || 'Création impossible');
      }
    });
  };

  const handleToggleOperator = (id: string) => {
    const op = operators.find((o) => o.id === id);
    const action = op?.active ? 'Désactiver' : 'Activer';
    requireOpPassphrase(`${action} l'opérateur ${id}`, async (phrase) => {
      if (!token) return;
      setOpActionMessage('');
      setOpTempPassword('');
      try {
        const res = await toggleOperator(token, id, phrase);
        setOperators((prev) => prev.map((o) => (o.id === id ? res.operator : o)));
        setOpActionMessage(res.operator.active ? 'Opérateur activé.' : 'Opérateur désactivé.');
      } catch (error) {
        alert((error as Error).message || 'Mise à jour impossible');
      }
    });
  };

  const handleResetOperatorPassword = (id: string) => {
    requireOpPassphrase(`Réinitialiser le mot de passe de ${id}`, async (phrase) => {
      if (!token) return;
      setOpActionMessage('');
      setOpTempPassword('');
      try {
        const res = await resetOperatorPassword(token, id, phrase);
        setOperators((prev) => prev.map((op) => (op.id === id ? res.operator : op)));
        setOpTempPassword(res.tempPassword);
        setOpActionMessage(`Mot de passe réinitialisé pour ${id}.`);
      } catch (error) {
        alert((error as Error).message || 'Reset impossible');
      }
    });
  };

  const handleClearLockout = (id: string) => {
    requireOpPassphrase(`Débloquer l'opérateur ${id}`, async (phrase) => {
      if (!token) return;
      setOpActionMessage('');
      setOpTempPassword('');
      try {
        await clearOperatorLockout(token, id, phrase);
        setOpActionMessage(`Blocage effacé pour ${id}.`);
      } catch (error) {
        alert((error as Error).message || 'Impossible de débloquer');
      }
    });
  };

  const handleDeleteSubmission = async (type: 'contact' | 'admission', id: string, reference: string) => {
    if (!token || !id) {
      return;
    }

    const confirmed = window.confirm(
      `Supprimer définitivement ${type === 'contact' ? 'ce contact' : 'cette admission'} (${reference}) ? Cette action est irreversible.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingItemId(id);
    try {
      await adminDeleteSubmission(token, { type, id });
      await loadData();

      if (selectedItem?.reference === id) {
        setShowDetail(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Erreur suppression soumission:', error);
      alert('Suppression impossible pour le moment. Veuillez reessayer.');
    } finally {
      setDeletingItemId(null);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        return;
      }

      const [contactsRes, admissionsRes] = await Promise.all([
        fetchAdminContacts(token),
        fetchAdminAdmissions(token),
      ]);
      setContacts(contactsRes.documents as ContactSubmission[]);
      setAdmissions(admissionsRes.documents as AdmissionSubmission[]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (type: 'contact' | 'admission', status: string) => {
    const colors = type === 'contact' 
      ? contactStatusColors[status as ContactStatus] 
      : admissionStatusColors[status as AdmissionStatus];
    const label = type === 'contact'
      ? contactStatusLabels[status as ContactStatus]
      : admissionStatusLabels[status as AdmissionStatus];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors || 'bg-gray-100 text-gray-800'}`}>
        {label || status}
      </span>
    );
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAdmissions = admissions.filter(a => {
    const matchesSearch = searchQuery === '' || 
      a.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${a.studentFirstName} ${a.studentLastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.status === 'new').length,
    totalAdmissions: admissions.length,
    newAdmissions: admissions.filter(a => a.status === 'new').length,
    pendingAdmissions: admissions.filter(a => ['new', 'under_review'].includes(a.status)).length
  };

  const handleStatusChange = async (
    type: 'contact' | 'admission', 
    id: string, 
    newStatus: string,
    publicNotes?: string
  ) => {
    try {
      if (!token) {
        return;
      }

      await adminUpdateStatus(token, {
        type,
        id,
        newStatus,
        publicNotes,
      });

      // Recharger les données
      await loadData();
      setShowDetail(false);
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const exportToCSV = () => {
    const data = activeTab === 'contacts' ? filteredContacts : filteredAdmissions;
    const headers = activeTab === 'contacts'
      ? ['Référence', 'Date', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Sujet', 'Statut']
      : ['Référence', 'Date', 'Élève', 'Classe', 'Parent', 'Email', 'Téléphone', 'Statut'];
    
    const rows = data.map(item => {
      if (activeTab === 'contacts') {
        const c = item as ContactSubmission;
        return [c.reference, formatDate(c.createdAt), c.lastName, c.firstName, c.email, c.phone || '', c.subject, c.status];
      } else {
        const a = item as AdmissionSubmission;
        return [a.reference, formatDate(a.createdAt), `${a.studentLastName} ${a.studentFirstName}`, a.desiredClass, `${a.parentLastName} ${a.parentFirstName}`, a.parentEmail, a.parentPhone, a.status];
      }
    });

    const csvContent = [headers, ...rows].map(row => row.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleBackup = async () => {
    if (!token || isBackingUp) {
      return;
    }

    setBackupError('');
    setBackupSuccess('');
    setIsBackingUp(true);
    try {
      const created = await createAdminBackup(token);
      await downloadAdminBackup(token, created.downloadUrl, created.fileName);
      setLastBackupInfo({
        fileName: created.fileName,
        savedPath: created.savedPath,
        createdAt: created.createdAt,
      });
      setBackupSuccess(`Sauvegarde créée avec succès : ${created.fileName}`);
      setTimeout(() => setBackupSuccess(''), 8000);
      await loadBackups();
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!token || isRestoring || !restoreFileName) {
      return;
    }

    setRestoreError('');
    setRestoreSuccess('');
    setIsRestoring(true);
    try {
      const response = await restoreAdminBackup(token, {
        fileName: restoreFileName,
        mode: restoreMode,
        confirmationText: restoreConfirmation,
        developerCode: developerCode.trim(),
      });

      setRestoreSuccess(
        `Restauration niveau ${response.mode} terminée (${response.restoredCount} éléments restaurés depuis ${response.fileName}).`
      );
      setRestoreConfirmation('');
      setDeveloperCode('');
      await loadBackups();
    } catch (error) {
      setRestoreError(error instanceof Error ? error.message : 'Erreur de restauration');
    } finally {
      setIsRestoring(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-orange-950 text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Administration</h1>
          <p className="text-orange-200 text-sm">Vision Future</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/ecqm19-admin/content"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-orange-200 hover:text-white hover:bg-white/10"
          >
            <FileText className="w-5 h-5" />
            Contenu du site
          </Link>

          <Link
            to="/ecqm19-admin/visual"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-orange-200 hover:text-white hover:bg-white/10"
          >
            <Monitor className="w-5 h-5" />
            Éditeur visuel
          </Link>

          <Link
            to="/ecqm19-admin/jobs"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-orange-200 hover:text-white hover:bg-white/10"
          >
            <BriefcaseBusiness className="w-5 h-5" />
            Offres d'emploi
          </Link>

          <button
            onClick={() => { setActiveTab('admissions'); setStatusFilter('all'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'admissions' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Admissions
            {stats.newAdmissions > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.newAdmissions}
              </span>
            )}
          </button>
          
          <button
            onClick={() => { setActiveTab('contacts'); setStatusFilter('all'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'contacts' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Contacts
            {stats.newContacts > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.newContacts}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('operators'); setStatusFilter('all'); loadOperators(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'operators' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            Opérateurs
          </button>

          <button
            onClick={handleBackup}
            disabled={!token || isBackingUp}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10 text-orange-100 disabled:opacity-60"
          >
            <ShieldAlert className="w-5 h-5" />
            {isBackingUp ? 'Sauvegarde...' : 'Sauvegarder le site'}
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-orange-200 hover:text-white hover:bg-white/10"
          >
            <ExternalLink className="w-5 h-5" />
            Voir le site
          </a>

          <button
            onClick={() => setActiveTab('documentation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'documentation' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Guide & Documentation
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className={`rounded-xl border text-xs overflow-hidden transition-all duration-200 ${
            isDeveloperInfoOpen
              ? 'bg-gray-900 border-gray-700 shadow-xl'
              : 'border-orange-700/60 bg-orange-900/60'
          }`}>
            <button
              type="button"
              onClick={() => setIsDeveloperInfoOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                isDeveloperInfoOpen
                  ? 'hover:bg-gray-800'
                  : 'hover:bg-orange-800/40'
              }`}
            >
              <span className={`font-semibold ${isDeveloperInfoOpen ? 'text-gray-200' : 'text-orange-100'}`}>Information du développeur</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDeveloperInfoOpen ? 'rotate-180 text-gray-400' : 'text-orange-300'}`} />
            </button>

            {isDeveloperInfoOpen && (
              <div className="px-3 pb-3">
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Développement & maintenance</p>
                <p className="mt-1 font-semibold text-white">ESSOH Cyrille</p>
                <p className="text-gray-300">ic_future / Nath_tech</p>
                <p className="mt-2 text-gray-400">Création: 2026</p>
                <p className="text-gray-300">Email: ic.future16@gmail.com</p>
                <p className="text-gray-300">Tél: +225 07 77 17 24 08</p>
                <p className="mt-2 text-[11px] text-gray-500">Support technique et évolutions de la plateforme.</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="mt-5 w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8">
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-900 font-semibold">Sauvegarde et restauration</p>
                <p className="text-amber-800 text-sm mt-1">
                  Créez un ZIP complet du site, puis restaurez en niveau A (contenu) ou B (complet) selon le besoin.
                </p>
                {lastBackupInfo && (
                  <p className="text-xs text-amber-700 mt-2">
                    Dernière sauvegarde: {lastBackupInfo.fileName} ({new Date(lastBackupInfo.createdAt).toLocaleString('fr-FR')})
                  </p>
                )}
                {backupError && (
                  <p className="text-xs text-red-700 mt-2">{backupError}</p>
                )}
                {backupSuccess && (
                  <p className="text-xs text-emerald-700 mt-2 font-semibold">{backupSuccess}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={handleBackup}
                disabled={!token || isBackingUp}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-60"
              >
                <ShieldAlert className="w-4 h-4" />
                {isBackingUp ? 'Sauvegarde en cours...' : 'Sauvegarder maintenant'}
              </button>

              <button
                type="button"
                onClick={() => setIsRestorePanelOpen((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restaurer maintenant
                <ChevronDown className={`w-4 h-4 transition-transform ${isRestorePanelOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isRestorePanelOpen && (
            <>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-900">Sauvegarde à restaurer</label>
                  <select
                    value={restoreFileName}
                    onChange={(e) => setRestoreFileName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une sauvegarde</option>
                    {backupItems.map((item) => (
                      <option key={item.fileName} value={item.fileName}>
                        {item.fileName} ({new Date(item.createdAt).toLocaleString('fr-FR')})
                      </option>
                    ))}
                  </select>
                  {isLoadingBackups && <p className="text-xs text-blue-700 mt-1">Chargement des sauvegardes...</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-900">Niveau de restauration</label>
                  <select
                    value={restoreMode}
                    onChange={(e) => setRestoreMode(e.target.value as RestoreMode)}
                    className="mt-1 w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="A">Niveau A - Contenu éditable</option>
                    <option value="B">Niveau B - Restauration complète</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-blue-900 block">
                    Confirmation (écrire exactement {restoreMode === 'A' ? 'RESTAURER NIVEAU A' : 'RESTAURER NIVEAU B'})
                  </label>
                  <input
                    type="text"
                    value={restoreConfirmation}
                    onChange={(e) => setRestoreConfirmation(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={restoreMode === 'A' ? 'RESTAURER NIVEAU A' : 'RESTAURER NIVEAU B'}
                  />
                </div>

                {restoreMode === 'B' && (
                  <div>
                    <label className="text-sm font-medium text-blue-900 block">Code développeur</label>
                    <input
                      type="password"
                      value={developerCode}
                      onChange={(e) => setDeveloperCode(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Entrer le code développeur"
                    />
                    <p className="text-xs text-blue-700 mt-1">Pour le niveau B, vous devez contacter le développeur.</p>
                  </div>
                )}
              </div>

              {restoreError && <p className="mt-3 text-sm text-red-700">{restoreError}</p>}
              {restoreSuccess && <p className="mt-3 text-sm text-emerald-700">{restoreSuccess}</p>}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={loadBackups}
                  disabled={!token || isLoadingBackups}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 text-blue-800 bg-white hover:bg-blue-100 transition-colors disabled:opacity-60"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                  Actualiser les sauvegardes
                </button>

                <button
                  onClick={handleRestore}
                  disabled={!token || isRestoring || !restoreFileName}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isRestoring ? 'Restauration en cours...' : `Restaurer (Niveau ${restoreMode})`}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAdmissions}</p>
                <p className="text-sm text-gray-500">Admissions totales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAdmissions}</p>
                <p className="text-sm text-gray-500">En attente</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                <p className="text-sm text-gray-500">Messages contacts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.newContacts}</p>
                <p className="text-sm text-gray-500">Nouveaux messages</p>
              </div>
            </div>
          </div>
        </div>

        {activeTab !== 'operators' && activeTab !== 'documentation' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email ou référence..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ContactFilterStatus | AdmissionFilterStatus)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    {activeTab === 'contacts' ? (
                      <>
                        <option value="new">Nouveau</option>
                        <option value="in_progress">En cours</option>
                        <option value="processed">Traité</option>
                      </>
                    ) : (
                      <>
                        <option value="new">Nouveau</option>
                        <option value="under_review">En examen</option>
                        <option value="interview_scheduled">Entretien programmé</option>
                        <option value="approved">Approuvé</option>
                        <option value="rejected">Rejeté</option>
                        <option value="waitlist">Liste d'attente</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Chargement...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        {activeTab === 'contacts' ? (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sujet</th>
                          </>
                        ) : (
                          <>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Élève</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Classe</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                          </>
                        )}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeTab === 'contacts' ? (
                        filteredContacts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              Aucun message de contact trouvé
                            </td>
                          </tr>
                        ) : (
                          filteredContacts.map((contact) => (
                            <tr key={contact.reference} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-mono text-sm text-orange-700">{contact.reference}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(contact.createdAt)}</td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{contact.lastName} {contact.firstName}</div>
                                <div className="text-sm text-gray-500">{contact.email}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{contact.subject}</td>
                              <td className="px-6 py-4">{getStatusBadge('contact', contact.status)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => { setSelectedItem(contact); setShowDetail(true); }}
                                    className="text-orange-700 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Voir
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission('contact', contact.reference, contact.reference)}
                                    disabled={deletingItemId === contact.reference}
                                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {deletingItemId === contact.reference ? 'Suppression...' : 'Supprimer'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        filteredAdmissions.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                              Aucune demande d'admission trouvée
                            </td>
                          </tr>
                        ) : (
                          filteredAdmissions.map((admission) => (
                            <tr key={admission.reference} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-mono text-sm text-orange-700">{admission.reference}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(admission.createdAt)}</td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{admission.studentLastName} {admission.studentFirstName}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">{admission.desiredClass}</td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{admission.parentLastName} {admission.parentFirstName}</div>
                                <div className="text-xs text-gray-500">{admission.parentPhone}</div>
                              </td>
                              <td className="px-6 py-4">{getStatusBadge('admission', admission.status)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => { setSelectedItem(admission); setShowDetail(true); }}
                                    className="text-orange-700 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Voir
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission('admission', admission.reference, admission.reference)}
                                    disabled={deletingItemId === admission.reference}
                                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {deletingItemId === admission.reference ? 'Suppression...' : 'Supprimer'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'documentation' && (
          <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Guide d'utilisation</h2>
                  <p className="text-gray-500 mt-1">Tout ce qu'il faut savoir pour gérer le site du Collège Privé la Vision Future</p>
                </div>
              </div>
            </div>

            {/* Cartes principales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <Monitor className="w-5 h-5" />,
                  title: 'Éditer une page',
                  color: 'green',
                  steps: [
                    'Allez dans le menu « Éditeur visuel »',
                    'Sélectionnez la page dans la liste déroulante',
                    'Cliquez sur les textes encadrés pour les modifier',
                    'Cliquez « Terminer l\'édition » pour publier',
                  ],
                },
                {
                  icon: <Image className="w-5 h-5" />,
                  title: 'Changer le fond Hero',
                  color: 'purple',
                  steps: [
                    'Dans l\'éditeur visuel, cliquez « Fond Hero » (bouton en haut à droite)',
                    'Choisissez « Couleur » ou « Image »',
                    'Pour une image : uploadez ou cliquez « Réinitialiser » pour celle par défaut',
                    'Pour une couleur : sélectionnez une vignette ou tapez une classe Tailwind',
                  ],
                },
                {
                  icon: <FileText className="w-5 h-5" />,
                  title: 'Gérer le pied de page',
                  color: 'amber',
                  steps: [
                    'Dans l\'éditeur visuel, sélectionnez « Pied de page »',
                    'Modifiez adresse, téléphone, email, horaires, réseaux sociaux',
                    'Le copyright et les crédits sont aussi éditables',
                  ],
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: 'Opérateurs',
                  color: 'blue',
                  steps: [
                    'Onglet « Opérateurs » du tableau de bord',
                    'Créer : génère un mot de passe temporaire (changement obligatoire)',
                    'Activer/Désactiver, Réinitialiser MDP, Déverrouiller un compte',
                    'Max 10 opérateurs · 10 tentatives = blocage 30 min',
                  ],
                },
                {
                  icon: <Database className="w-5 h-5" />,
                  title: 'Sauvegardes',
                  color: 'orange',
                  steps: [
                    'Cliquez « Sauvegarder maintenant » pour créer un ZIP',
                    'Restauration Niveau A : contenu uniquement',
                    'Restauration Niveau B : complète (nécessite le code développeur)',
                    'Toujours sauvegarder AVANT de restaurer',
                  ],
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: 'Sécurité',
                  color: 'red',
                  steps: [
                    'Mot de passe : 8+ caractères, majuscule, minuscule, chiffre',
                    'Historique : les 10 derniers MDP sont bloqués',
                    'Verrouillage automatique après 10 échecs (30 minutes)',
                    'Ne partagez jamais vos identifiants',
                  ],
                },
              ].map((card, i) => {
                const colors: Record<string, { bg: string; badge: string; text: string; stepBg: string }> = {
                  green:  { bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800', text: 'text-green-900', stepBg: 'bg-green-50' },
                  purple: { bg: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-800', text: 'text-purple-900', stepBg: 'bg-purple-50' },
                  amber:  { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800', text: 'text-amber-900', stepBg: 'bg-amber-50' },
                  blue:   { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-800', text: 'text-blue-900', stepBg: 'bg-blue-50' },
                  orange: { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-800', text: 'text-orange-900', stepBg: 'bg-orange-50' },
                  red:    { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800', text: 'text-red-900', stepBg: 'bg-red-50' },
                };
                const c = colors[card.color] || colors.blue;
                return (
                  <div key={i} className={`${c.bg} border rounded-2xl p-5`}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`${c.badge} p-2 rounded-lg`}>{card.icon}</div>
                      <h3 className={`font-bold ${c.text}`}>{card.title}</h3>
                    </div>
                    <ol className="space-y-2">
                      {card.steps.map((step, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <span className={`${c.badge} w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>{j + 1}</span>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            {/* FAQ rapide */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Questions fréquentes
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { q: 'J\'ai oublié mon mot de passe', a: 'Demandez à un autre opérateur de réinitialiser votre MDP depuis l\'onglet Opérateurs.' },
                  { q: 'Mon compte est verrouillé', a: 'Attendez 30 min ou demandez à un autre opérateur de vous déverrouiller.' },
                  { q: 'Les modifications sont-elles immédiates ?', a: 'Oui, dès que vous publiez, les changements sont visibles sur le site.' },
                  { q: 'Comment ajouter une offre d\'emploi ?', a: 'Menu « Offres d\'emploi » → créez une offre avec un PDF. Visible sur la page Carrières.' },
                  { q: 'Puis-je changer les couleurs du site ?', a: 'Oui, via le bouton « Fond Hero » dans l\'éditeur visuel pour chaque page.' },
                  { q: 'Où sont les sauvegardes ?', a: 'Dans le dossier backups/ du serveur. Non accessibles par URL directe.' },
                ].map((faq, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900 text-sm">{faq.q}</p>
                    <p className="text-gray-600 text-sm mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lien doc complète */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-lg">Documentation technique complète</h3>
                  <p className="text-gray-400 text-sm mt-1">Architecture, déploiement, configuration détaillée</p>
                </div>
                <a
                  href="https://github.com/ecqm19services-web/GSVF/blob/main/DOCUMENTATION_CLIENT.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir la doc complète
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <h4 className="font-semibold text-blue-900 mb-2">Support technique</h4>
                <p className="text-blue-700 text-sm">
                  Email : contact@lavisionfuture.com<br />
                  Téléphone : +225 27 21 29 39 83
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h4 className="font-semibold text-green-900 mb-2">Développeur</h4>
                <p className="text-green-700 text-sm">
                  ic_future / Nath_tech<br />
                  © 2026 Collège Privé la Vision Future
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operators' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Gestion des opérateurs</h2>
                <p className="text-sm text-gray-600">Créer, activer/désactiver, réinitialiser un mot de passe ou débloquer.</p>
              </div>
              <button
                onClick={handleCreateOperator}
                disabled={isLoadingOperators}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                Nouvel opérateur
              </button>
            </div>

            {opActionMessage && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm">
                {opActionMessage}
                {opTempPassword && (
                  <div className="mt-1 font-mono text-xs bg-white px-2 py-1 rounded border border-emerald-200 inline-block">
                    Mot de passe: {opTempPassword}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actif</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Chgt MDP</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Créé</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoadingOperators ? (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">Chargement...</td></tr>
                  ) : operators.length === 0 ? (
                    <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">Aucun opérateur</td></tr>
                  ) : (
                    operators.map((op) => (
                      <tr key={op.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm text-orange-700">{op.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{op.displayName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{op.role}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${op.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                            {op.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {op.mustChangePassword ? (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Oui</span>
                          ) : (
                            <span className="text-xs text-gray-500">Non</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(op.createdAt || op.updatedAt || undefined)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleToggleOperator(op.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-100"
                            >
                              {op.active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                              {op.active ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                              onClick={() => handleResetOperatorPassword(op.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 text-white hover:bg-orange-700"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Reset MDP
                            </button>
                            <button
                              onClick={() => handleClearLockout(op.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              Débloquer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Operator Passphrase Confirmation Modal */}
      {opConfirmModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Confirmation requise</h2>
                <p className="text-sm text-gray-500">{opConfirmModal.label}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Pour confirmer cette action, saisissez exactement la phrase suivante :
            </p>
            <div className="bg-gray-100 rounded-lg px-3 py-2 font-mono text-sm text-gray-800 mb-4 select-all break-all">
              op01-op02-op03-op04-op05-op06-op07-op08-op09-op10
            </div>
            <input
              type="text"
              value={opConfirmInput}
              onChange={(e) => { setOpConfirmInput(e.target.value); setOpConfirmError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && submitOpPassphrase()}
              placeholder="Saisissez la phrase ci-dessus..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none mb-2"
              autoFocus
            />
            {opConfirmError && (
              <p className="text-red-600 text-xs mb-3 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {opConfirmError}
              </p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setOpConfirmModal({ open: false, label: '', onConfirmed: () => {} }); setOpConfirmInput(''); setOpConfirmError(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={submitOpPassphrase}
                disabled={opConfirmInput !== 'op01-op02-op03-op04-op05-op06-op07-op08-op09-op10'}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedItem && (
        <DetailModal
          item={selectedItem}
          type={activeTab === 'contacts' ? 'contact' : 'admission'}
          onClose={() => { setShowDetail(false); setSelectedItem(null); }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

// Modal de détail
interface DetailModalProps {
  item: ContactSubmission | AdmissionSubmission;
  type: 'contact' | 'admission';
  onClose: () => void;
  onStatusChange: (type: 'contact' | 'admission', id: string, status: string, publicNotes?: string) => Promise<void>;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, type, onClose, onStatusChange }) => {
  const [newStatus, setNewStatus] = useState<string>(item.status);
  const [publicNotes, setPublicNotes] = useState((item as AdmissionSubmission).publicNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (newStatus === item.status && publicNotes === ((item as AdmissionSubmission).publicNotes || '')) {
      onClose();
      return;
    }
    
    setIsUpdating(true);
    await onStatusChange(type, item.reference, newStatus, type === 'admission' ? publicNotes : undefined);
    setIsUpdating(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{type === 'contact' ? 'Contact' : 'Admission'}</p>
            <h2 className="text-xl font-bold text-gray-900 font-mono">{item.reference}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {type === 'contact' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Nom</label>
                  <p className="font-medium">{(item as ContactSubmission).lastName} {(item as ContactSubmission).firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <p className="font-medium">{formatDate(item.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{(item as ContactSubmission).email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Téléphone</label>
                  <p className="font-medium">{(item as ContactSubmission).phone || '-'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Sujet</label>
                <p className="font-medium">{(item as ContactSubmission).subject}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Message</label>
                <p className="mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{(item as ContactSubmission).message}</p>
              </div>
            </>
          ) : (
            <>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informations de l'élève</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom complet</label>
                    <p className="font-medium">{(item as AdmissionSubmission).studentLastName} {(item as AdmissionSubmission).studentFirstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Date de naissance</label>
                    <p className="font-medium">{(item as AdmissionSubmission).studentBirthdate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Classe souhaitée</label>
                    <p className="font-medium">{(item as AdmissionSubmission).desiredClass}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">École actuelle</label>
                    <p className="font-medium">{(item as AdmissionSubmission).currentSchool || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Parent / Tuteur</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nom complet</label>
                    <p className="font-medium">{(item as AdmissionSubmission).parentLastName} {(item as AdmissionSubmission).parentFirstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Relation</label>
                    <p className="font-medium">{(item as AdmissionSubmission).relationship || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{(item as AdmissionSubmission).parentEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Téléphone</label>
                    <p className="font-medium">{(item as AdmissionSubmission).parentPhone}</p>
                  </div>
                </div>
              </div>

              {(item as AdmissionSubmission).message && (
                <div>
                  <label className="text-sm text-gray-500">Message complémentaire</label>
                  <p className="mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{(item as AdmissionSubmission).message}</p>
                </div>
              )}
            </>
          )}

          {/* Status Update */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Gestion du statut</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-2">Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {type === 'contact' ? (
                    <>
                      <option value="new">Nouveau</option>
                      <option value="in_progress">En cours</option>
                      <option value="processed">Traité</option>
                    </>
                  ) : (
                    <>
                      <option value="new">Nouveau</option>
                      <option value="under_review">En examen</option>
                      <option value="interview_scheduled">Entretien programmé</option>
                      <option value="approved">Approuvé</option>
                      <option value="rejected">Rejeté</option>
                      <option value="waitlist">Liste d'attente</option>
                    </>
                  )}
                </select>
              </div>

              {type === 'admission' && (
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Note visible par le parent</label>
                  <textarea
                    value={publicNotes}
                    onChange={(e) => setPublicNotes(e.target.value)}
                    placeholder="Cette note sera visible sur la page de suivi..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
