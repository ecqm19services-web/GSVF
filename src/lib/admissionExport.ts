import { siteConfig } from '@/data/content';
import {
  admissionStatusLabels,
  type AdmissionSubmission,
} from '@/types/submissions';
import { admissionLogoDataUrl } from '@/assets/admissionLogo';

/**
 * Génération d'une « fiche d'inscription » Word (.doc) pour une demande
 * d'admission. Le fichier est un document HTML enrichi (namespace Word) que
 * Microsoft Word / LibreOffice / Word en ligne ouvrent nativement : le
 * responsable informatique peut l'imprimer, le joindre par e-mail ou le
 * compléter avant transmission à l'administration.
 */

function escapeHtml(value: string | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateFr(value: string | undefined | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value; // date libre (ex: saisie manuelle)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateTimeFr(value: string | undefined | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Une ligne « libellé / valeur » pour les tableaux de la fiche. */
function row(label: string, value: string | undefined | null): string {
  const v = (value && String(value).trim()) ? escapeHtml(value) : '<span style="color:#9ca3af;">—</span>';
  return (
    `<tr>` +
    `<td style="padding:8px 12px;border:1px solid #e5e7eb;background:#f8fafc;font-weight:600;color:#1e3a8a;width:38%;">${escapeHtml(label)}</td>` +
    `<td style="padding:8px 12px;border:1px solid #e5e7eb;color:#111827;">${v}</td>` +
    `</tr>`
  );
}

function sectionTitle(text: string): string {
  return (
    `<tr><td colspan="2" style="padding:14px 12px 6px 12px;border:none;">` +
    `<div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#c2410c;border-bottom:2px solid #fed7aa;padding-bottom:4px;">` +
    `${escapeHtml(text)}</div></td></tr>`
  );
}

/** Construit le document HTML (compatible Word) d'une demande d'admission. */
export function buildAdmissionDocHtml(item: AdmissionSubmission): string {
  const statut = admissionStatusLabels[item.status] || item.status;
  const eleve = `${item.studentLastName?.toUpperCase() || ''} ${item.studentFirstName || ''}`.trim();
  const parent = `${item.parentLastName?.toUpperCase() || ''} ${item.parentFirstName || ''}`.trim();

  const rows =
    sectionTitle('Identité de l’élève') +
    row('Nom et prénoms', eleve) +
    row('Sexe', item.studentGender) +
    row('Date de naissance', formatDateFr(item.studentBirthdate)) +
    row('Classe souhaitée', item.desiredClass) +
    row('École actuelle', item.currentSchool) +
    sectionTitle('Parent / Tuteur') +
    row('Nom et prénoms', parent) +
    row('Relation avec l’élève', item.relationship) +
    row('Téléphone', item.parentPhone) +
    row('E-mail', item.parentEmail) +
    row('Adresse', item.parentAddress) +
    sectionTitle('Dossier & suivi') +
    row('Statut du dossier', statut) +
    row('Date d’entretien', formatDateFr(item.interviewDate)) +
    row('Reçu le', formatDateTimeFr(item.createdAt));

  const message = (item.message && item.message.trim())
    ? `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;background:#f9fafb;">` +
      `<div style="font-weight:600;color:#1e3a8a;margin-bottom:6px;">Message du parent</div>` +
      `<div style="color:#374151;white-space:pre-wrap;line-height:1.5;">${escapeHtml(item.message)}</div>` +
      `</div>`
    : '';

  const notesPubliques = (item.publicNotes && item.publicNotes.trim())
    ? `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;background:#fffbeb;margin-top:12px;">` +
      `<div style="font-weight:600;color:#92400e;margin-bottom:6px;">Note administrative</div>` +
      `<div style="color:#374151;white-space:pre-wrap;line-height:1.5;">${escapeHtml(item.publicNotes)}</div>` +
      `</div>`
    : '';

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>Fiche d'inscription ${escapeHtml(item.reference)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page { size: A4; margin: 1.6cm; }
  body { font-family: "Calibri", "Segoe UI", Arial, sans-serif; color:#111827; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
</style>
</head>
<body>
  <div style="max-width:720px;margin:0 auto;">
    <!-- En-tête établissement -->
    <div style="background:linear-gradient(90deg,#1e3a8a,#1d4ed8);color:#ffffff;padding:22px 26px;border-radius:10px 10px 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="border:none;padding:0;width:74px;vertical-align:middle;">
            <div style="display:inline-block;background:#ffffff;border-radius:12px;padding:6px;">
              <img src="${admissionLogoDataUrl}" width="56" height="56" alt="Logo" style="display:block;width:56px;height:56px;" />
            </div>
          </td>
          <td style="border:none;padding:0;vertical-align:middle;">
            <div style="font-size:20px;font-weight:700;letter-spacing:0.3px;">${escapeHtml(siteConfig.name)}</div>
            <div style="font-size:12px;margin-top:2px;">L'excellence, notre devise</div>
            <div style="font-size:11px;margin-top:10px;">${escapeHtml(siteConfig.address)} · ${escapeHtml(siteConfig.phone)} · ${escapeHtml(siteConfig.email)}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Bandeau référence -->
    <div style="border:1px solid #e5e7eb;border-top:none;padding:16px 26px;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;">
      <div>
        <div style="font-size:15px;font-weight:700;color:#111827;">Fiche de demande d'inscription</div>
        <div style="font-size:12px;color:#6b7280;margin-top:2px;">Année scolaire ${new Date().getFullYear()}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Référence</div>
        <div style="font-size:15px;font-weight:700;color:#c2410c;font-family:Consolas,monospace;">${escapeHtml(item.reference)}</div>
      </div>
    </div>

    <div style="padding:18px 26px 8px 26px;">
      <table>${rows}</table>
      <div style="height:14px;"></div>
      ${message}
      ${notesPubliques}
    </div>

    <!-- Pied de page -->
    <div style="border-top:1px dashed #d1d5db;margin:10px 26px 26px 26px;padding-top:14px;display:flex;justify-content:space-between;color:#6b7280;font-size:11px;">
      <div>Document généré le ${formatDateTimeFr(new Date().toISOString())}</div>
      <div>Signature &amp; cachet de l'établissement :</div>
    </div>
    <div style="margin:-6px 26px 26px 26px;height:56px;border:1px dashed #d1d5db;border-radius:6px;"></div>
  </div>
</body>
</html>`;
}

/** Déclenche le téléchargement de la fiche au format Word (.doc). */
export function downloadAdmissionDoc(item: AdmissionSubmission): void {
  const html = '\ufeff' + buildAdmissionDocHtml(item);
  const blob = new Blob([html], { type: 'application/msword;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fiche-admission_${item.reference || 'sans-reference'}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
