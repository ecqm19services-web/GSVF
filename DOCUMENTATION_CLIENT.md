# 📚 Documentation - Collège Privé la Vision Future

**Site Web Administrable** - Version 1.0  
**Date de livraison :** Mai 2026  
**Développé par :** M. ESSOH Cyrille  *by ic_future*

---

## 🎯 Vue d'ensemble

Ce projet est un **site web complet et administrable** pour le Collège Privé la Vision Future. Il offre :

- **14 pages** éditables via une interface visuelle
- **Gestion des admissions** avec formulaires et suivi
- **Gestion des offres d'emploi** (carrières)
- **Tableau de bord admin** sécurisé avec multi-opérateurs
- **Sauvegardes et restauration** de données
- **Édition en temps réel** sans redéploiement

---

## 🏗️ Architecture Technique

### Stack
| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Backend** | PHP (API REST) |
| **Base de données** | Appwrite (cloud) + fichiers JSON (local) |
| **Authentification** | HTTP Basic Auth + sessionStorage |
| **Build** | Vite |

### Structure des dossiers
```
Site_VF26/
├── src/                    # Code source React
│   ├── components/pages/   # Contenu des pages (14 pages)
│   ├── pages/admin/       # Interface d'administration
│   └── data/content.ts    # Données par défaut
├── server/                # Backend PHP
│   ├── api/              # Endpoints API
│   │   ├── suivi/        # API de suivi des demandes
│   │   ├── page-content/ # Gestion du contenu éditable
│   │   ├── admin-*/      # APIs admin
│   │   └── upload-*/     # Upload fichiers
│   └── _secure/          # Fichiers sensibles (.htaccess protégé)
├── dist/                 # Build de production (déployer)
└── server/content/pages/ # Contenu JSON sauvegardé
```

---

## 🚀 Installation & Déploiement

### Prérequis
- **Hébergement** avec PHP 8.1+ et Apache/Nginx
- **Node.js** 18+ (pour le build)
- **Compte Appwrite** (cloud ou auto-hébergé)

### Étapes de déploiement

#### 1. Configuration Appwrite
```
1. Créer un projet Appwrite
2. Créer une base de données "cpvf"
3. Créer les collections :
   - admission_submissions
   - contact_submissions
   - admission_status_history
   - contact_status_history
   - site_pages (legacy, optionnel)
   - careers_offers (pour les emplois)

4. Configurer les permissions en lecture/écriture pour l'API key
```

#### 2. Configuration serveur
Créer le fichier `server/_secure/appwrite-config.php` :

```php
<?php
return [
    'endpoint' => 'https://cloud.appwrite.io/v1',  // ou votre instance
    'projectId' => 'VOTRE_PROJECT_ID',
    'apiKey' => 'VOTRE_API_KEY',
    'databaseId' => 'cpvf',
    'admissionSubmissionsCollectionId' => 'admission_submissions',
    'contactSubmissionsCollectionId' => 'contact_submissions',
    'admissionStatusHistoryCollectionId' => 'admission_status_history',
    'contactStatusHistoryCollectionId' => 'contact_status_history',
];
```

#### 3. Build et déploiement
```bash
# Installer les dépendances
npm install

# Build de production
npm run build

# Déployer le dossier dist/ sur votre hébergement
```

Le dossier `dist/` contient :
- Le site React compilé
- Le backend PHP (copie de `server/`)
- Tous les assets

---

## 🔐 Accès Administrateur

### Connexion au tableau de bord
- **URL :** `https://votre-site.com/ecqm19-admin`
- **Identifiants par défaut :** Voir fichier `server/_secure/acces-operateurs.csv`

### Gestion des opérateurs
Le tableau de bord permet de gérer jusqu'à **10 opérateurs** (`op01` à `op10`).

**Actions disponibles :**
- ✅ Créer un nouvel opérateur (mot de passe généré automatiquement)
- ✅ Activer/Désactiver un compte
- ✅ Réinitialiser un mot de passe
- ✅ Débloquer un compte après trop de tentatives

**Sécurité des mots de passe :**
- Minimum 8 caractères
- Au moins 1 majuscule, 1 minuscule, 1 chiffre
- Historique des 10 derniers mots de passe (interdiction de réutilisation)
- **Verrouillage** après 10 échecs pendant 30 minutes
- Changement obligatoire à la première connexion

---

## 🎨 Édition du Contenu

### Mode Édition Visuelle
1. Se connecter au tableau de bord
2. Cliquer sur **"Éditeur Visuel"**
3. Sélectionner la page à modifier dans la liste
4. Cliquer sur **"Activer l'édition"**
5. Modifier directement les textes/images sur la page
6. Cliquer sur **"Terminer l'édition"** pour sauvegarder

### Pages éditables (15 pages)
| Page | Contenu modifiable |
|------|-------------------|
| **Accueil** | Slider, résultats examens, tableau d'honneur, liens parents, infos pratiques |
| **Visite** | Galeries photos, descriptions |
| **Notre École** | Timeline histoire, valeurs, fondateur |
| **Histoire** | Timeline détaillée, événements marquants |
| **Vision** | Valeurs, points d'engagement |
| **Excellence** | Distinctions, résultats examens, alumni |
| **Équipe** | Membres de l'équipe pédagogique (ajout/suppression) |
| **Programmes** | Cycles, descriptions, points clés (ajout/suppression cycles) |
| **Admissions** | Tarifs (masquable), étapes, documents |
| **Actualités** | Articles (ajout/suppression/modification), réseaux sociaux |
| **Emplois du Temps** | Classes, PDF par classe (ajout/suppression) |
| **Contact** | Coordonnées, horaires, emails, téléphones (ajout/suppression lignes) |
| **Carrières** | Offres d'emploi (créées via "Gestion des emplois") |
| **Mentions Légales** | Texte complet |
| **Confidentialité** | Texte complet |

### Upload de fichiers
- **Images :** JPG, PNG, WebP (max 10 Mo)
- **Documents :** PDF (max 15 Mo)

---

## 💼 Gestion des Admissions & Contacts

### Tableau de bord Admin
L'onglet **"Demandes"** permet de :
- 📥 Voir toutes les demandes d'admission et messages
- 🔍 Filtrer par statut (Nouveau, En cours, Traité, etc.)
- 📝 Modifier le statut avec ajout de notes
- 👁️ Consulter les détails complets
- 🗑️ Supprimer une demande (avec confirmation)

### Suivi client
Les visiteurs peuvent suivre leurs demandes via :  
**URL :** `https://votre-site.com/suivi`

Format des références :
- **Contact :** `CONT-2026-XXXX`
- **Admission :** `ADM-2026-XXXX`

---

## 💾 Sauvegardes & Restauration

### Créer une sauvegarde
1. Dans le tableau de bord, section **"Sauvegarde"**
2. Cliquer sur **"Créer une sauvegarde"**
3. Un fichier ZIP est généré avec tout le contenu

### Restaurer une sauvegarde
Deux niveaux de restauration :

**Niveau A - Contenu éditable uniquement**
- Restaure les pages, articles, offres d'emploi
- Confirmation simple requise

**Niveau B - Restauration complète**
- Restaure TOUT : contenu + configuration système
- Nécessite un **code développeur** (format hex basé sur la date)
- À n'utiliser qu'en cas de problème majeur

⚠️ **Important :** Toujours créer une sauvegarde avant toute restauration.

---

## 📱 Réseaux Sociaux (Actualités)

La page **Actualités** permet d'intégrer :
- ✅ Facebook Page
- ✅ Instagram
- ✅ YouTube
- ✅ LinkedIn
- ✅ TikTok

**Configuration :**
1. Aller dans l'éditeur visuel → page Actualités
2. Activer l'édition
3. Activer/désactiver les réseaux souhaités
4. Saisir les URLs de chaque page
5. Sauvegarder

---

## 🔧 Maintenance Courante

### Mise à jour du contenu
```bash
# Modifier le contenu via l'éditeur visuel
# OU modifier src/data/content.ts puis rebuild

npm run build
# Redéployer dist/
```

### Ajouter un opérateur
1. Connectez-vous avec un compte existant
2. Aller dans **"Gestion des opérateurs"**
3. Cliquer **"Créer un opérateur"**
4. Noter le mot de passe temporaire affiché

### Réinitialiser un mot de passe perdu
1. Connectez-vous avec un autre opérateur
2. Aller dans **"Gestion des opérateurs"**
3. Cliquer **"Réinitialiser le mot de passe"** sur le compte concerné
4. Communiquer le nouveau mot de passe temporaire

---

## ❓ FAQ

**Q : Puis-je ajouter plus de 10 opérateurs ?**  
R : Non, la limite est fixée à 10 pour des raisons de sécurité.

**Q : Les modifications sont-elles immédiates ?**  
R : Oui, dès que vous cliquez sur "Terminer l'édition", les changements sont visibles sur le site.

**Q : Que se passe-t-il si j'oublie le mot de passe admin ?**  
R : Un autre opérateur peut réinitialiser votre mot de passe. En cas de blocage total, contactez le développeur.

**Q : Puis-je modifier les couleurs du site ?**  
R : Oui, via le fichier `tailwind.config.ts` puis rebuild. La couleur principale actuelle est le bleu (#434a7a) et l'orange pour les accents.

**Q : Le site fonctionne-t-il hors ligne ?**  
R : Non, il nécessite une connexion Internet pour charger les données dynamiques depuis Appwrite.

**Q : Où sont stockées les sauvegardes ?**  
R : Dans `server/backups/` (accessible uniquement via l'API admin, pas en URL directe grâce au .htaccess).

---

## 📞 Support & Contact

**Développeur :** ic_future  
**Email client :** contact@lavisionfuture.ci  
**Téléphone :** +225 27 21 29 39 83

Pour toute question technique ou demande d'évolution :
1. Consulter cette documentation
2. Vérifier les logs dans `server/_secure/admin-audit.log`
3. Contacter le développeur avec le contexte et les erreurs éventuelles

---

## 📝 Checklist de Livraison

- [x] Site fonctionnel avec 14+ pages
- [x] Tableau de bord admin sécurisé (multi-opérateurs)
- [x] Éditeur visuel complet (15 pages éditables)
- [x] Gestion des admissions avec suivi
- [x] Gestion des offres d'emploi
- [x] Sauvegardes et restauration (2 niveaux)
- [x] API de suivi pour les visiteurs
- [x] Upload de fichiers (images, PDF)
- [x] Intégration réseaux sociaux
- [x] Responsive (mobile/tablette/desktop)
- [x] SEO optimisé (balises meta, sitemap)
- [x] Pages légales (Mentions, Confidentialité)
- [x] Fichier des accès opérateurs généré
- [x] Documentation complète

---

**Document version :** 1.0  
**Dernière mise à jour :** Mai 2026

© 2026 Collège Privé la Vision Future - Tous droits réservés
