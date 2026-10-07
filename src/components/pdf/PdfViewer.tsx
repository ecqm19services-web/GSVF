import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
// @ts-ignore -- on inline la SOURCE du worker (raw) pour s'affranchir du MIME serveur (.mjs renvoyé en text/plain sur certains hébergeurs)
import workerSource from 'pdfjs-dist/build/pdf.worker.min.mjs?raw';
import { FileWarning, Loader2 } from 'lucide-react';

// Polyfill Promise.withResolvers (utilisé par pdfjs v4) pour les navigateurs plus anciens
if (typeof (Promise as unknown as { withResolvers?: unknown }).withResolvers !== 'function') {
  (Promise as unknown as { withResolvers: () => unknown }).withResolvers = function (
    this: PromiseConstructor
  ) {
    let resolve!: (value: unknown) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new this((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Worker chargé via une Blob URL (type JS explicite) : plus aucune dépendance au MIME
// renvoyé par le serveur pour le fichier .mjs (corrige l'échec du PDF sur Hostinger/Apache).
const workerBlob = new Blob([workerSource], { type: 'text/javascript' });
pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob);

type Props = {
  src: string;
  className?: string;
};

const PdfViewer: React.FC<Props> = ({ src, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Rend toutes les pages dans le conteneur, à la largeur disponible
  const renderPages = async () => {
    const doc = docRef.current;
    const container = containerRef.current;
    if (!doc || !container) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = container.clientWidth || 900;
    const firstPage = await doc.getPage(1);
    const base = firstPage.getViewport({ scale: 1 });
    const scale = Math.max(cssWidth / base.width, 0.5);
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const viewport = page.getViewport({ scale: scale * dpr });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      canvas.className = 'mb-4 rounded-lg shadow-md ring-1 ring-gray-200 bg-white last:mb-0';
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      container.appendChild(canvas);
      await page.render({ canvasContext: ctx, viewport }).promise;
    }
  };

  // Chargement du document quand la source change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    docRef.current = null;
    (async () => {
      try {
        const task = pdfjsLib.getDocument({ url: src });
        const doc = await task.promise;
        if (cancelled) {
          await doc.destroy();
          return;
        }
        docRef.current = doc;
        await renderPages();
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Re-rend sur redimensionnement (debounce)
  useEffect(() => {
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        if (!loading && !error) renderPages();
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error]);

  return (
    <div className={className}>
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="text-sm">Chargement du document…</span>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
          <FileWarning className="w-10 h-10 text-orange-500" />
          <span className="text-sm">
            Impossible d'afficher le document ici. Utilisez le bouton « Télécharger le PDF ».
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className={loading || error ? 'hidden' : 'w-full'}
        aria-hidden={loading || error}
      />
    </div>
  );
};

export default PdfViewer;
