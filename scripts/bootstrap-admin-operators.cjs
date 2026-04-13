const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DEFAULT_COUNT = 10;
const MIN_PASSWORD_LEN = 8;
const OPERATOR_ID_PREFIX = 'op';

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

function randomPassword(length) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  while (out.length < length) {
    const bytes = crypto.randomBytes(length);
    for (const b of bytes) {
      out += alphabet[b % alphabet.length];
      if (out.length >= length) {
        break;
      }
    }
  }
  return out;
}

function isTooSimilar(password, operatorId) {
  const lower = password.toLowerCase();
  const forbiddenParts = [
    operatorId.toLowerCase(),
    'admin',
    'cpvf',
    'vision',
    'ecole',
    'college',
    '2024',
    '2025',
    '2026',
  ];

  return forbiddenParts.some((part) => part.length >= 3 && lower.includes(part));
}

const operators = [];
const credentials = [];

for (let i = 1; i <= requestedCount; i += 1) {
  const id = `${OPERATOR_ID_PREFIX}${pad2(i)}`;

  let plain = '';
  let attempts = 0;
  while (!plain || isTooSimilar(plain, id) || credentials.some((entry) => entry.password === plain)) {
    plain = randomPassword(MIN_PASSWORD_LEN);
    attempts += 1;
    if (attempts > 500) {
      throw new Error(`Unable to generate compliant password for ${id}`);
    }
  }

  const bcryptHash = bcrypt.hashSync(plain, 10);
  const phpHash = toPhpCompatibleBcrypt(bcryptHash);

  operators.push({
    id,
    displayName: `Operateur ${pad2(i)}`,
    role: 'admin',
    active: true,
    mustChangePassword: true,
    passwordHash: phpHash,
    passwordHistory: [],
    createdAt: new Date().toISOString(),
  });

  credentials.push({ id, password: plain });
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
  console.log(`${entry.id} -> ${entry.password}`);
}
console.log('\nIMPORTANT: store passwords in your password manager and rotate after first login.\n');
