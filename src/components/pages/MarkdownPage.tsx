import React from 'react';
import Hero from '@/components/ui/Hero';
import { useContent } from '@/hooks/useContent';
import type { PageName } from '@/lib/content';

type HeroCtas = {
  ctaPrimary?: { text: string; link: string };
  ctaSecondary?: { text: string; link: string };
};

function getString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value;
  return undefined;
}

interface MarkdownPageProps extends HeroCtas {
  pageName: PageName;
  showHero?: boolean;
}

function getCtaFromMeta(meta: Record<string, unknown>, key: string, defaultLink: string) {
  const text = getString(meta[key]);
  if (!text) return undefined;
  const link = getString(meta[`${key}Link`]) || defaultLink;
  return { text, link };
}

const MarkdownPage: React.FC<MarkdownPageProps> = ({ pageName, showHero = true, ctaPrimary, ctaSecondary }) => {
  const { content, isLoading, error } = useContent(pageName);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          Chargement...
        </div>
      </section>
    );
  }

  if (error || !content) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-600">
          Contenu indisponible.
        </div>
      </section>
    );
  }

  const title = getString(content.meta.title) || '';
  const subtitle = getString(content.meta.subtitle);
  const description = getString(content.meta.description);

  const defaultPrimaryLink = pageName === 'accueil' ? '/programmes' : '/';
  const defaultSecondaryLink = pageName === 'accueil' ? '/visite' : '/';

  const resolvedCtaPrimary =
    ctaPrimary || getCtaFromMeta(content.meta as Record<string, unknown>, 'ctaPrimary', defaultPrimaryLink);
  const resolvedCtaSecondary =
    ctaSecondary || getCtaFromMeta(content.meta as Record<string, unknown>, 'ctaSecondary', defaultSecondaryLink);

  return (
    <>
      {showHero && (
        <Hero
          title={title}
          subtitle={subtitle}
          description={description}
          ctaPrimary={resolvedCtaPrimary}
          ctaSecondary={resolvedCtaSecondary}
          size="medium"
        />
      )}

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg"
            dangerouslySetInnerHTML={{ __html: content.html }}
          />
        </div>
      </section>
    </>
  );
};

export default MarkdownPage;
