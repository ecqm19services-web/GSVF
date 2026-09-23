import React from 'react';
import { Wrench, Sparkles, Hammer, Paintbrush } from 'lucide-react';
import { siteConfig } from '@/data/content';

interface MaintenancePageProps {
  message?: string;
}

const MaintenancePage: React.FC<MaintenancePageProps> = ({ message }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Éléments décoratifs colorés */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-pulse" />
      <div className="absolute top-20 right-16 w-14 h-14 bg-orange-400/20 rounded-full animate-bounce" />
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-blue-500/20 rounded-full animate-bounce" />

      {/* Logo en arrière-plan, grand et très transparent */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/logo-vf.svg"
          alt=""
          className="w-[85vw] h-[85vw] max-w-[900px] max-h-[900px] object-contain opacity-10"
        />
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Icônes de maintenance */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce">
            <Hammer className="w-8 h-8 text-white" />
          </div>
          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse">
            <Paintbrush className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Nous faisons peau neuve
        </h1>

        {/* Sous-titre */}
        <p className="text-slate-600 text-lg mb-8">
          Notre site est en cours de transformation pour mieux vous servir.
        </p>

        {/* Message personnalisé */}
        {message && (
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          </div>
        )}

        {/* Info contact */}
        <div className="space-y-3 text-slate-500 text-sm">
          <p className="font-medium text-slate-600">Nous serons de retour très bientôt !</p>
          <p className="text-slate-400">
            Contact : {siteConfig.email} | {siteConfig.phone}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-xs">
            © 2026 Collège Privé la Vision Future — Grand-Bassam, Côte d'Ivoire
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
