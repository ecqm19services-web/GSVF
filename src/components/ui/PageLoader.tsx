import React from 'react';

/**
 * Indicateur de chargement sobre, utilisé comme fallback Suspense
 * pendant le chargement différé des routes (code-splitting).
 */
const PageLoader: React.FC = () => (
  <div
    className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 bg-gray-50"
    role="status"
    aria-live="polite"
  >
    <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-700 animate-spin" />
    <p className="text-sm text-gray-500 font-medium">Chargement…</p>
  </div>
);

export default PageLoader;
