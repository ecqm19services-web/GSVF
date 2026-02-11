import React from 'react';

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
  height = 800,
  tabs = 'timeline',
  showFacepile = false,
  smallHeader = false,
}) => {
  const encodedUrl = encodeURIComponent(pageUrl);
  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${encodedUrl}&tabs=${tabs}&width=&height=${height}&small_header=${smallHeader}&adapt_container_width=true&hide_cover=false&show_facepile=${showFacepile}`;

  return (
    <div className="w-full">
      <iframe
        src={iframeSrc}
        style={{ border: 'none', overflow: 'hidden', width: '100%', height: `${height}px` }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        title="Facebook - Collège Privé la Vision Future"
      />
    </div>
  );
};

export default FacebookPageEmbed;
