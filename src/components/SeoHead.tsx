import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeo } from '@/lib/seo';

/**
 * Applique les métadonnées SEO (titre, description, canonical, OG, robots)
 * à chaque navigation. À rendre une seule fois, à l'intérieur du BrowserRouter.
 */
const SeoHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    applySeo(location.pathname);
  }, [location.pathname]);

  return null;
};

export default SeoHead;
