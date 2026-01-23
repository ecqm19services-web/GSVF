// Utility to load and parse markdown content files
// This provides a centralized way to manage site content

import { marked } from 'marked';

export interface ContentMeta {
  title: string;
  subtitle?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ParsedContent {
  meta: ContentMeta;
  content: string;
  html: string;
}

export function renderMarkdownToHtml(pageName: string, markdown: string): string {
  return marked(transformGalleries(markdown, pageName)) as string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function encodePathSegments(path: string): string {
  return path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

function resolveGalleryImageSrc(pageName: string, file: string): string {
  const trimmed = file.trim();
  if (!trimmed) return '';
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return `/images/${pageName}/${encodePathSegments(trimmed)}`;
}

type GalleryItem = { file: string; caption?: string };

function renderGalleryHtml(items: GalleryItem[], pageName: string): string {
  const figures = items
    .map(({ file, caption }) => {
      const src = resolveGalleryImageSrc(pageName, file);
      const safeSrc = escapeHtml(src);
      const safeCaption = escapeHtml((caption || file).trim());
      const safeAlt = safeCaption || escapeHtml(file.trim());

      return `\n<figure class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">\n  <img src="${safeSrc}" alt="${safeAlt}" loading="lazy" class="h-56 w-full object-cover" />\n  <figcaption class="px-3 py-2 text-sm text-gray-600">${safeCaption}</figcaption>\n</figure>`;
    })
    .join('');

  return `<div class="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">${figures}\n</div>`;
}

function transformGalleries(markdown: string, pageName: string): string {
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    out.push(line);

    if (!/^#{2,6}\s+Galerie\s*$/i.test(line.trim())) continue;

    const items: GalleryItem[] = [];
    let j = i + 1;

    while (j < lines.length && !lines[j].trim()) j += 1;

    while (j < lines.length) {
      const m = /^\s*[-*]\s+(.+)\s*$/.exec(lines[j]);
      if (!m) break;

      const raw = m[1].trim();
      if (!raw) break;
      const [filePart, captionPart] = raw.split('|').map(s => s.trim());
      if (!filePart) break;
      items.push({ file: filePart, caption: captionPart });
      j += 1;
    }

    if (!items.length) continue;

    out.push('');
    out.push(renderGalleryHtml(items, pageName));
    i = j - 1;
  }

  return out.join('\n');
}

function parseFrontmatterValue(raw: string): string {
  const v = raw.trim();
  if (!v) return '';
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseFrontmatterBlock(block: string): Record<string, unknown> {
  const meta: Record<string, unknown> = {};
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(trimmed);
    if (!m) continue;
    const key = m[1];
    const value = parseFrontmatterValue(m[2]);
    meta[key] = value;
  }
  return meta;
}

function extractFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const normalized = raw.replace(/^\uFEFF/, '');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(normalized);
  if (!match) {
    const lines = normalized.split(/\r?\n/);
    const metaLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        break;
      }

      if (!/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.test(line.trim())) {
        return { meta: {}, body: normalized };
      }

      metaLines.push(line);
      i += 1;
    }

    if (!metaLines.length) {
      return { meta: {}, body: normalized };
    }

    return {
      meta: parseFrontmatterBlock(metaLines.join('\n')),
      body: lines.slice(i).join('\n'),
    };
  }

  const metaBlock = match[1] || '';
  const body = normalized.slice(match[0].length);
  return { meta: parseFrontmatterBlock(metaBlock), body };
}

function inferTitleFromMarkdown(body: string): string | undefined {
  const m = /^#\s+(.+)\s*$/m.exec(body);
  if (!m) return undefined;
  const t = m[1].trim();
  return t ? t : undefined;
}

// Content files mapping
const contentFiles: Record<string, string> = {
  accueil: '/content/accueil.md',
  vision: '/content/vision.md',
  histoire: '/content/histoire.md',
  programmes: '/content/programmes.md',
  excellence: '/content/excellence.md',
  admissions: '/content/admissions.md',
  contact: '/content/contact.md',
  visite: '/content/visite.md',
  'mentions-legales': '/content/mentions-legales.md',
  confidentialite: '/content/confidentialite.md',
};

export function getContentFilePath(pageName: string): string | null {
  return contentFiles[pageName] || null;
}

// Cache for loaded content
const contentCache: Map<string, ParsedContent> = new Map();

async function tryLoadPublishedMarkdown(pageName: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/page-content?page=${encodeURIComponent(pageName)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { document?: unknown };
    const doc = data && (data as any).document;
    if (!doc) return null;
    if (doc.kind !== 'markdown') return null;
    if (typeof doc.payload !== 'string') return null;
    return doc.payload;
  } catch {
    return null;
  }
}

/**
 * Load and parse a markdown content file
 */
export async function loadContent(pageName: string): Promise<ParsedContent | null> {
  const publishedMarkdown = await tryLoadPublishedMarkdown(pageName);
  if (publishedMarkdown) {
    const { meta: extractedMeta, body } = extractFrontmatter(publishedMarkdown);
    const content = body;
    const titleFromBody = inferTitleFromMarkdown(body);
    const meta: ContentMeta = {
      title: '',
      ...(extractedMeta as ContentMeta),
    };
    if (!meta.title && titleFromBody) meta.title = titleFromBody;

    let html = '';
    try {
      html = renderMarkdownToHtml(pageName, content);
    } catch (e) {
      console.error(`Error rendering markdown for ${pageName}:`, e);
      const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      html = `<pre>${escaped}</pre>`;
    }

    const parsed: ParsedContent = {
      meta,
      content,
      html,
    };
    return parsed;
  }

  if (contentCache.has(pageName)) {
    return contentCache.get(pageName)!;
  }

  const filePath = contentFiles[pageName];
  if (!filePath) {
    console.warn(`Content file not found for page: ${pageName}`);
    return null;
  }

  try {
    const res = await fetch(filePath);
    if (!res.ok) {
      throw new Error(`Failed to fetch markdown: ${filePath} (${res.status})`);
    }

    const rawContent = await res.text();
    const { meta: extractedMeta, body } = extractFrontmatter(rawContent);
    const content = body;
    const titleFromBody = inferTitleFromMarkdown(body);
    const meta: ContentMeta = {
      title: '',
      ...(extractedMeta as ContentMeta),
    };
    if (!meta.title && titleFromBody) meta.title = titleFromBody;

    let html = '';
    try {
      html = renderMarkdownToHtml(pageName, content);
    } catch (e) {
      console.error(`Error rendering markdown for ${pageName}:`, e);
      const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      html = `<pre>${escaped}</pre>`;
    }

    const parsed: ParsedContent = {
      meta,
      content,
      html,
    };

    // Cache the result
    contentCache.set(pageName, parsed);

    return parsed;
  } catch (error) {
    console.error(`Error loading content for ${pageName}:`, error);
    return null;
  }
}

/**
 * Get content metadata only (faster, no HTML parsing)
 */
export async function getContentMeta(pageName: string): Promise<ContentMeta | null> {
  const content = await loadContent(pageName);
  return content?.meta || null;
}

/**
 * Clear the content cache (useful for development)
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Preload all content files
 */
export async function preloadAllContent(): Promise<void> {
  const pages = Object.keys(contentFiles);
  await Promise.all(pages.map(page => loadContent(page)));
}

// Export page names for type safety
export type PageName = keyof typeof contentFiles;
export const pageNames = Object.keys(contentFiles) as PageName[];
