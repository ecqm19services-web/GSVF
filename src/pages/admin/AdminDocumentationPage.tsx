import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogOut,
  ChevronRight,
  Shield,
  FileText,
  Users,
  Database,
  Image,
  Globe,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const AdminDocumentationPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [copied, setCopied] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Vue d\'ensemble',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Bienvenue dans l\'administration</h3>
            <p className="text-blue-700">
              Ce tableau de bord vous permet de gérer l\'ensemble du contenu du site du Collège Privé la Vision Future.
              Toutes les modifications sont sauvegardées et publiées immédiatement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Pages éditables</h4>
              </div>
              <p className="text-gray-600 text-sm">
                15 pages peuvent être modifiées via l\'éditeur visuel : Accueil, Visite, Notre École, 
                Programmes, Admissions, Actualités, Contact, et plus.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Gestion des demandes</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Suivez les admissions et messages de contact. Mettez à jour les statuts 
                et ajoutez des notes pour chaque demande.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Multi-opérateurs</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Jusqu\'à 10 opérateurs peuvent accéder au tableau de bord avec des 
                droits identiques. Gestion sécurisée des accès.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Sauvegardes</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Créez des sauvegardes complètes du site et restaurez-les en cas de besoin.
                Deux niveaux de restauration disponibles.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'access',
      title: 'Accès & Connexion',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Sécurité des accès</h3>
                <p className="text-amber-700 text-sm">
                  Ne partagez jamais vos identifiants. Chaque opérateur doit avoir 
                  son propre compte. Le mot de passe doit être changé régulièrement.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Règles de sécurité</h3>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Format du mot de passe</td>
                    <td className="px-4 py-3 text-gray-600">
                      Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Verrouillage</td>
                    <td className="px-4 py-3 text-gray-600">
                      10 tentatives échouées = blocage 30 minutes
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Historique</td>
                    <td className="px-4 py-3 text-gray-600">
                      Les 10 derniers mots de passe ne peuvent pas être réutilisés
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-700">Changement obligatoire</td>
                    <td className="px-4 py-3 text-gray-600">
                      À la première connexion et après réinitialisation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Gestion des opérateurs</h3>
            <p className="text-gray-600">
              Depuis le tableau de bord, section "Opérateurs", vous pouvez :
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Créer un nouvel opérateur (mot de passe généré automatiquement)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Activer ou désactiver un compte</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Réinitialiser un mot de passe perdu</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>Débloquer un compte après verrouillage</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'editor',
      title: 'Éditeur Visuel',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Comment modifier une page</h3>
            <ol className="space-y-3 text-green-700">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Cliquez sur "Éditeur Visuel" dans le menu principal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Sélectionnez la page à modifier dans la liste déroulante</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Cliquez sur "Activer l\'édition" (bouton bleu en haut)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Modifiez directement les textes (cliquez pour éditer) et les images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                <span>Cliquez sur "Terminer l\'édition" pour sauvegarder</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pages disponibles à l\'édition</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Accueil - Slider, résultats, tableau d\'honneur',
                'Visite - Galeries photos et descriptions',
                'Notre École - Timeline, valeurs, fondateur',
                'Histoire - Événements marquants',
                'Vision - Valeurs et engagements',
                'Excellence - Distinctions et alumni',
                'Équipe - Membres pédagogiques',
                'Programmes - Cycles et descriptions',
                'Admissions - Tarifs et étapes',
                'Actualités - Articles et réseaux sociaux',
                'Emplois du Temps - Classes et PDF',
                'Contact - Coordonnées et horaires',
                'Carrières - Offres d\'emploi',
                'Mentions légales',
                'Confidentialité',
              ].map((page, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {page}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ajouter / Supprimer des éléments</h3>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-600 mb-4">
                En mode édition, des boutons <strong>"+"</strong> et <strong>"🗑"</strong> apparaissent :
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Tableau d\'honneur :</strong> Ajouter/supprimer des niveaux (6e, 5e, etc.)</li>
                <li>• <strong>Résultats examens :</strong> Ajouter/supprimer des cartes de résultats</li>
                <li>• <strong>Liens parents :</strong> Gérer les liens rapides</li>
                <li>• <strong>Actualités :</strong> Créer, modifier, supprimer des articles</li>
                <li>• <strong>Équipe :</strong> Ajouter/supprimer des membres</li>
                <li>• <strong>Programmes :</strong> Ajouter/supprimer des cycles</li>
                <li>• <strong>Contact :</strong> Ajouter/supprimer lignes d\'adresse, téléphones, emails</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'uploads',
      title: 'Images & Documents',
      icon: <Image className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Image className="w-5 h-5 text-blue-600" />
                Images
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Formats acceptés :</strong> JPG, PNG, WebP</li>
                <li><strong>Taille maximum :</strong> 10 Mo</li>
                <li><strong>Utilisation :</strong> Photos du slider, galeries, portraits équipe</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Documents PDF
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>Format :</strong> PDF uniquement</li>
                <li><strong>Taille maximum :</strong> 15 Mo</li>
                <li><strong>Utilisation :</strong> Emplois du temps, offres d\'emploi, brochures</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Comment uploader un fichier</h3>
            <ol className="space-y-2 text-blue-700 text-sm">
              <li>1. En mode édition, survolez une image ou cliquez sur un bouton "Changer l\'image"</li>
              <li>2. Sélectionnez un fichier depuis votre ordinateur</li>
              <li>3. Le fichier est uploadé automatiquement</li>
              <li>4. L\'URL est mise à jour dans le contenu</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'submissions',
      title: 'Admissions & Contacts',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Gestion des demandes</h3>
            <p className="text-gray-600 mb-4">
              Le tableau de bord affiche toutes les demandes d\'admission et messages de contact.
              Chaque demande a un numéro de référence unique.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Format des références</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">CONT-2026-1234</code>
                  <span className="text-gray-600">Demande de contact</span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="bg-orange-100 text-orange-800 px-2 py-1 rounded">ADM-2026-1234</code>
                  <span className="text-gray-600">Demande d\'admission</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Statuts possibles</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <span className="font-medium text-red-900">Nouveau</span>
                <p className="text-sm text-red-700">Demande reçue, non traitée</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <span className="font-medium text-yellow-900">En cours / À l\'étude</span>
                <p className="text-sm text-yellow-700">Traitement en cours</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <span className="font-medium text-orange-900">Entretien programmé</span>
                <p className="text-sm text-orange-700">Rendez-vous fixé (admissions)</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <span className="font-medium text-green-900">Traité / Accepté</span>
                <p className="text-sm text-green-700">Demande finalisée</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-semibold text-amber-900 mb-2">Page de suivi public</h3>
            <p className="text-amber-700 text-sm mb-3">
              Les visiteurs peuvent suivre leurs demandes via la page :
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-white border border-amber-300 rounded px-3 py-2 text-amber-800">
                /suivi
              </code>
              <span className="text-amber-600 text-sm">accessible depuis le menu</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'backup',
      title: 'Sauvegardes',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Sauvegardes automatiques</h3>
            <p className="text-green-700">
              Le système crée des sauvegardes ZIP contenant tout le contenu du site 
              (pages, articles, offres d\'emploi, configuration).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Créer une sauvegarde</h3>
            <ol className="space-y-2 text-gray-600">
              <li>1. Dans le tableau de bord, section "Sauvegarde"</li>
              <li>2. Cliquez sur "Créer une sauvegarde complète"</li>
              <li>3. Attendez la génération du fichier ZIP</li>
              <li>4. Le fichier est stocké sur le serveur (dossier <code>server/backups/</code>)</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Restaurer une sauvegarde</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-900 mb-2">Niveau A - Contenu éditable uniquement</h4>
              <p className="text-blue-700 text-sm mb-3">
                Restaure uniquement les pages, articles et offres d\'emploi. 
                La configuration système reste inchangée.
              </p>
              <p className="text-sm text-blue-600">
                <strong>Confirmation requise :</strong> tapez "RESTAURER-A"
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <h4 className="font-semibold text-red-900 mb-2">Niveau B - Restauration complète</h4>
              <p className="text-red-700 text-sm mb-3">
                Restaure TOUT : contenu + configuration système + opérateurs.
                <br />
                <strong>⚠️ Attention :</strong> Peut verrouiller l\'accès si les anciens opérateurs diffèrent.
              </p>
              <p className="text-sm text-red-600">
                <strong>Requis :</strong> Confirmation + Code développeur (format hex date)
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900">Important</h4>
                <p className="text-amber-700 text-sm">
                  Toujours créer une sauvegarde AVANT toute restauration. 
                  Les fichiers de backup ne sont pas accessibles directement par URL (sécurisés par .htaccess).
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'help',
      title: 'FAQ & Aide',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              {
                q: 'J\'ai oublié mon mot de passe, que faire ?',
                a: 'Demandez à un autre opérateur de réinitialiser votre mot de passe depuis le tableau de bord. Si vous êtes le seul opérateur, contactez le développeur.',
              },
              {
                q: 'Mon compte est verrouillé, comment le débloquer ?',
                a: 'Attendez 30 minutes ou demandez à un autre opérateur de cliquer sur "Déverrouiller" dans la gestion des opérateurs.',
              },
              {
                q: 'Puis-je ajouter plus de 10 opérateurs ?',
                a: 'Non, la limite est fixée à 10 opérateurs pour des raisons de sécurité.',
              },
              {
                q: 'Les modifications sont-elles immédiates ?',
                a: 'Oui, dès que vous cliquez sur "Terminer l\'édition", les changements sont visibles sur le site public.',
              },
              {
                q: 'Comment ajouter une offre d\'emploi ?',
                a: 'Allez dans "Gestion des emplois" (menu principal), créez une offre avec un document PDF. Elle apparaîtra automatiquement sur la page Carrières.',
              },
              {
                q: 'Puis-je modifier les couleurs du site ?',
                a: 'Les couleurs principales (bleu #434a7a et orange) sont définies dans le code. Contactez le développeur pour les modifier.',
              },
              {
                q: 'Où sont stockées les sauvegardes ?',
                a: 'Dans le dossier server/backups/ sur le serveur. Elles ne sont pas accessibles par URL directe.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h4>
                <p className="text-gray-600 text-sm pl-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'external',
      title: 'Documentation Complète',
      icon: <ExternalLink className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">Documentation technique complète</h3>
            <p className="text-gray-400 text-sm mb-4">
              Pour les informations détaillées sur l\'architecture, le déploiement, 
              la configuration Appwrite et les procédures avancées :
            </p>
            <a
              href="https://github.com/ecqm19services-web/GSVF/blob/main/DOCUMENTATION_CLIENT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir la documentation complète
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-semibold text-blue-900 mb-2">Support technique</h4>
              <p className="text-blue-700 text-sm">
                Email : contact@lavisionfuture.ci<br />
                Téléphone : +225 27 21 29 39 83
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <h4 className="font-semibold text-green-900 mb-2">Développeur</h4>
              <p className="text-green-700 text-sm">
                ic_future<br />
                © 2026 Collège Privé la Vision Future
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeContent = sections.find((s) => s.id === activeSection)?.content;

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/ecqm19-admin/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Retour au tableau de bord</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-orange-600" />
                Documentation
              </h1>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-24">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-orange-100 text-orange-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  <span className="flex-1">{section.title}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      activeSection === section.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {sections.find((s) => s.id === activeSection)?.icon}
                  {sections.find((s) => s.id === activeSection)?.title}
                </h2>
              </div>
              <div className="p-6">{activeContent}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentationPage;
