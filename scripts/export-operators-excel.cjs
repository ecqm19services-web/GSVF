const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const operatorsFile = path.join(__dirname, '..', 'server', '_secure', 'admin-operators.json');
const outputFile = path.join(__dirname, '..', 'admin-operators-credentials.xlsx');

if (!fs.existsSync(operatorsFile)) {
  console.error('No admin-operators.json found. Run bootstrap first.');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(operatorsFile, 'utf8'));
const operators = raw.operators || [];

// We need the passwords from the last bootstrap run — read from stdin or args
// Since passwords aren't stored in the JSON (only hashes), we'll parse them from the bootstrap output
// For now, accept passwords as JSON arg
const passwordsArg = process.argv[2];
if (!passwordsArg) {
  console.error('Usage: node export-operators-excel.cjs \'{"op01":"pass1",...}\'');
  process.exit(1);
}

const passwords = JSON.parse(passwordsArg);

const rows = operators.map((op) => ({
  'Identifiant': op.id,
  'Nom affiché': op.displayName,
  'Rôle': op.role,
  'Actif': op.active ? 'Oui' : 'Non',
  'Mot de passe temporaire': passwords[op.id] || '(non disponible)',
  'Changement obligatoire': op.mustChangePassword ? 'Oui' : 'Non',
  'Créé le': op.createdAt || '',
  'URL de connexion': '/ecqm19-admin',
}));

const ws = XLSX.utils.json_to_sheet(rows);

// Set column widths
ws['!cols'] = [
  { wch: 14 },
  { wch: 20 },
  { wch: 10 },
  { wch: 8 },
  { wch: 28 },
  { wch: 22 },
  { wch: 26 },
  { wch: 20 },
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Opérateurs Admin');
XLSX.writeFile(wb, outputFile);

console.log(`Excel file created: ${outputFile}`);
