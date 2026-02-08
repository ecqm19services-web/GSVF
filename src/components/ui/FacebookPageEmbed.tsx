import React, { useEffect, useRef } from 'react';

interface FacebookPageEmbedProps {
  pageUrl: string;
  width?: number;
  height?: number;
  tabs?: string;
  showFacepile?: boolean;
  smallHeader?: boolean;
}

const FacebookPageEmbed: React.FC<FacebookPageEmbedProps> = ({
  pageUrl,
  width = 500,
  height = 600,
  tabs = 'timeline',
  showFacepile = false,
  smallHeader = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Facebook SDK if not already loaded
    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        if ((window as any).FB) {
          (window as any).FB.XFBML.parse(containerRef.current);
        }
      };
    } else {
      (window as any).FB.XFBML.parse(containerRef.current);
    }
  }, [pageUrl]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <div
        className="fb-page"
        data-href={pageUrl}
        data-tabs={tabs}
        data-width={width}
        data-height={height}
        data-small-header={smallHeader}
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile={showFacepile}
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Collège Privé la Vision Future</a>
        </blockquote>
      </div>
    </div>
  );
};

export default FacebookPageEmbed;
