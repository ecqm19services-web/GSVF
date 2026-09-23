const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DEFAULT_COUNT = 10;
const MIN_PASSWORD_LEN = 8;
const OPERATOR_ID_PREFIX = 'op';

// Opérateurs nommés super-administrateurs (rôle 'superadmin')
const SUPERADMIN_IDS = new Set(['op01', 'op05', 'op06', 'op10']);

// Mot de passe simple par défaut : OpXX@Vision26 (majuscule + minuscule + chiffre, >= 8 caractères)
function defaultPasswordFor(id) {
  const num = id.replace(/^op/i, '');
  const pwd = `Op${num}@Vision26`;
  // Contrôle de conformité à la politique des mots de passe
  if (
    pwd.length < MIN_PASSWORD_LEN ||
    !/[A-Z]/.test(pwd) ||
    !/[a-z]/.test(pwd) ||
    !/[0-9]/.test(pwd)
  ) {
    throw new Error(`Default password for ${id} does not meet the password policy.`);
  }
  return pwd;
}

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'server', '_secure', 'admin-operators.json');

const args = process.argv.slice(2);
const requestedCount = Number.parseInt(args[0] || String(DEFAULT_COUNT), 10);
const force = args.includes('--force');

if (!Number.isInteger(requestedCount) || requestedCount <= 0 || requestedCount > 100) {
  console.error('Invalid operator count. Use a number between 1 and 100.');
  process.exit(1);
}

if (fs.existsSync(outputPath) && !force) {
  console.error(`Refusing to overwrite existing file: ${outputPath}`);
  console.error('Use --force only if you intentionally rotate all operators.');
  process.exit(1);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toPhpCompatibleBcrypt(hash) {
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    return `$2y$${hash.slice(4)}`;
  }
  return hash;
}

const operators = [];
const credentials = [];

for (let i = 1; i <= requestedCount; i += 1) {
  const id = `${OPERATOR_ID_PREFIX}${pad2(i)}`;
  const role = SUPERADMIN_IDS.has(id) ? 'superadmin' : 'admin';
  const plain = defaultPasswordFor(id);

  const bcryptHash = bcrypt.hashSync(plain, 10);
  const phpHash = toPhpCompatibleBcrypt(bcryptHash);

  operators.push({
    id,
    displayName: `Operateur ${pad2(i)}`,
    role,
    active: true,
    mustChangePassword: true,
    passwordHash: phpHash,
    passwordHistory: [],
    createdAt: new Date().toISOString(),
  });

  credentials.push({ id, password: plain, role });
}

const payload = {
  generatedAt: new Date().toISOString(),
  lockPolicy: {
    maxFailedAttempts: 10,
    lockoutMinutes: 30,
  },
  operators,
};

fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('\nAdmin operators file created:');
console.log(outputPath);
console.log('\nDistribute these one-time credentials securely (do not commit/share in chat):\n');
for (const entry of credentials) {
  console.log(`${entry.id} [${entry.role}] -> ${entry.password}`);
}
console.log('\nIMPORTANT: store passwords in your password manager and rotate after first login.\n');
