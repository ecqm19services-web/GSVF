# 🛠️ Guide Administrateur — Tableau de bord Vision Future

**À destination de :** Opérateurs du tableau de bord (personnel administratif)  
**Version :** 1.0 — Mai 2026

---

## 🔐 1. Connexion au tableau de bord

### Accéder à l'interface d'administration

Ouvrez votre navigateur et rendez-vous sur :

```
https://votre-site.com/ecqm19-admin
```

Saisissez votre **identifiant** (ex. : `op01`) et votre **mot de passe**, puis cliquez sur **"Se connecter"**.

### Première connexion

À la première connexion, vous êtes invité à **changer immédiatement votre mot de passe**. Ce changement est obligatoire.

Le nouveau mot de passe doit respecter les règles suivantes :
- Minimum **8 caractères**
- Au moins **1 lettre majuscule**
- Au moins **1 lettre minuscule**
- Au moins **1 chiffre**
- Ne pas être identique à l'un des **10 derniers mots de passe** utilisés

### Compte verrouillé ?

Après **10 tentatives de connexion échouées**, le compte est verrouillé pendant **30 minutes**.  
Un autre opérateur peut le déverrouiller manuellement depuis la section **Opérateurs** du tableau de bord.

---

## 🏠 2. Vue d'ensemble du tableau de bord

Après connexion, vous accédez au tableau de bord qui contient :

| Menu | Description |
|------|-------------|
| **Admissions** | Liste de toutes les demandes d'inscription reçues |
| **Contacts** | Liste de tous les messages reçus via le formulaire de contact |
| **Opérateurs** | Gestion des comptes administrateurs |
| **Offres d'emploi** | Gestion des offres publiées sur la page Carrières |
| **Éditeur Visuel** | Modifier le contenu des pages du site |
| **Sauvegarder le site** | Créer une sauvegarde ZIP du contenu |
| **Voir le site** | Ouvrir le site public dans un nouvel onglet |
| **Documentation** | Ce guide, accessible en ligne |

---

## 📥 3. Gestion des demandes d'admission

### Consulter les demandes

1. Cliquez sur **"Admissions"** dans le menu
2. La liste affiche toutes les demandes reçues avec leur statut actuel
3. Utilisez la **barre de recherche** pour filtrer par nom ou référence
4. Utilisez le **filtre de statut** pour afficher uniquement certaines demandes

### Mettre à jour le statut d'une demande

1. Cliquez sur l'icône 👁️ (Voir le détail) à droite de la demande
2. Dans le panneau de détail, choisissez le nouveau statut dans la liste :
   - `Nouveau`
   - `En cours d'examen`
   - `À l'étude`
   - `Entretien programmé`
   - `Accepté`
   - `Refusé`
   - `Archivé`
3. Ajoutez une note optionnelle (visible dans l'historique)
4. Cliquez sur **"Mettre à jour"**

> ℹ️ Le changement de statut est enregistré dans l'historique et visible par le demandeur via la page de suivi.

### Supprimer une demande

1. Cliquez sur l'icône 🗑️ à droite de la demande
2. Confirmez la suppression dans la boîte de dialogue

⚠️ **La suppression est irréversible.**

---

## 💬 4. Gestion des messages de contact

Le fonctionnement est identique à celui des admissions (section 3).

Les statuts disponibles pour les contacts :
- `Nouveau`
- `Lu`
- `En cours de traitement`
- `Répondu`
- `Archivé`

---

## ✏️ 5. Éditeur Visuel — Modifier le contenu du site

### Accéder à l'éditeur

1. Dans le menu latéral, cliquez sur **"Éditeur Visuel"**
2. Sélectionnez la page à modifier dans la liste déroulante

### Modifier une page

1. Cliquez sur **"Activer l'édition"** (bouton bleu en haut à droite)
2. La page s'affiche en mode édition — des bordures bleues entourent les éléments modifiables
3. **Cliquez sur un texte** pour le modifier directement
4. **Cliquez sur une image** pour la remplacer (un bouton "Changer l'image" apparaît)
5. Une fois vos modifications terminées, cliquez sur **"Terminer l'édition"**

✅ Les modifications sont **publiées immédiatement** sur le site public.

### Ajouter ou supprimer des éléments

En mode édition, des boutons **"+"** et **"🗑"** apparaissent à côté des listes d'éléments :

| Page | Éléments ajoutables / supprimables |
|------|------------------------------------|
| **Accueil** | Images du slider, résultats d'examens, liens du tableau d'honneur |
| **Équipe** | Membres de l'équipe pédagogique |
| **Programmes** | Cycles scolaires, points clés par cycle |
| **Actualités** | Articles, liens réseaux sociaux |
| **Emplois du Temps** | Classes, fichiers PDF |
| **Contact** | Lignes d'adresse, téléphones, emails, horaires |
| **Notre École / Histoire** | Entrées de la timeline |
| **Vision** | Valeurs, points d'engagement |
| **Excellence** | Distinctions, fiches alumni |

> ⚠️ Une confirmation est demandée avant toute suppression définitive.

### Uploader des fichiers

- **Images :** cliquez sur le bouton de remplacement d'image, sélectionnez un fichier JPG/PNG/WebP (max 10 Mo)
- **PDF :** disponible sur les pages Emplois du Temps et Carrières, cliquez sur le bouton PDF correspondant (max 15 Mo)

---

## 💼 6. Gestion des offres d'emploi

1. Dans le menu latéral, cliquez sur **"Offres d'emploi"**

### Créer une offre

1. Cliquez sur **"Nouvelle offre"**
2. Remplissez :
   - Le **titre** du poste
   - Un **résumé** (affiché dans la liste)
   - La **date limite** de candidature
   - Le **document PDF** (appel d'offre officiel)
3. Définissez le statut : `Publiée` pour la rendre visible, `Fermée` pour la masquer
4. Cliquez sur **"Enregistrer"**

### Modifier ou fermer une offre

- Cliquez sur l'icône ✏️ pour modifier une offre existante
- Passez le statut à `Fermée` pour la retirer du site sans la supprimer

---

## 👥 7. Gestion des opérateurs

> Cette section est accessible depuis l'onglet **"Opérateurs"** du tableau de bord.

### Créer un nouvel opérateur

1. Cliquez sur **"Créer un opérateur"**
2. Un identifiant est attribué automatiquement (`op01` à `op10`)
3. Un **mot de passe temporaire** est généré et affiché — **notez-le immédiatement**, il ne sera plus visible ensuite
4. Communiquez cet identifiant et ce mot de passe à la personne concernée

> L'opérateur devra changer son mot de passe à sa première connexion.

### Activer / Désactiver un compte

- Cliquez sur le bouton **"Activer"** ou **"Désactiver"** à côté du compte concerné
- Un compte désactivé ne peut plus se connecter

### Réinitialiser un mot de passe

1. Cliquez sur **"Réinitialiser le mot de passe"**
2. Un nouveau mot de passe temporaire est généré et affiché
3. Communiquez ce mot de passe à l'opérateur concerné

### Déverrouiller un compte bloqué

Si un opérateur est bloqué suite à trop de tentatives de connexion :
1. Cliquez sur **"Déverrouiller"** à côté de son compte
2. Le compte est immédiatement débloqué

---

## 💾 8. Sauvegardes et restauration

### Créer une sauvegarde

1. Dans le menu latéral, cliquez sur **"Sauvegarder le site"**  
   — ou depuis le tableau de bord, section **"Sauvegarde et restauration"**
2. Cliquez sur **"Sauvegarder maintenant"**
3. Le système génère un fichier ZIP avec tout le contenu du site
4. La sauvegarde est stockée sur le serveur

> ✅ **Bonne pratique :** Faites une sauvegarde avant toute modification importante.

### Restaurer une sauvegarde

Depuis la section **"Restaurer maintenant"** du tableau de bord :

#### Niveau A — Restauration du contenu uniquement
- Restaure : pages, articles, offres d'emploi, galeries
- **N'affecte pas** : comptes opérateurs, configuration serveur
- Confirmation requise : tapez `RESTAURER-A`

#### Niveau B — Restauration complète
- Restaure **tout** le site (contenu + configuration)
- Requiert un **code développeur** en plus de la confirmation
- À utiliser uniquement en cas de problème grave
- Contactez le développeur avant d'utiliser ce niveau

> ⚠️ **Attention :** Une restauration de niveau B peut réinitialiser les comptes opérateurs. Sauvegardez d'abord.

---

## 📊 9. Résumé des actions disponibles

| Action | Accès |
|--------|-------|
| Voir les demandes d'admission | Onglet Admissions |
| Voir les messages de contact | Onglet Contacts |
| Changer le statut d'une demande | Détail de la demande → Statut |
| Ajouter une note à une demande | Détail de la demande → Note |
| Modifier une page du site | Éditeur Visuel |
| Uploader une image | Éditeur Visuel → Clic sur image |
| Uploader un PDF | Page Emplois du Temps ou Carrières |
| Publier un article | Éditeur Visuel → Page Actualités |
| Publier une offre d'emploi | Menu → Offres d'emploi |
| Créer un opérateur | Onglet Opérateurs |
| Réinitialiser un mot de passe | Onglet Opérateurs → Réinitialiser |
| Créer une sauvegarde | Menu → Sauvegarder le site |
| Restaurer une sauvegarde | Tableau de bord → Restaurer maintenant |

---

## ⚠️ 10. Bonnes pratiques

- **Ne partagez jamais** vos identifiants avec une autre personne
- **Chaque opérateur** doit avoir son propre compte
- **Sauvegardez** avant toute modification importante du contenu
- **Déconnectez-vous** après chaque session (bouton "Déconnexion" en bas du menu)
- En cas de doute sur une action, **contactez le développeur** avant de procéder

---

## 📞 Support technique

En cas de problème technique ou de question non couverte par ce guide :

**Développeur :** M. ESSOH Cyrille — ic_future / Hfablab  
**Email :** ic.future16@gmail.com  
**Téléphone :** +225 07 77 17 24 08  

Précisez toujours :
1. La nature du problème rencontré
2. La page ou section concernée
3. Un message d'erreur éventuel (capture d'écran bienvenue)

---

*© 2026 Collège Privé la Vision Future — Document réservé à l'usage interne*
