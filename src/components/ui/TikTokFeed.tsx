import React, { useEffect, useState } from 'react';

interface TikTokFeedProps {
  /** IDs numériques de vidéos TikTok à afficher. */
  videoIds: string[];
  /** Délai (ms) entre le montage de chaque lecteur, pour éviter le bridage parallèle de TikTok (HTTP 503). */
  staggerMs?: number;
}

const TikTokFeed: React.FC<TikTokFeedProps> = ({ videoIds, staggerMs = 1800 }) => {
  // On ne monte les iframes qu'une par une (la première tout de suite) afin de ne pas
  // déclencher le « overload-protect » de TikTok quand plusieurs lectures sont simultanées.
  const [visible, setVisible] = useState(videoIds.length ? 1 : 0);

  useEffect(() => {
    if (visible >= videoIds.length) return;
    const t = window.setTimeout(() => setVisible((v) => Math.min(v + 1, videoIds.length)), staggerMs);
    return () => clearTimeout(t);
  }, [visible, videoIds.length, staggerMs]);

  if (!videoIds.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {videoIds.map((vid, i) => (
        <div key={vid} className="shrink-0 w-[420px] h-[780px] rounded-xl bg-gray-100 overflow-hidden">
          {i < visible ? (
            <iframe
              src={`https://www.tiktok.com/embed/v2/${vid}`}
              title="TikTok"
              className="w-full h-full rounded-xl border-0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Chargement…</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TikTokFeed;
