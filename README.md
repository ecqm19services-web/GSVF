# Collège Privé la Vision Future — Site Web

Site vitrine + back-office du **Collège Privé la Vision Future** (Grand-Bassam, Côte d'Ivoire).

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5 + Tailwind CSS + shadcn/ui |
| Backend | PHP 8 (API REST) — **aucun service externe** (ni Appwrite, ni Supabase) |
| Stockage | Fichiers JSON locaux (`data/`, `content/pages/`, `_secure/`) |

## Structure

```
server/           → backend PHP (copié dans dist/ au build)
├── api/          → endpoints (soumissions, admin, suivi, uploads, page-content)
├── _secure/      → authentification, opérateurs, rate-limit (interdit au web)
├── data/         → soumissions (contacts, admissions)
├── content/pages/ → contenus publiés depuis l'éditeur visuel
├── images/       → images uploadées
├── documents/    → PDF uploadés
└── backups/      → sauvegardes
src/              → code source React
public/           → assets statiques servis tels quels
dist/             → build de production (généré, gitignoré)
dist-deploy/      → paquet prêt pour Hostinger (généré, gitignoré)
scripts/          → utilitaires (build, déploiement, opérateurs)
```

## Commandes

```bash
npm install       # installer les dépendances
npm run dev       # serveur de développement (port 8080)
npm run build     # build + copie server/ → dist/
npm run deploy    # build + préparation dist-deploy/ pour Hostinger
npm run lint      # ESLint
```

## Administration

- Connexion : `/ecqm19-admin` (opérateurs `op01`…`opNN` — voir `scripts/bootstrap-admin-operators.cjs`)
- Éditeur visuel des pages, gestion des demandes (contacts/admissions), offres d'emploi,
  sauvegardes/restaurations, journal d'audit côté serveur.

## Déploiement (Hostinger)

1. `npm run deploy`
2. Uploader le contenu de `dist-deploy/` à la racine du site
3. Ne **jamais** supprimer `data/`, `images/`, `uploads/` déjà présents sur le serveur

Documentation complète : `DOCUMENTATION_CLIENT.md` (client) et `GUIDE_ADMINISTRATEUR.md` / `GUIDE_UTILISATEUR.md`.
