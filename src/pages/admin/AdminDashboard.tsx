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
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  ChevronDown,
  X
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchAdminAdmissions, fetchAdminContacts, adminUpdateStatus } from '@/lib/adminApi';
import { createAdminBackup, downloadAdminBackup } from '@/lib/adminBackupApi';
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

type TabType = 'contacts' | 'admissions';
type ContactFilterStatus = ContactStatus | 'all';
type AdmissionFilterStatus = AdmissionStatus | 'all';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('admissions');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactFilterStatus | AdmissionFilterStatus>('all');
  const [selectedItem, setSelectedItem] = useState<ContactSubmission | AdmissionSubmission | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupError, setBackupError] = useState('');
  const [lastBackupInfo, setLastBackupInfo] = useState<{
    fileName: string;
    savedPath: string;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token]);

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
        return [c.reference, formatDate(c.$createdAt), c.lastName, c.firstName, c.email, c.phone || '', c.subject, c.status];
      } else {
        const a = item as AdmissionSubmission;
        return [a.reference, formatDate(a.$createdAt), `${a.studentLastName} ${a.studentFirstName}`, a.desiredClass, `${a.parentLastName} ${a.parentFirstName}`, a.parentEmail, a.parentPhone, a.status];
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
    setIsBackingUp(true);
    try {
      const created = await createAdminBackup(token);
      await downloadAdminBackup(token, created.downloadUrl, created.fileName);
      setLastBackupInfo({
        fileName: created.fileName,
        savedPath: created.savedPath,
        createdAt: created.createdAt,
      });
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
    } finally {
      setIsBackingUp(false);
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
      <aside className="fixed left-0 top-0 h-full w-64 bg-orange-950 text-white p-6">
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
            onClick={() => { setActiveTab('admissions'); setStatusFilter('all'); }}
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
            onClick={() => { setActiveTab('contacts'); setStatusFilter('all'); }}
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
            onClick={handleBackup}
            disabled={!token || isBackingUp}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-white/10 text-orange-100 disabled:opacity-60"
          >
            <ShieldAlert className="w-5 h-5" />
            {isBackingUp ? 'Sauvegarde...' : 'Sauvegarder le site'}
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="rounded-xl border border-orange-700/60 bg-orange-900/60 p-3 text-xs text-orange-100">
            <p className="text-[11px] uppercase tracking-wide text-orange-300">Développement & maintenance</p>
            <p className="mt-1 font-semibold text-white">ESSOH Cyrille</p>
            <p className="text-orange-200">ic_future / Hfablab</p>
            <p className="mt-2 text-orange-200">Création: 2026</p>
            <p className="text-orange-200">Email: ic.future16@gmail.com</p>
            <p className="text-orange-200">Tél: +225 07 77 17 24 08</p>
            <p className="mt-2 text-[11px] text-orange-300">Support technique et évolutions de la plateforme.</p>
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
      <main className="ml-64 p-8">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-amber-900 font-semibold">Sauvegarde recommandée avant toute modification</p>
              <p className="text-amber-800 text-sm mt-1">
                Crée un ZIP complet du site, le télécharge sur votre ordinateur et l'enregistre aussi sur le serveur.
              </p>
              {lastBackupInfo && (
                <p className="text-xs text-amber-700 mt-2">
                  Dernière sauvegarde: {lastBackupInfo.fileName} ({new Date(lastBackupInfo.createdAt).toLocaleString('fr-FR')})
                </p>
              )}
              {backupError && (
                <p className="text-xs text-red-700 mt-2">{backupError}</p>
              )}
            </div>
            <button
              onClick={handleBackup}
              disabled={!token || isBackingUp}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-60"
            >
              <ShieldAlert className="w-4 h-4" />
              {isBackingUp ? 'Sauvegarde en cours...' : 'Sauvegarder maintenant'}
            </button>
          </div>
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
                        <tr key={contact.$id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm text-orange-700">{contact.reference}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(contact.$createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{contact.lastName} {contact.firstName}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{contact.subject}</td>
                          <td className="px-6 py-4">{getStatusBadge('contact', contact.status)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => { setSelectedItem(contact); setShowDetail(true); }}
                              className="text-orange-700 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Voir
                            </button>
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
                        <tr key={admission.$id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-mono text-sm text-orange-700">{admission.reference}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(admission.$createdAt)}</td>
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
                            <button
                              onClick={() => { setSelectedItem(admission); setShowDetail(true); }}
                              className="text-orange-700 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              Voir
                            </button>
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
      </main>

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
    await onStatusChange(type, item.$id!, newStatus, type === 'admission' ? publicNotes : undefined);
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
                  <p className="font-medium">{formatDate(item.$createdAt)}</p>
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
