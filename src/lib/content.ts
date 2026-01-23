// Utility to load and parse markdown content files
// This provides a centralized way to manage site content

import matter from 'gray-matter';
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
    const { data, content } = matter(rawContent);
    const html = marked(content) as string;

    const parsed: ParsedContent = {
      meta: data as ContentMeta,
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
