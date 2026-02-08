# Configuration Appwrite - Guide d'Installation

Ce document décrit les étapes pour configurer Appwrite comme backend du site.

---

## 1. Créer un Compte Appwrite

1. Rendez-vous sur [cloud.appwrite.io](https://cloud.appwrite.io)
2. Créez un compte gratuit ou connectez-vous
3. Créez un nouveau projet nommé "Vision Future School"

---

## 2. Récupérer les Identifiants

Dans la console Appwrite :

1. Allez dans **Settings** > **Overview**
2. Notez votre **Project ID**
3. L'endpoint est : `https://cloud.appwrite.io/v1`

---

## 3. Créer la Base de Données

### 3.1 Créer une Database

1. Allez dans **Databases**
2. Cliquez sur **Create Database**
3. Nom : `school_db`
4. Notez l'ID de la database

### 3.2 Créer les Collections

#### Collection 1 : `contact_submissions`

Cliquez sur **Create Collection** et configurez :

| Attribut | Type | Taille | Requis | Défaut |
|----------|------|--------|--------|--------|
| `reference` | String | 20 | ✅ | - |
| `firstName` | String | 100 | ✅ | - |
| `lastName` | String | 100 | ✅ | - |
| `email` | String | 255 | ✅ | - |
| `phone` | String | 20 | ❌ | - |
| `subject` | String | 200 | ✅ | - |
| `message` | String | 5000 | ✅ | - |
| `status` | String | 20 | ✅ | `new` |
| `adminNotes` | String | 2000 | ❌ | - |
| `processedAt` | String | 30 | ❌ | - |

**Indexes à créer :**
- `reference` (Unique)
- `status` (Key)
- `$createdAt` (Key, DESC)

**Permissions :**
- Create: `Any`
- Read: `Any`
- Update: `Any`
- Delete: `Users`

#### Collection 2 : `admission_submissions`

| Attribut | Type | Taille | Requis | Défaut |
|----------|------|--------|--------|--------|
| `reference` | String | 20 | ✅ | - |
| `studentFirstName` | String | 100 | ✅ | - |
| `studentLastName` | String | 100 | ✅ | - |
| `studentBirthdate` | String | 15 | ✅ | - |
| `studentGender` | String | 10 | ❌ | - |
| `currentSchool` | String | 200 | ❌ | - |
| `desiredClass` | String | 50 | ✅ | - |
| `parentFirstName` | String | 100 | ✅ | - |
| `parentLastName` | String | 100 | ✅ | - |
| `parentEmail` | String | 255 | ✅ | - |
| `parentPhone` | String | 20 | ✅ | - |
| `parentAddress` | String | 500 | ❌ | - |
| `relationship` | String | 50 | ❌ | - |
| `message` | String | 2000 | ❌ | - |
| `status` | String | 30 | ✅ | `new` |
| `adminNotes` | String | 2000 | ❌ | - |
| `publicNotes` | String | 1000 | ❌ | - |
| `processedAt` | String | 30 | ❌ | - |
| `interviewDate` | String | 30 | ❌ | - |

**Indexes à créer :**
- `reference` (Unique)
- `status` (Key)
- `$createdAt` (Key, DESC)

**Permissions :**
- Create: `Any`
- Read: `Any`
- Update: `Any`
- Delete: `Users`

#### Collection 3 : `status_history`

| Attribut | Type | Taille | Requis | Défaut |
|----------|------|--------|--------|--------|
| `submissionType` | String | 20 | ✅ | - |
| `submissionId` | String | 50 | ✅ | - |
| `oldStatus` | String | 30 | ❌ | - |
| `newStatus` | String | 30 | ✅ | - |
| `note` | String | 1000 | ❌ | - |

**Indexes à créer :**
- `submissionId` (Key)
- `submissionType` (Key)

**Permissions :**
- Create: `Any`
- Read: `Any`
- Update: `Users`
- Delete: `Users`

---

## 4. Configurer les Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=votre_project_id_ici
VITE_APPWRITE_DATABASE_ID=school_db
VITE_ADMIN_PASSWORD=votre_mot_de_passe_admin
```

> ⚠️ **Ne commitez jamais le fichier `.env` sur Git !**

---

## 5. Tester l'Installation

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Testez les fonctionnalités :
   - Allez sur `/contact` et soumettez un formulaire
   - Allez sur `/admissions` et soumettez une demande
   - Allez sur `/suivi` et recherchez avec la référence obtenue
   - Allez sur `/ecqm19` et connectez-vous avec le mot de passe admin

---

## 6. Déploiement sur Hostinger

### Build et upload

1. Lancez `npm run build` pour générer le dossier `dist/`
2. Recréez les fichiers serveur dans `dist/` : `.htaccess`, `_secure/`, `api/page-content/`
3. Uploadez le contenu de `dist/` sur Hostinger via le File Manager

### Configurer Appwrite pour la production

Dans Appwrite Console > Settings > Platforms :

1. Ajoutez votre domaine Hostinger (ex: `votre-domaine.com`)
2. Ajoutez aussi `localhost` pour le développement

---

## 7. Structure des Routes

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil | Public |
| `/contact` | Formulaire de contact | Public |
| `/admissions` | Formulaire d'admission | Public |
| `/suivi` | Suivi des demandes | Public |
| `/ecqm19` | Connexion admin | Public |
| `/ecqm19/dashboard` | Dashboard admin | Protégé |

---

## 8. Statuts Disponibles

### Contacts
- `new` : Nouveau message
- `in_progress` : En cours de traitement
- `processed` : Traité

### Admissions
- `new` : Nouvelle demande
- `under_review` : En cours d'examen
- `interview_scheduled` : Entretien programmé
- `approved` : Approuvée
- `rejected` : Rejetée
- `waitlist` : Liste d'attente

---

## 9. Mot de Passe Admin

Le mot de passe par défaut est défini dans `.env` via `VITE_ADMIN_PASSWORD`.

Pour le changer :
1. Modifiez la valeur dans `.env`
2. En production, mettez à jour le hash dans `dist/_secure/.htpasswd`
3. Re-uploadez sur Hostinger si nécessaire

> 🔐 Utilisez un mot de passe fort (12+ caractères, majuscules, chiffres, symboles)

---

## Support

Pour toute question ou problème :
- Documentation Appwrite : [appwrite.io/docs](https://appwrite.io/docs)
- Documentation Hostinger : [support.hostinger.com](https://support.hostinger.com)

---

*Dernière mise à jour : Janvier 2026*
