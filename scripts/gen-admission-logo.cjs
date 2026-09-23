// Genere src/assets/admissionLogo.ts : extrait le PNG embarque dans
// public/logo-vf.svg, le reduit (mise a l'echelle par moyenne/box) puis le
// reencode en PNG ( RGBA, filtre 0 ) pour un data URI leger destine a l'export
// Word. 100% Node (zlib), aucun outil graphique externe, aucune retranscription
// manuelle du base64.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TARGET = Number(process.argv[2] || 160); // taille de cote cible en px

const svgPath = path.join(__dirname, '..', 'public', 'logo-vf.svg');
const outPath = path.join(__dirname, '..', 'src', 'assets', 'admissionLogo.ts');

// --- 1. Extraire le PNG base64 du SVG -------------------------------------
const svg = fs.readFileSync(svgPath, 'utf8');
const m = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);
if (!m) throw new Error('Aucun PNG base64 trouve dans le SVG');
const b64 = m[1].replace(/&#10;/g, '').replace(/\s+/g, '');
const png = Buffer.from(b64, 'base64');
if (png.readUInt32BE(0) !== 0x89504e47) throw new Error('Signature PNG invalide');

// --- 2. Decodage PNG ------------------------------------------------------
function readChunks(buf) {
  let off = 8;
  const chunks = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.slice(off + 8, off + 8 + len);
    chunks.push({ type, data });
    off += 12 + len;
  }
  return chunks;
}

const chunks = readChunks(png);
const ihdr = chunks.find((c) => c.type === 'IHDR').data;
const width = ihdr.readUInt32BE(0);
const height = ihdr.readUInt32BE(4);
const bitDepth = ihdr[8];
const colorType = ihdr[9];
if (bitDepth !== 8) throw new Error('Bit depth non supporte: ' + bitDepth);
// channels: 6=RGBA, 2=RGB, 3=palette(gere via tRNS), 0=gray
let channels;
if (colorType === 6) channels = 4;
else if (colorType === 2) channels = 3;
else if (colorType === 0) channels = 1;
else throw new Error('Color type non supporte: ' + colorType);

const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data));
const raw = zlib.inflateSync(idat);

// De-filtrage des lignes (PNG spec).
const bpp = channels; // octets par pixel (8 bit)
const stride = width * bpp;
const out = Buffer.alloc(height * stride);
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}
let pos = 0;
for (let y = 0; y < height; y++) {
  const filter = raw[pos++];
  const line = raw.slice(pos, pos + stride);
  pos += stride;
  const cur = out.slice(y * stride, (y + 1) * stride);
  const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
  for (let x = 0; x < stride; x++) {
    const a = x >= bpp ? cur[x - bpp] : 0;
    const b = prev[x];
    const c = x >= bpp ? prev[x - bpp] : 0;
    let v = line[x];
    switch (filter) {
      case 0: break;
      case 1: v = (v + a) & 255; break;
      case 2: v = (v + b) & 255; break;
      case 3: v = (v + ((a + b) >> 1)) & 255; break;
      case 4: v = (v + paeth(a, b, c)) & 255; break;
      default: throw new Error('Filtre inconnu: ' + filter);
    }
    cur[x] = v;
  }
}

// Normaliser en RGBA.
const rgba = Buffer.alloc(width * height * 4);
for (let i = 0; i < width * height; i++) {
  if (channels === 4) {
    rgba[i * 4] = out[i * 4];
    rgba[i * 4 + 1] = out[i * 4 + 1];
    rgba[i * 4 + 2] = out[i * 4 + 2];
    rgba[i * 4 + 3] = out[i * 4 + 3];
  } else if (channels === 3) {
    rgba[i * 4] = out[i * 3];
    rgba[i * 4 + 1] = out[i * 3 + 1];
    rgba[i * 4 + 2] = out[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  } else {
    const g = out[i];
    rgba[i * 4] = g; rgba[i * 4 + 1] = g; rgba[i * 4 + 2] = g; rgba[i * 4 + 3] = 255;
  }
}

// --- 3. Reduction box-average --------------------------------------------
const scale = TARGET / Math.min(width, height);
const newW = Math.round(width * scale);
const newH = Math.round(height * scale);
const small = Buffer.alloc(newW * newH * 4);
for (let y = 0; y < newH; y++) {
  for (let x = 0; x < newW; x++) {
    const x0 = Math.floor(x * width / newW), x1 = Math.max(x0 + 1, Math.floor((x + 1) * width / newW));
    const y0 = Math.floor(y * height / newH), y1 = Math.max(y0 + 1, Math.floor((y + 1) * height / newH));
    let r = 0, g = 0, bl = 0, a = 0, n = 0;
    for (let sy = y0; sy < y1; sy++) {
      for (let sx = x0; sx < x1; sx++) {
        const idx = (sy * width + sx) * 4;
        r += rgba[idx]; g += rgba[idx + 1]; bl += rgba[idx + 2]; a += rgba[idx + 3]; n++;
      }
    }
    const d = (y * newW + x) * 4;
    small[d] = Math.round(r / n);
    small[d + 1] = Math.round(g / n);
    small[d + 2] = Math.round(bl / n);
    small[d + 3] = Math.round(a / n);
  }
}

// --- 4. Reencodage PNG (RGBA, filtre 0) ----------------------------------
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(newW, 0);
ihdrData.writeUInt32BE(newH, 4);
ihdrData[8] = 8;   // bit depth
ihdrData[9] = 6;   // color type RGBA
ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
const rawStride = newW * 4;
const rawSmall = Buffer.alloc(newH * (rawStride + 1));
for (let y = 0; y < newH; y++) {
  rawSmall[y * (rawStride + 1)] = 0; // filter None
  small.copy(rawSmall, y * (rawStride + 1) + 1, y * rawStride, (y + 1) * rawStride);
}
const idatData = zlib.deflateSync(rawSmall, { level: 9 });
const outPng = Buffer.concat([sig, chunk('IHDR', ihdrData), chunk('IDAT', idatData), chunk('IEND', Buffer.alloc(0))]);
const outB64 = outPng.toString('base64');

console.log(`Source ${width}x${height} (${png.length} o) -> ${newW}x${newH} (${outPng.length} o, base64 ${outB64.length})`);

const content = `/**
 * Logo de l'etablissement en PNG (${newW}x${newH}, fond transparent) encode en data
 * URI base64. Utilise exclusivement par l'export Word (.doc) des fiches
 * d'admission : Word n'affiche ni le SVG ni les images distantes de facon fiable,
 * d'ou un raster auto-suffisant embarque dans le document.
 *
 * Genere par scripts/gen-admission-logo.cjs a partir de public/logo-vf.svg (reduit a ${TARGET}px).
 * Ne pas editer a la main.
 */
export const admissionLogoDataUrl =
  'data:image/png;base64,${outB64}';
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log('Ecrit:', outPath, fs.statSync(outPath).size, 'octets');
