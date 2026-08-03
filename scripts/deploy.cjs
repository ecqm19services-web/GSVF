/**
 * Script de préparation pour mise en ligne sur Hostinger
 *
 * Génère un dossier dist-deploy/ SÉCURISÉ qui contient :
 *   ✅ assets/      → le nouveau code JS/CSS (écrase l'ancien)
 *   ✅ api/         → les nouvelles APIs PHP (écrase l'ancien)
 *   ✅ _secure/     → les fichiers d'auth (écrase l'ancien)
 *   ✅ index.html   → la nouvelle page d'entrée
 *   ✅ .htaccess    → les règles de routage
 *   ✅ logo-vf.svg  → le logo
 *
 * PROTÈGE (n'écrase JAMAIS) :
 *   🛡️ data/        → contacts.json, admissions.json (données utilisateurs réelles)
 *   🛡️ images/      → images uploadées par l'admin (ne supprime rien)
 *   🛡️ uploads/     → documents uploadés (si présent)
 *
 * UTILISATION :
 *   1. `npm run build`           → génère le dist/ complet
 *   2. `node scripts/deploy.cjs` → crée dist-deploy/ (sans les données sensibles)
 *   3. Uploader le contenu de dist-deploy/ sur Hostinger
 *      ⚠️ NE PAS supprimer data/ et images/ existants sur le serveur !
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const DEPLOY_DIR = path.join(ROOT, 'dist-deploy');

// Dossiers/fichiers à NE JAMAIS déployer (données live)
const SKIP = new Set([
  'data',        // contacts.json, admissions.json (soumissions utilisateurs)
  'images',      // images uploadées par l'admin
  'uploads',     // documents uploadés
  'backups',     // sauvegardes
  'logs',        // logs serveur
  'acces-operateurs.csv',   // identifiants opérateurs (à transmettre hors-ligne)
  'acces-operateurs.xlsx',  // identifiants opérateurs (à transmettre hors-ligne)
]);

// Nettoyer l'ancien déploiement
if (fs.existsSync(DEPLOY_DIR)) {
  fs.rmSync(DEPLOY_DIR, { recursive: true });
}
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

function copySafe(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const name = path.basename(src);

    // ⚠️ Ne jamais copier les dossiers de données live
    if (SKIP.has(name)) {
      console.log(`  🛡️  Saut (données live) : ${name}/`);
      return;
    }

    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copySafe(path.join(src, child), path.join(dest, child));
    }
  } else {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    // Vérifier si un dossier parent est dans SKIP
    const relPath = path.relative(DIST_DIR, src);
    const parts = relPath.split(path.sep);
    if (parts.some(p => SKIP.has(p))) {
      return;
    }

    fs.copyFileSync(src, dest);
  }
}

// Copier tout dist/ vers dist-deploy/ en sautant data/ et images/
console.log('\n📦 Préparation du déploiement...\n');
copySafe(DIST_DIR, DEPLOY_DIR);

// Ajouter un README dans dist-deploy/
const readme = `# DÉPLOIEMENT SÉCURISÉ

⚠️  INSTRUCTIONS IMPORTANTES POUR LA MISE EN LIGNE :

1. Connectez-vous à votre hébergement Hostinger (FTP ou gestionnaire de fichiers)

2. Uploadez TOUS les fichiers de ce dossier vers la racine du site

3. ⚠️  IMPORTANT : Ne supprimez PAS les dossiers suivants sur le serveur :
   - data/      → contient les soumissions des utilisateurs (contacts, admissions)
   - images/    → contient les images uploadées par l'administration
   - uploads/   → contient les documents uploadés

4. Si le gestionnaire FTP vous demande "Écraser ?" pour des fichiers, répondez OUI
   (sauf pour data/ et images/ si vous les avez sélectionnés par erreur)

5. Après l'upload, videz le cache de votre navigateur (Ctrl+F5)

✅ Les données des utilisateurs sont protégées.
✅ Les modifications de l'admin (couleurs, textes) sont préservées.
`;

fs.writeFileSync(path.join(DEPLOY_DIR, 'README_DEPLOIEMENT.txt'), readme, 'utf8');
console.log('  📄 README_DEPLOIEMENT.txt créé\n');

// Afficher le résumé
function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const child of fs.readdirSync(dir)) {
    const childPath = path.join(dir, child);
    const stat = fs.statSync(childPath);
    if (stat.isDirectory()) {
      count += countFiles(childPath);
    } else {
      count++;
    }
  }
  return count;
}

const totalFiles = countFiles(DEPLOY_DIR);
const totalSize = (() => {
  let size = 0;
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const child of fs.readdirSync(d)) {
      const cp = path.join(d, child);
      const st = fs.statSync(cp);
      if (st.isDirectory()) walk(cp);
      else size += st.size;
    }
  }
  walk(DEPLOY_DIR);
  return (size / 1024).toFixed(0);
})();

console.log('✅ Dossier dist-deploy/ prêt :');
console.log(`   ${totalFiles} fichiers · ${totalSize} Ko`);
console.log('');
console.log('📋 Contenu déployé :');
for (const child of fs.readdirSync(DEPLOY_DIR)) {
  const childPath = path.join(DEPLOY_DIR, child);
  const stat = fs.statSync(childPath);
  if (stat.isDirectory()) {
    const fileCount = countFiles(childPath);
    console.log(`   ✅ ${child}/ (${fileCount} fichiers)`);
  } else {
    console.log(`   ✅ ${child}`);
  }
}
console.log('');
console.log('🛡️  PROTÉGÉ (non inclus dans le déploiement) :');
for (const safe of SKIP) {
  if (fs.existsSync(path.join(DIST_DIR, safe))) {
    const fileCount = countFiles(path.join(DIST_DIR, safe));
    console.log(`   🛡️  ${safe}/ (${fileCount} fichiers préservés sur le serveur)`);
  }
}
console.log('');
console.log('📤 Prêt à être uploadé sur Hostinger.');
