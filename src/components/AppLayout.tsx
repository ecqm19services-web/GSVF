import React, { lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomeContent from '@/components/pages/HomeContent';
import NotFound from '@/pages/NotFound';

// HomeContent reste chargé immédiatement (premier rendu / LCP de l'accueil).
// Les autres pages publiques sont chargées à la demande (code-splitting),
// avec un fallback géré par le <Suspense> global de App.tsx.
const NotreEcoleContent = lazy(() => import('@/components/pages/NotreEcoleContent'));
const ProgrammesContent = lazy(() => import('@/components/pages/ProgrammesContent'));
const VisiteContent = lazy(() => import('@/components/pages/VisiteContent'));
const AdmissionsContent = lazy(() => import('@/components/pages/AdmissionsContent'));
const ContactContent = lazy(() => import('@/components/pages/ContactContent'));
const ActualitesContent = lazy(() => import('@/components/pages/ActualitesContent'));
const CareersContent = lazy(() => import('@/components/pages/CareersContent'));
const CareerApplicationContent = lazy(() => import('@/components/pages/CareerApplicationContent'));
const MentionsLegalesContent = lazy(() => import('@/components/pages/MentionsLegalesContent'));
const ConfidentialiteContent = lazy(() => import('@/components/pages/ConfidentialiteContent'));
const EquipeContent = lazy(() => import('@/components/pages/EquipeContent'));
const EmploisDuTempsContent = lazy(() => import('@/components/pages/EmploisDuTempsContent'));

const AppLayout: React.FC = () => {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case '/':
        return <HomeContent />;
      case '/notre-ecole':
      case '/vision':
      case '/histoire':
        return <NotreEcoleContent />;
      case '/equipe':
        return <EquipeContent />;
      case '/programmes':
        return <ProgrammesContent />;
      case '/emplois-du-temps':
        return <EmploisDuTempsContent />;
      case '/visite':
        return <VisiteContent />;
      case '/admissions':
        return <AdmissionsContent />;
      case '/actualites':
        return <ActualitesContent />;
      case '/carrieres':
        return <CareersContent />;
      case '/carrieres/candidature':
        return <CareerApplicationContent />;
      case '/contact':
        return <ContactContent />;

      case '/mentions-legales':
        return <MentionsLegalesContent />;

      case '/confidentialite':
        return <ConfidentialiteContent />;

      default:
        return <NotFound />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
};

export default AppLayout;
