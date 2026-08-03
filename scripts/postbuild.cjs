/**
 * Post-build script: copies server/ files and logo into dist/
 * Run automatically after `vite build` via the "build" npm script.
 * IMPORTANT: Preserves dist/data/ (live user submissions) across rebuilds.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SERVER_DIR = path.join(ROOT, 'server');
const DIST_DIR = path.join(ROOT, 'dist');
const LOGO_SRC = path.join(ROOT, 'logo-vf.svg');
const LOGO_DEST = path.join(DIST_DIR, 'logo-vf.svg');

function copyRecursive(src, dest, skipDataDir) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    // Skip data/ directory — it contains live user submissions
    if (skipDataDir && path.basename(src) === 'data') return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child), skipDataDir);
    }
  } else {
    if (skipDataDir && src.includes(path.sep + 'data' + path.sep)) return;
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy server/ → dist/ (skip server/data/ to preserve live submissions)
console.log('[postbuild] Copying server/ → dist/ ...');
copyRecursive(SERVER_DIR, DIST_DIR, true);

// 2. Ensure dist/data/ exists with initial files (only if not already present)
const distDataDir = path.join(DIST_DIR, 'data');
if (!fs.existsSync(distDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
}
const dataFiles = ['contacts.json', 'admissions.json'];
for (const file of dataFiles) {
  const destFile = path.join(distDataDir, file);
  if (!fs.existsSync(destFile)) {
    fs.writeFileSync(destFile, '[]', 'utf8');
    console.log(`[postbuild] Created ${file} (initial)`);
  }
}
console.log('[postbuild] data/ preserved ✓');

// 3. Copy logo
if (fs.existsSync(LOGO_SRC)) {
  console.log('[postbuild] Copying logo-vf.svg → dist/');
  fs.copyFileSync(LOGO_SRC, LOGO_DEST);
}

console.log('[postbuild] Done ✓');
