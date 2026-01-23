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

// Cache for loaded content
const contentCache: Map<string, ParsedContent> = new Map();

/**
 * Load and parse a markdown content file
 */
export async function loadContent(pageName: string): Promise<ParsedContent | null> {
  // Check cache first
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
      html = marked(content) as string;
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
