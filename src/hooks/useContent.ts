// Hook to load and use markdown content in React components

import { useState, useEffect } from 'react';
import { loadContent, ParsedContent, PageName } from '@/lib/content';

interface UseContentResult {
  content: ParsedContent | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * React hook to load content for a specific page
 */
export function useContent(pageName: PageName): UseContentResult {
  const [content, setContent] = useState<ParsedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loadContent(pageName);
        if (isMounted) {
          setContent(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load content'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [pageName]);

  return { content, isLoading, error };
}

/**
 * Get just the metadata from content
 */
export function useContentMeta(pageName: PageName) {
  const { content, isLoading, error } = useContent(pageName);
  return {
    meta: content?.meta || null,
    isLoading,
    error,
  };
}
