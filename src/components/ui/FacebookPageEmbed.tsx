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
  height = 900,
  tabs = 'timeline',
  showFacepile = false,
  smallHeader = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const encodedUrl = encodeURIComponent(pageUrl);
    // Facebook plugin max width is 500px — we use 500 and center it
    const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=${tabs}&width=500&height=${height}&small_header=${smallHeader}&adapt_container_width=true&hide_cover=false&show_facepile=${showFacepile}`;

    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.width = '100%';
    iframe.style.height = `${height}px`;
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.title = 'Facebook - Collège Privé la Vision Future';

    container.appendChild(iframe);

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [pageUrl, height, tabs, showFacepile, smallHeader]);

  return <div ref={containerRef} className="w-full max-w-[520px]" />;
};

export default FacebookPageEmbed;
