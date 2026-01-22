import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ContactForm from '@/components/forms/ContactForm';
import AdmissionsForm from '@/components/forms/AdmissionsForm';
import MarkdownPage from '@/components/pages/MarkdownPage';
import NotFound from '@/pages/NotFound';

const AppLayout: React.FC = () => {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case '/':
        return <MarkdownPage pageName="accueil" />;
      case '/vision':
        return <MarkdownPage pageName="vision" />;
      case '/histoire':
        return <MarkdownPage pageName="histoire" />;
      case '/programmes':
        return <MarkdownPage pageName="programmes" />;
      case '/excellence':
        return <MarkdownPage pageName="excellence" />;
      case '/visite':
        return <MarkdownPage pageName="visite" />;
      case '/admissions':
        return (
          <>
            <MarkdownPage pageName="admissions" />
            <section className="py-20 bg-gray-50">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <AdmissionsForm />
                </div>
              </div>
            </section>
          </>
        );
      case '/contact':
        return (
          <>
            <MarkdownPage pageName="contact" />
            <section className="py-20 bg-gray-50">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <ContactForm />
                </div>
              </div>
            </section>
          </>
        );

      case '/mentions-legales':
        return <MarkdownPage pageName="mentions-legales" />;

      case '/confidentialite':
        return <MarkdownPage pageName="confidentialite" />;

      default:
        return <NotFound />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
};

export default AppLayout;
