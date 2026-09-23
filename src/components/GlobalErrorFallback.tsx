import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Écran d'erreur global affiché par l'ErrorBoundary : évite le « white screen »
 * en cas d'erreur de rendu, avec des actions de récupération.
 */
const GlobalErrorFallback: React.FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
    <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-amber-600" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">
        Une erreur est survenue
      </h1>
      <p className="text-gray-600 mb-6">
        La page n'a pas pu s'afficher correctement. Veuillez réessayer ou
        retourner à l'accueil.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Réessayer
        </button>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" /> Accueil
        </a>
      </div>
    </div>
  </div>
);

export default GlobalErrorFallback;
