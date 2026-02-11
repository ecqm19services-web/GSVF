import React, { useEffect, useRef, useState } from 'react';

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
  height = 600,
  tabs = 'timeline',
  showFacepile = false,
  smallHeader = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(500);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.getBoundingClientRect().width;
      // Facebook SDK max is 500, min is 180
      setContainerWidth(Math.min(500, Math.max(180, Math.floor(w))));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const parse = () => {
      if ((window as any).FB && containerRef.current) {
        (window as any).FB.XFBML.parse(containerRef.current);
      }
    };

    // Load Facebook SDK if not already loaded
    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
      script.onload = parse;
    } else {
      parse();
    }
  }, [pageUrl, containerWidth]);

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="fb-page"
        data-href={pageUrl}
        data-tabs={tabs}
        data-width={containerWidth}
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
