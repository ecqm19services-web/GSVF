#!/usr/bin/env node
/**
 * Génère le PDF du guide remis à l'école (version école uniquement, sans parties techniques).
 *  - Page de garde avec le logo de l'école (public/logo-vf.svg)
 *  - Pied de page "confidentiel" répété sur toutes les pages
 *  - Bloc de signature du développeur en fin de document
 *
 * Usage :  node scripts/generate-doc-pdf.cjs
 * Sortie : DOCUMENTATION_ECOLE.html (intermédiaire) + DOCUMENTATION_ECOLE.pdf
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MD_PATH = path.join(ROOT, 'DOCUMENTATION_ECOLE.md');
const HTML_PATH = path.join(ROOT, 'DOCUMENTATION_ECOLE.html');
const PDF_PATH = path.join(ROOT, 'DOCUMENTATION_ECOLE.pdf');
const LOGO_PATH = path.join(ROOT, 'public', 'logo-vf.svg');

const DEV = {
  name: 'M. ESSOH Cyrille',
  handles: 'ic_future / Hfablab',
  email: 'ic.future16@gmail.com',
  phone: '+225 07 77 17 24 08',
};
const SCHOOL = {
  name: 'Collège Privé la Vision Future',
  site: 'https://lavisionfuture.com',
  admin: 'https://lavisionfuture.com/vision-admin',
  email: 'visionfutureschool@gmail.com',
  standard: '+225 27 21 29 39 83',
};

// Date de remise du guide à l'école (fixe, décidée avec la direction)
const REMISE_DATE = 'mardi 13 octobre 2026';

/* --------------------------------- Markdown --------------------------------- */

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inline(text) {
  let out = escapeHtml(text);
  // `code`
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // [libellé](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}">${label}</a>`);
  // **gras**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // *italique*
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  return out;
}

function isTableSep(line) {
  return /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes('-');
}

function splitRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function mdToHtml(md) {
  // Normalise les fins de ligne : sans ça, CRLF empêche la détection des blocs ```
  md = md.replace(/\r\n?/g, '\n');

  // 1. Préserver les blocs de code
  const codeBlocks = [];
  md = md.replace(/```([^\n`]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const i = codeBlocks.length;
    codeBlocks.push({ lang, code });
    return `\u0000CODEBLOCK${i}\u0000`;
  });

  const lines = md.split(/\r?\n/);
  const html = [];
  let title = '';
  let i = 0;

  const closeList = (stack) => {
    while (stack.length) html.push(`</${stack.pop()}>`);
  };

  let listStack = [];

  // Une ligne qui commence un nouveau bloc interrompt la fusion des paragraphes
  const isBlockBoundary = (l) => {
    const t = l.trimEnd();
    const s = t.trim();
    return (
      s === '' ||
      /^\s*[-*] /.test(l) ||
      /^\s*\d+[.)] /.test(l) ||
      /^#{1,6} /.test(s) ||
      /^---+$/.test(s) ||
      s.startsWith('>') ||
      s.startsWith('|') ||
      /^\u0000CODEBLOCK\d+\u0000$/.test(s)
    );
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Bloc de code (placeholder)
    const cb = line.match(/^\u0000CODEBLOCK(\d+)\u0000$/);
    if (cb) {
      closeList(listStack);
      const { code } = codeBlocks[Number(cb[1])];
      html.push(`<pre><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`);
      i++;
      continue;
    }

    // Tableaux
    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      closeList(listStack);
      const head = splitRow(line);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        body.push(splitRow(lines[i]));
        i++;
      }
      html.push('<table>');
      html.push(`<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`);
      html.push('<tbody>');
      for (const row of body) {
        html.push(`<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`);
      }
      html.push('</tbody></table>');
      continue;
    }

    // Titres
    let m;
    if ((m = line.match(/^### (.*)$/))) {
      closeList(listStack);
      html.push(`<h3>${inline(m[1])}</h3>`);
      i++;
      continue;
    }
    if ((m = line.match(/^## (.*)$/))) {
      closeList(listStack);
      html.push(`<h2>${inline(m[1])}</h2>`);
      i++;
      continue;
    }
    if ((m = line.match(/^# (.*)$/))) {
      closeList(listStack);
      if (!title) title = m[1].replace(/^[^\w]+/, '').trim();
      i++;
      continue;
    }

    // Séparateur
    if (/^---+$/.test(line.trim())) {
      closeList(listStack);
      html.push('<hr>');
      i++;
      continue;
    }

    // Citation
    if (line.trim().startsWith('> ')) {
      closeList(listStack);
      const buf = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        buf.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      html.push(`<blockquote>${buf.map(inline).join('<br>')}</blockquote>`);
      continue;
    }

    // Listes (un niveau de retrait géré)
    const indent = raw.match(/^(\s*)/)[1].length;
    if ((m = raw.match(/^\s*[-*] (.*)$/))) {
      const tag = 'ul';
      if (listStack[listStack.length - 1] !== tag) {
        closeList(listStack);
        html.push(`<${tag}>`);
        listStack.push(tag);
      }
      html.push(`<li>${inline(m[1])}</li>`);
      i++;
      continue;
    }
    if ((m = raw.match(/^\s*\d+[\.)] (.*)$/))) {
      const tag = 'ol';
      if (listStack[listStack.length - 1] !== tag) {
        closeList(listStack);
        html.push(`<${tag}>`);
        listStack.push(tag);
      }
      html.push(`<li>${inline(m[1])}</li>`);
      i++;
      continue;
    }
    if (line.trim() === '') {
      closeList(listStack);
      i++;
      continue;
    }

    // Paragraphe : les retours à la ligne « mous » du markdown sont fusionnés
    closeList(listStack);
    const para = [line.trim()];
    i++;
    while (i < lines.length && !isBlockBoundary(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    html.push(`<p>${inline(para.join(' '))}</p>`);
  }
  closeList(listStack);

  return { title, body: html.join('\n') };
}

/* --------------------------------- Gabarit --------------------------------- */

function buildHtml(mdSource) {
  const { title, body } = mdToHtml(mdSource);
  // Logo embarqué en data URI → HTML et PDF transportables hors de ce poste
  const logoHref = 'data:image/svg+xml;base64,' + fs.readFileSync(LOGO_PATH).toString('base64');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title || 'Documentation complète')} — ${escapeHtml(SCHOOL.name)}</title>
<style>
  @page { size: A4; margin: 18mm 14mm 22mm 14mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; color-scheme: light; }
  body {
    font-family: "Segoe UI", Roboto, Arial, sans-serif;
    color: #1f2937; font-size: 10.5pt; line-height: 1.55; margin: 0; background: #fff;
  }
  /* ---------- Page de garde ---------- */
  .cover {
    text-align: center; padding: 18mm 0 10mm;
    border-bottom: 3px solid #b58d3c; margin-bottom: 10mm;
    page-break-after: always;
  }
  .cover img { width: 30mm; height: 30mm; object-fit: contain; }
  .cover .school { font-size: 15pt; font-weight: 700; color: #123a6b; margin-top: 5mm; letter-spacing: .3px; }
  .cover .tagline { font-size: 9.5pt; color: #6b7280; margin-top: 1.5mm; }
  .cover h1 { font-size: 23pt; margin: 10mm 0 2mm; color: #0f172a; }
  .cover .sub { font-size: 11pt; color: #374151; }
  .badge-conf {
    display: inline-block; margin-top: 9mm; padding: 3mm 7mm;
    background: #fef2f2; color: #991b1b; border: 1.5px solid #dc2626;
    border-radius: 999px; font-weight: 700; font-size: 10pt;
  }
  .cover-meta {
    margin: 12mm auto 0; max-width: 120mm; text-align: left;
    border-collapse: collapse; font-size: 9.5pt;
  }
  .cover-meta td { padding: 1.8mm 3mm; border-bottom: 1px solid #e5e7eb; }
  .cover-meta td:first-child { color: #6b7280; width: 42mm; }
  /* Tableau de garde épuré : on annule bordures complètes et zébrures héritées */
  .cover-meta th, .cover-meta td { border-left: 0; border-right: 0; border-top: 0; background: transparent; }
  .cover-meta tbody tr:nth-child(even) { background: transparent; }
  /* ---------- Pied de page répété ---------- */
  .running-footer {
    position: fixed; bottom: 0; left: 0; right: 0;
    font-size: 7.8pt; color: #6b7280; text-align: center;
    border-top: 1px solid #e5e7eb; padding-top: 1.5mm; background: #fff;
  }
  .running-footer .left { float: left; }
  .running-footer .right { float: right; color: #991b1b; font-weight: 600; }
  /* ---------- Typographie courante ---------- */
  h2 {
    font-size: 14pt; color: #123a6b; border-bottom: 1.5px solid #d1d5db;
    padding-bottom: 1.5mm; margin: 8mm 0 3mm; page-break-after: avoid;
  }
  h3 { font-size: 11.5pt; color: #b58d3c; margin: 5mm 0 2mm; page-break-after: avoid; }
  p { margin: 0 0 2.5mm; }
  ul, ol { margin: 0 0 3mm; padding-left: 6.5mm; }
  li { margin-bottom: 1.2mm; }
  a { color: #1d4ed8; text-decoration: none; }
  code {
    background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 3px;
    padding: 0 1.2mm; font-family: "Cascadia Mono", Consolas, monospace; font-size: 9pt;
  }
  pre {
    background: #0f172a; color: #e2e8f0; border-radius: 3mm; padding: 4mm 5mm;
    font-family: "Cascadia Mono", Consolas, monospace; font-size: 8.6pt;
    white-space: pre-wrap; line-height: 1.45; margin: 0 0 4mm;
    page-break-inside: avoid;
  }
  pre code { background: none; border: 0; color: inherit; padding: 0; font-size: inherit; }
  blockquote {
    margin: 0 0 4mm; padding: 3mm 4mm; background: #fffbeb;
    border-left: 3px solid #b58d3c; color: #78350f; font-size: 9.8pt;
  }
  table { border-collapse: collapse; width: 100%; margin: 0 0 4mm; font-size: 9.3pt; page-break-inside: auto; }
  th, td { border: 1px solid #d1d5db; padding: 1.8mm 2.4mm; text-align: left; vertical-align: top; }
  th { background: #123a6b; color: #fff; font-weight: 600; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  hr { border: 0; border-top: 1px solid #e5e7eb; margin: 6mm 0; }
  /* ---------- Signature ---------- */
  .sig { page-break-before: always; }
  .sig-box {
    border: 1.5px solid #123a6b; border-radius: 4mm; padding: 7mm;
    background: #f8fafc;
  }
  .sig-box h2 { margin-top: 0; border: 0; font-size: 15pt; }
  .sig-grid { display: flex; gap: 8mm; margin-top: 6mm; }
  .sig-col { flex: 1; }
  .sig-col h4 { margin: 0 0 3mm; font-size: 10pt; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; }
  .sig-line {
    margin-top: 16mm; border-top: 1.5px solid #374151; padding-top: 2mm;
    font-size: 9.5pt; color: #374151;
  }
  .sig-stamp {
    text-align: center; color: #9ca3af; font-size: 8.5pt;
    border: 1px dashed #d1d5db; border-radius: 3mm; padding: 4mm; margin-top: 6mm;
  }
</style>
</head>
<body>
<div class="running-footer">
  <span class="left">${escapeHtml(SCHOOL.name)} · Guide d'administration du site</span>
  <span class="right">CONFIDENTIEL — contient des accès</span>
</div>

<section class="cover">
  <img src="${logoHref}" alt="Logo ${escapeHtml(SCHOOL.name)}">
  <div class="school">${escapeHtml(SCHOOL.name)}</div>
  <div class="tagline">« Grand Bassam · École primaire et secondaire » — Site web &amp; back-office</div>
  <h1>Guide d'administration du site</h1>
  <div class="sub">Accès, comptes opérateurs, écrans d'administration et bons réflexes</div>
  <div class="badge-conf">🔒 DOCUMENT CONFIDENTIEL — DIRECTION &amp; SUPERADMINISTRATEURS</div>
  <table class="cover-meta">
    <tr><td>Site public</td><td>${escapeHtml(SCHOOL.site)}</td></tr>
    <tr><td>Zone d'administration</td><td>${escapeHtml(SCHOOL.admin)}</td></tr>
    <tr><td>Version du document</td><td>${REMISE_DATE}</td></tr>
    <tr><td>Éditeur des pages</td><td>Mode <strong>éditeur visuel</strong> (recommandé)</td></tr>
    <tr><td>Vidéos d'appui</td><td>Plusieurs vidéos par zone d'administration, mises à disposition avec ce document (§10)</td></tr>
    <tr><td>Développeur</td><td>${escapeHtml(DEV.name)} — ${escapeHtml(DEV.handles)}</td></tr>
    <tr><td>Contact prestataire</td><td>${escapeHtml(DEV.email)} · ${escapeHtml(DEV.phone)}</td></tr>
  </table>
</section>

${body}

<section class="sig">
  <div class="sig-box">
    <h2>✍️ Signature et livraison</h2>
    <p>Le présent document atteste la livraison de la version décrite : fonctionnalités publiques,
    espace d'administration <code>${escapeHtml(SCHOOL.admin)}</code>, 10 comptes opérateurs,
    procédure de sauvegarde à la charge de l'école et <strong>vidéos d'accompagnement</strong> mises à
    disposition avec ce document (§10).
    La partie technique (serveur, mise en ligne, scripts) reste gérée par le prestataire.</p>

    <table class="cover-meta" style="max-width:none;width:100%;margin-top:5mm;">
      <tr><td>Client</td><td>${escapeHtml(SCHOOL.name)} — ${escapeHtml(SCHOOL.site)}</td></tr>
      <tr><td>Contact établissement</td><td>${escapeHtml(SCHOOL.email)} · Standard ${escapeHtml(SCHOOL.standard)}</td></tr>
      <tr><td>Prestataire</td><td>${escapeHtml(DEV.name)} (${escapeHtml(DEV.handles)}) · ${escapeHtml(DEV.email)}</td></tr>
      <tr><td>Date de remise</td><td>${REMISE_DATE}</td></tr>
    </table>

    <div class="sig-grid">
      <div class="sig-col">
        <h4>Le développeur</h4>
        <div class="sig-line">${escapeHtml(DEV.name)}<br><small>${escapeHtml(DEV.handles)} · ${escapeHtml(DEV.email)} · ${escapeHtml(DEV.phone)}</small></div>
      </div>
      <div class="sig-col">
        <h4>Pour l'établissement</h4>
        <div class="sig-line">Nom et fonction : ______________________<br><small>Date et cachet de l'école</small></div>
      </div>
    </div>

    <div class="sig-stamp">
      Guide remis à l'école le ${REMISE_DATE}, avec les vidéos d'accompagnement mises à
      disposition avec ce document (§10) — à mettre à jour à chaque changement de compte opérateur.
      Toute demande d'évolution du site s'adresse au prestataire (contacts en §9).
    </div>
  </div>
</section>
</body>
</html>`;
}

/* ------------------------------ Génération PDF ------------------------------ */

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p)) || null;
}

function main() {
  if (!fs.existsSync(MD_PATH)) {
    console.error('❌ Introuvable :', path.relative(ROOT, MD_PATH));
    process.exit(1);
  }
  if (!fs.existsSync(LOGO_PATH)) {
    console.error('❌ Logo introuvable : public/logo-vf.svg');
    process.exit(1);
  }

  const md = fs.readFileSync(MD_PATH, 'utf8');
  fs.writeFileSync(HTML_PATH, buildHtml(md), 'utf8');
  console.log('✅ HTML mis en page  :', path.relative(ROOT, HTML_PATH));

  const browser = findBrowser();
  if (!browser) {
    console.error('⚠️ Chrome/Edge introuvable : ouvre le HTML et imprime-le en PDF.');
    process.exit(2);
  }

  if (fs.existsSync(PDF_PATH)) fs.rmSync(PDF_PATH);
  const url = 'file:///' + HTML_PATH.replace(/\\/g, '/');
  const res = spawnSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      '--virtual-time-budget=10000',
      `--print-to-pdf=${PDF_PATH}`,
      url,
    ],
    { stdio: 'pipe' }
  );

  if (!fs.existsSync(PDF_PATH)) {
    console.error('❌ Échec de la génération PDF :', (res.stderr || '').toString().slice(0, 400));
    process.exit(3);
  }

  const kb = (fs.statSync(PDF_PATH).size / 1024).toFixed(0);
  console.log(`✅ PDF généré         : ${path.relative(ROOT, PDF_PATH)} (${kb} Ko)`);
  console.log('   Moteur             :', path.basename(browser));
}

main();
