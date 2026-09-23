import { siteConfig } from '@/data/content';

/**
 * Métadonnées SEO par route publique.
 * Le site est une SPA : on applique titre/description/canonical/OG
 * dynamiquement à chaque navigation (voir SeoHead).
 */
export interface RouteMeta {
  title: string;
  description: string;
  /** true pour bloquer l'indexation (routes admin, etc.) */
  noindex?: boolean;
}

const BASE = siteConfig.name;

const PUBLIC_META: Record<string, RouteMeta> = {
  '/': {
    title: `${BASE} — L'excellence, notre devise`,
    description: `${BASE}, établissement scolaire à Grand-Bassam (Côte d'Ivoire) : maternelle, primaire et secondaire dans un cadre d'excellence et d'épanouissement.`,
  },
  '/notre-ecole': {
    title: `Notre École — ${BASE}`,
    description: `Découvrez ${BASE} : notre histoire, notre vision et nos valeurs éducatives à Grand-Bassam.`,
  },
  '/vision': {
    title: `Notre Vision — ${BASE}`,
    description: `La vision et la mission pédagogiques de ${BASE}.`,
  },
  '/histoire': {
    title: `Notre Histoire — ${BASE}`,
    description: `L'histoire de ${BASE}, depuis sa création en ${siteConfig.founded}.`,
  },
  '/equipe': {
    title: `Notre Équipe — ${BASE}`,
    description: `L'équipe pédagogique et administrative de ${BASE}.`,
  },
  '/programmes': {
    title: `Programmes — ${BASE}`,
    description: `Les programmes scolaires de ${BASE}, de la maternelle au lycée.`,
  },
  '/emplois-du-temps': {
    title: `Emplois du temps — ${BASE}`,
    description: `Consulter les emplois du temps des classes de ${BASE}.`,
  },
  '/visite': {
    title: `Visite virtuelle — ${BASE}`,
    description: `Visitez les installations de ${BASE} : salles, bibliothèque, cantine, espace sportif.`,
  },
  '/admissions': {
    title: `Admissions — ${BASE}`,
    description: `Procédure d'admission et dossier de demande d'inscription à ${BASE}.`,
  },
  '/actualites': {
    title: `Actualités — ${BASE}`,
    description: `Toutes les actualités et informations de la vie de ${BASE}.`,
  },
  '/carrieres': {
    title: `Carrières — ${BASE}`,
    description: `Offres d'emploi et opportunités de carrière au sein de ${BASE}.`,
  },
  '/carrieres/candidature': {
    title: `Candidature — ${BASE}`,
    description: `Déposer une candidature pour une offre d'emploi à ${BASE}.`,
  },
  '/contact': {
    title: `Contact — ${BASE}`,
    description: `Contacter ${BASE} : adresse, téléphone ${siteConfig.phone} et e-mail ${siteConfig.email}.`,
  },
  '/mentions-legales': {
    title: `Mentions légales — ${BASE}`,
    description: `Mentions légales de ${BASE}.`,
  },
  '/confidentialite': {
    title: `Politique de confidentialité — ${BASE}`,
    description: `Politique de protection des données personnelles de ${BASE}.`,
  },
  '/suivi': {
    title: `Suivi de demande — ${BASE}`,
    description: `Suivez l'avancement de votre demande d'admission ou de contact ${BASE} à l'aide de votre référence.`,
  },
};

/** Résout les métadonnées d'un chemin (alias /notre-ecole gérés). */
export function getMetaForPath(pathname: string): RouteMeta {
  if (PUBLIC_META[pathname]) return PUBLIC_META[pathname];

  // Routes admin : ne jamais indexer.
  if (pathname.startsWith('/vision-admin') || pathname.startsWith('/admin')) {
    return {
      title: `Espace administration — ${BASE}`,
      description: 'Espace réservé à l’administration.',
      noindex: true,
    };
  }

  // 404 / inconnu.
  return {
    title: `${BASE}`,
    description: PUBLIC_META['/'].description,
  };
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Applique les métadonnées SEO au document courant. */
export function applySeo(pathname: string): void {
  const meta = getMetaForPath(pathname);
  document.title = meta.title;

  setMeta('name', 'description', meta.description);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);

  // URL canonique : origine réelle + chemin (exact quel que soit le domaine).
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = `${origin}${pathname === '/' ? '/' : pathname}`;
  setLink('canonical', canonical);
  setMeta('property', 'og:url', canonical);

  setMeta('name', 'robots', meta.noindex ? 'noindex,nofollow' : 'index,follow');
}
