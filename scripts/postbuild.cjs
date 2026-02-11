/**
 * Post-build script: copies server/ files and logo into dist/
 * Run automatically after `vite build` via the "build" npm script.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SERVER_DIR = path.join(ROOT, 'server');
const DIST_DIR = path.join(ROOT, 'dist');
const LOGO_SRC = path.join(ROOT, 'logo-vf.svg');
const LOGO_DEST = path.join(DIST_DIR, 'logo-vf.svg');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    // Ensure parent dir exists
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy all server/ files into dist/
console.log('[postbuild] Copying server/ → dist/ ...');
copyRecursive(SERVER_DIR, DIST_DIR);

// 2. Copy logo
if (fs.existsSync(LOGO_SRC)) {
  console.log('[postbuild] Copying logo-vf.svg → dist/');
  fs.copyFileSync(LOGO_SRC, LOGO_DEST);
}

console.log('[postbuild] Done ✓');
