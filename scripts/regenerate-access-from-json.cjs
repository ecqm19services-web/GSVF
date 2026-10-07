/**
 * Régénère acces-operateurs.csv et acces-operateurs.xlsx À PARTIR des hashes
 * existants de admin-operators.json, sans modifier aucun mot de passe.
 *
 * Les mots de passe par défaut du bootstrap sont déterministes : OpXX@Vision26
 * (ex. op01 -> Op01@Vision26). Le script vérifie que chaque hash correspond bien
 * à ce mot de passe avant d'écrire les fichiers de référence.
 *
 * Usage : node scripts/regenerate-access-from-json.cjs
 * Dépendances : bcryptjs, exceljs
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');

const OPERATORS_JSON = path.resolve(__dirname, '../server/_secure/admin-operators.json');
const OUTPUT_XLSX = path.resolve(__dirname, '../server/_secure/acces-operateurs.xlsx');
const OUTPUT_CSV = path.resolve(__dirname, '../server/_secure/acces-operateurs.csv');

function defaultPasswordFor(id) {
  const num = id.replace(/^op/i, '');
  return `Op${num}@Vision26`;
}

async function main() {
  const raw = JSON.parse(fs.readFileSync(OPERATORS_JSON, 'utf8'));
  const operators = raw.operators || [];

  const rows = [];
  let allOk = true;

  console.log('\n🔐 Vérification des hashes existants (mots de passe non modifiés)...\n');
  for (const op of operators) {
    const plain = defaultPasswordFor(op.id);
    const ok = bcrypt.compareSync(plain, op.passwordHash);
    if (!ok) allOk = false;
    console.log(`  ${op.id} [${op.role}] -> ${plain}  ${ok ? '✅ correspond' : '❌ NE CORRESPOND PAS'}`);
    rows.push({
      id: op.id,
      name: op.displayName,
      password: plain,
      role: op.role,
      active: op.active ? 'Oui' : 'Non',
      mustChange: op.mustChangePassword ? 'Oui' : 'Non',
    });
  }

  if (!allOk) {
    console.error('\n❌ Au moins un hash ne correspond pas au mot de passe par défaut.');
    console.error('   Aucun fichier écrit pour éviter de propager de faux identifiants.');
    process.exit(1);
  }

  const genDate = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  // ── CSV (même format que l'existant) ────────────────────────────────────────
  const csvLines = ['ID,Nom,"Mot de passe","Changement obligatoire","Date generation"'];
  for (const r of rows) {
    csvLines.push(`${r.id},"${r.name}",${r.password},${r.mustChange},"${genDate}"`);
  }
  fs.writeFileSync(OUTPUT_CSV, csvLines.join('\n') + '\n', 'utf8');
  console.log(`\n✅ CSV écrit : ${OUTPUT_CSV}`);

  // ── XLSX stylisé ────────────────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Collège Privé la Vision Future';
  workbook.created = new Date();

  const ws = workbook.addWorksheet('Accès Opérateurs', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  });

  ws.columns = [
    { key: 'no', width: 6 },
    { key: 'id', width: 14 },
    { key: 'name', width: 22 },
    { key: 'password', width: 24 },
    { key: 'role', width: 16 },
    { key: 'active', width: 10 },
    { key: 'note', width: 44 },
  ];

  ws.mergeCells('A1:G1');
  const titleCell = ws.getCell('A1');
  titleCell.value = '🏫  COLLÈGE PRIVÉ LA VISION FUTURE';
  titleCell.font = { name: 'Calibri', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF434A7A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(1).height = 36;

  ws.mergeCells('A2:G2');
  const subCell = ws.getCell('A2');
  subCell.value = `Accès Tableau de Bord Administrateur — URL : /vision-admin — Généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  subCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FFFFFFFF' } };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE07B39' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(2).height = 22;

  ws.getRow(3).height = 8;

  const headerRow = ws.getRow(4);
  const headers = ['N°', 'Identifiant', 'Nom', 'Mot de passe', 'Rôle', 'Actif', 'Note importante'];
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E6B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF6B7FBB' } },
      bottom: { style: 'thin', color: { argb: 'FF6B7FBB' } },
      left: { style: 'thin', color: { argb: 'FF6B7FBB' } },
      right: { style: 'thin', color: { argb: 'FF6B7FBB' } },
    };
  });
  headerRow.height = 28;

  const evenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F2F8' } };
  const oddFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
  const borderStyle = {
    top: { style: 'hair', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'hair', color: { argb: 'FFCCCCCC' } },
    left: { style: 'hair', color: { argb: 'FFCCCCCC' } },
    right: { style: 'hair', color: { argb: 'FFCCCCCC' } },
  };

  rows.forEach((r, idx) => {
    const dataRow = ws.getRow(idx + 5);
    const fill = idx % 2 === 0 ? evenFill : oddFill;
    const values = [
      idx + 1,
      r.id,
      r.name,
      r.password,
      r.role === 'admin' ? 'Administrateur' : 'Super-admin',
      r.active,
      'Changement obligatoire à la 1ère connexion',
    ];
    values.forEach((v, ci) => {
      const cell = dataRow.getCell(ci + 1);
      cell.value = v;
      cell.fill = fill;
      cell.border = borderStyle;
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: ci === 0 ? 'center' : 'left', wrapText: true };
      if (ci === 3) cell.font = { name: 'Courier New', size: 10, bold: true, color: { argb: 'FFC0392B' } };
      if (ci === 5) {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF27AE60' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });
    dataRow.height = 22;
  });

  const warnRow = rows.length + 6;
  ws.getRow(warnRow).height = 8;
  ws.mergeCells(`A${warnRow + 1}:G${warnRow + 1}`);
  const warnCell = ws.getCell(`A${warnRow + 1}`);
  warnCell.value = '⚠️  CONFIDENTIEL — Données sensibles. À remettre en main propre et à changer à la première connexion.';
  warnCell.font = { name: 'Calibri', size: 10, bold: true, italic: true, color: { argb: 'FF7B0000' } };
  warnCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF0F0' } };
  warnCell.alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getRow(warnRow + 1).height = 20;

  await workbook.xlsx.writeFile(OUTPUT_XLSX);
  console.log(`✅ XLSX écrit : ${OUTPUT_XLSX}`);
  console.log('\n🎉 Terminé — identifiants INCHANGÉS, fichiers de référence synchronisés.\n');
}

main().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
