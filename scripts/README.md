# Scripts de configuration Appwrite

## setup-appwrite-collection.js

Script automatique pour créer la collection `site_pages` dans Appwrite avec tous les attributs et permissions nécessaires.

### Prérequis

1. Avoir installé les dépendances : `npm install`
2. Avoir configuré les variables d'environnement

### Configuration

Crée un fichier `.env.local` à la racine du projet avec :

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=ton_project_id
APPWRITE_API_KEY=ton_api_key
APPWRITE_DATABASE_ID=ton_database_id
```

**Où trouver ces valeurs ?**

- `APPWRITE_PROJECT_ID` : Appwrite Console → Settings → Project ID
- `APPWRITE_API_KEY` : Appwrite Console → Settings → API Keys (celle nommée "GSVF")
- `APPWRITE_DATABASE_ID` : Appwrite Console → Databases → Vision Future School DB → copie l'ID

### Utilisation

```bash
npm run setup:appwrite
```

### Ce que fait le script

1. ✅ Crée la collection `site_pages`
2. ✅ Ajoute l'attribut `page` (string, 100 caractères, requis)
3. ✅ Ajoute l'attribut `content` (string, 1 million de caractères, requis)
4. ✅ Crée un index unique sur `page` pour éviter les doublons
5. ✅ Configure les permissions : lecture publique (Role.any())

### En cas d'erreur

**"La collection existe déjà"** : Supprime-la d'abord dans Appwrite Console si tu veux la recréer.

**"Variables d'environnement manquantes"** : Vérifie que ton fichier `.env.local` contient toutes les variables requises.

**"Unauthorized"** : Vérifie que ton API Key a les permissions Database (read/write).

### Après l'exécution

Teste l'API :
```
https://cpvf.netlify.app/api/page-content?page=accueil
```

Tu devrais avoir `404` (normal, aucun document créé) au lieu de `500 Unauthorized`.
