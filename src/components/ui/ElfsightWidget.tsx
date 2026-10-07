import React, { useEffect } from 'react';

interface ElfsightWidgetProps {
  /** Identifiant public de l'application Elfsight (UUID visible dans le code d'intégration du widget). */
  appId: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const PLATFORM_ID = 'elfsight-platform-script';
const PLATFORM_SRC = 'https://static.elfsight.com/platform/platform.js';

/** Charge une seule fois le script plateforme d'Elfsight (data-use-embed : la plateforme observe le DOM). */
function ensurePlatformScript() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PLATFORM_ID)) return;
  const script = document.createElement('script');
  script.id = PLATFORM_ID;
  script.src = PLATFORM_SRC;
  script.async = true;
  script.setAttribute('data-use-embed', 'true');
  document.head.appendChild(script);
}

const ElfsightWidget: React.FC<ElfsightWidgetProps> = ({ appId, align = 'left', className = '' }) => {
  useEffect(() => {
    if (appId) ensurePlatformScript();
  }, [appId]);

  if (!appId) return null;

  const alignClass =
    align === 'center' ? 'flex justify-center' : align === 'right' ? 'flex justify-end' : 'w-full';

  return (
    <div className={`${alignClass} ${className}`}>
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy></div>
    </div>
  );
};

export default ElfsightWidget;
