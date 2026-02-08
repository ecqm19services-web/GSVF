import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomeContent from '@/components/pages/HomeContent';
import NotreEcoleContent from '@/components/pages/NotreEcoleContent';
import ProgrammesContent from '@/components/pages/ProgrammesContent';
import ExcellenceContent from '@/components/pages/ExcellenceContent';
import VisiteContent from '@/components/pages/VisiteContent';
import AdmissionsContent from '@/components/pages/AdmissionsContent';
import ContactContent from '@/components/pages/ContactContent';
import MentionsLegalesContent from '@/components/pages/MentionsLegalesContent';
import ConfidentialiteContent from '@/components/pages/ConfidentialiteContent';
import NotFound from '@/pages/NotFound';

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
      case '/programmes':
        return <ProgrammesContent />;
      case '/excellence':
        return <ExcellenceContent />;
      case '/visite':
        return <VisiteContent />;
      case '/admissions':
        return <AdmissionsContent />;
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
