import { useEffect, useState } from 'react';
import { fetchPageContent } from '@/lib/pageContentApi';

type Source = 'published' | 'fallback';

export function usePageJsonContent<T>(page: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [source, setSource] = useState<Source>('fallback');

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const doc = await fetchPageContent(page);
        if (!doc || doc.kind !== 'json') {
          if (isMounted) {
            setValue(fallback);
            setSource('fallback');
          }
          return;
        }

        const parsed = JSON.parse(doc.payload) as T;
        if (isMounted) {
          setValue(parsed);
          setSource('published');
        }
      } catch (e) {
        if (isMounted) {
          setValue(fallback);
          setSource('fallback');
          setError(e instanceof Error ? e : new Error('Failed to load page JSON content'));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [page, fallback]);

  return { value, isLoading, error, source };
}
