# ✅ Vérification finale — Enrichissement du site avec les visuels réels (`img_insp`)

> Document de contrôle pour la **vérification manuelle avant livraison**.
> Il liste tout ce qui a été appliqué, et surtout **les points d'attention à valider dans les moindres détails**.

## 0. Sauvegarde de sécurité
- 📦 **Sauvegarde ZIP créée avant toute modification** : `backup-projet-20261002-170211.zip` (racine du projet, 19,5 Mo, 241 entrées, validée intègre).
- Elle est **exclue de Git** (motif `backup-projet-*.zip` ajouté au `.gitignore`).
- Pour revenir en arrière : restaurer le contenu de ce ZIP.

## 1. Ce qui a été appliqué (résumé)
| Zone | Action |
|---|---|
| **Accueil — carrousel (hero)** | 4 vraies photos : façade officielle, cour intérieure, élèves scouts, espace sportif |
| **Accueil — bannière** | Cour intérieure réelle du collège |
| **Accueil — galerie « Vie scolaire »** | 16 photos **réelles et distinctes** (remplace les doublons) |
| **Accueil — bloc Excellence** | Tableau d'honneur + cartes résultats → remises de prix / concours / cérémonies réels |
| **Accueil — infos pratiques** | Photo élèves en tenue réelle |
| **Actualités (accueil)** | Image → « Journée de l'Excellence » (réelle) |
| **Visite virtuelle (6 zones)** | Entrée, classes, robotique/info, sciences, sport, restauration → **vraies salles** (informatique, labo chimie, atelier cuisine, bâtiment, terrain) |
| **Programmes (4 cycles)** | Maternelle, Primaire, Collège, Lycée → photos réelles |
| **Admissions — tenues** | 2 nouvelles photos d'uniformes réels (groupe + détail) |
| **Excellence — anciens** | Images de cérémonie réelles (les noms restent à saisir, cf. §3) |
| **Mots-clé / SEO (`index.html`)** | `og:image`, `twitter:image`, image JSON-LD → façade réelle |
| **Coordonnées** | E-mail + adresse alignés sur les documents officiels (cf. §2, **à confirmer**) |

**Contrôles techniques passés** : TypeScript `OK (0 erreur)` · `npm run build` `OK` · `dist-deploy` régénéré (117 fichiers, dont 47 images) · **31 références d'images vérifiées, 0 manquante**.

> 🔁 **Rappel important** : toutes ces images et tous ces textes restent **modifiables directement en ligne** via l'éditeur d'administration (mode édition → clic sur l'image/le texte). Rien n'exige de repasser par le code.

---

## 2. 🚨 À VÉRIFIER EN PRIORITÉ — Informations (j'ai appliqué les valeurs des documents officiels)

Ces informations proviennent des **affiches officielles** fournies. Je les ai appliquées, **mais elles doivent être confirmées par l'école** car elles sont visibles partout (et l'e-mail est utilisé par le site entier).

| Champ | Valeur **appliquée** | Source | ⚠️ À confirmer |
|---|---|---|---|
| **E-mail** | `visionfutureschool@gmail.com` | Affiche « Inscription & Réinscription » | ✅ Est-ce **la** bonne adresse ? (l'ancien site utilisait `visionfuture@gmail.com`) |
| **Adresse** | `Quartier Modeste, Route de Bassam, Grand-Bassam` | Affiches (LIEU : Modeste / Route de Bassam) | ✅ Libellé exact à valider (l'ancien était « Boulevard de la République ») |
| **Téléphone standard** | `+225 27 21 29 39 83` | Affiche (2721293983) | ✔️ Cohérent, inchangé |
| **2ᵉ ligne Contact** | `+225 05 54 20 35 44` | (déjà en place) | ⚠️ L'affiche indique `055420354` (chiffre manquant ?) → **vérifier le numéro complet** |
| **WhatsApp** | *non ajouté* | Affiche : `0777972938` | 💡 Option : l'ajouter sur la page Contact ? (à valider) |
| **Devise** | *non modifiée* : « L'excellence, Notre devise » | Bâtiment & affiches : **« Rigueur · Discipline · Travail »** | 💡 Remplacer la devise ? (fortement suggéré par les visuels réels) |

> Où changer tout ça en un seul endroit : `src/data/content.ts` → `siteConfig` (e-mail, téléphone, adresse). La devise est dans `homeContent.hero.subtitle` et `footerContent.about.tagline`.

⚠️ **Ne pas confondre** : le numéro `+225 07 77 17 24 08` présent dans l'espace **administration** est un **numéro de développeur**, pas un contact de l'école — il ne doit pas être publié.

---

## 3. ⛔ Page « Équipe pédagogique » — NON touchée volontairement (contenu fictif)
- Les **8 membres actuels sont 100 % fictifs** : noms inventés (M. Kouamé Yao, Mme Awa Traoré…) **et** « photos » = bâtiments/salles.
- **Aucun vrai portrait individuel** n'était disponible dans `img_insp` (les photos de personnes sont des **groupes en cérémonie**, pas des portraits) → je n'ai **pas** mis de photo trompeuse.
- 👉 **L'école doit fournir** : vrais noms, vraies fonctions, et **vraies photos d'identité** de chaque membre.
- Les emplacements sont déjà éditables en ligne (page Équipe, mode édition) : `photo`, `name`, `title`, `description`.
- Tant que ce n'est pas remplacé, **ne pas livrer cette page telle quelle** (règle : pas de contenu fictif à la livraison).

---

## 4. Images écartées / disponibles non utilisées (à arbitrer)
**Écartées volontairement :**
- `persnnel/*` : cérémonies de **groupe** (personnel à badges) — inutilisables comme portraits individuels.
- **Doublons** : fichiers suffixés « (1) » et les variantes robotique au nom corrompu (`…gg…`, `…ff…`, `…hh…`) — copies quasi identiques.
- Plusieurs `boss/*` (autres cérémonies) — non nécessaires.

**Copiées mais NON encore placées (slot disponible si tu valides) :**
- `public/images/home/banniere_inscription.png` → l'affiche « INSCRIPTION & REINSCRIPTION ». Peut servir de **bandeau d'inscription** sur la page Admissions ou en « Une ». Dispo, en attente de ton feu vert.

**Fondateur :**
- J'ai **conservé** le portrait actuel (`Fondateur_CPVF.png`) pour le « Mot du fondateur ».
- La photo **Fondateur + trophée « Meilleure Institution »** est utilisée dans la galerie (`fondateur/fondateur_trophee.jpg`). 💡 Tu peux l'échanger contre le portrait si tu préfères.

---

## 5. Qualité / performance (optionnel)
- Les images ont été copiées **en résolution d'origine** (certaines > 2000 px). C'est correct, mais pour un site plus léger, on peut **redimensionner/compresser** les grandes photos (surtout `campus_*`, `eleves_*`, `actu_*`).
- Dis-moi si tu veux une passe d'optimisation (je peux générer des versions web allégées).

---

## 6. Comment vérifier toi-même
**A) En local (aperçu rapide)**
```
npm run dev      # puis ouvre l'URL affichée (dev)
# ou, après build :
npm run preview
```
Parcours conseillé : Accueil (carrousel + galerie + excellence + actus) → Visite (6 zones) → Programmes → Admissions (tenues) → Contact (coordonnées) → **Équipe** (pour bien voir le contenu fictif restant).

**B) En ligne (après déploiement)**
- Mode édition admin (`/vision-admin`) : survole n'importe quelle image/texte pour la modifier sans code.

**C) Contrôle des infos**
- Page Contact + pied de page : e-mail, téléphone, adresse → cf. §2.

---

## 7. Déploiement (Hostinger)
- `dist-deploy/` est **régénéré et prêt**.
- ⚠️ À l'upload : **ne PAS supprimer** les dossiers `data/` et `images/` déjà présents sur le serveur (données réelles + images uploadées par l'admin). Le paquet **ajoute** les nouvelles images sans écraser les uploads existants.
- Push GitHub : **en attente de ton instruction explicite** (rien n'a été poussé automatiquement).

---

## Mémo — Correspondance visuels (destination ← fichier source `img_insp`)
- Façade « Collège Privé La Vision Future » ← `ecole/641156252…` → `accueil/campus_facade.jpg`
- Cour intérieure (blocs A/B, drapeau) ← `ecole/482984418…` → `accueil/campus_cour.jpg`
- Terrain + fresque « Escrime/Foot » ← `ecole/784796582…` → `accueil/campus_sport.jpg`
- Salle informatique (écrans) ← `robotique/…12.34.59` & `…12.35.01` → `visite/salle_info(_2).jpg`
- Laboratoire chimie (casiers/verrerie) ← `loboratoire/480784875…` & `480589904…` → `visite/labo_chimie(_2).jpg`
- Atelier cuisine (élèves en toques) ← `bubliotheque/633869043…` & `480443441…` → `visite/atelier_cuisine(_2).jpg` *(le dossier s'appelait « bubliotheque » mais c'est de la cuisine)*
- Remise de prix / diplômes / concours ← `evenement/547218664…`, `658274702…`, `634237448…`, `548769544…` → `excellence/*.jpg`
- Journée de l'Excellence, Noël, campagne Zéro Grossesse, 1er Mai ← `evenement/*` & `affiche/*` → `home/actu_*.jpg`
- Élèves en uniformes / scouts ← `car/629682643…`, `marci grad/*` → `accueil/eleves_*.jpg`, `admissions/tenues_*.jpg`
- Fondateur + trophée ← `boss/WhatsApp …07.42.55` → `fondateur/fondateur_trophee.jpg`
