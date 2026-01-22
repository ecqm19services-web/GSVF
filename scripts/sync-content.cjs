const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'content');
const destDir = path.join(projectRoot, 'public', 'content');

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyRecursiveSync(from, to) {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    ensureDirSync(to);
    const entries = fs.readdirSync(from);
    for (const entry of entries) {
      copyRecursiveSync(path.join(from, entry), path.join(to, entry));
    }
    return;
  }

  ensureDirSync(path.dirname(to));
  fs.copyFileSync(from, to);
}

if (!fs.existsSync(srcDir)) {
  process.exit(0);
}

ensureDirSync(destDir);
copyRecursiveSync(srcDir, destDir);
