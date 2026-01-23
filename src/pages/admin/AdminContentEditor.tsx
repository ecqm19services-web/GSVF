import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { pageNames, getContentFilePath, renderMarkdownToHtml } from '@/lib/content';
import { fetchPageContent, publishPageContent, type PageContentKind } from '@/lib/pageContentApi';
import { programmesContent, admissionsContent } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { FileText, LogOut, Settings } from 'lucide-react';

type Source = 'published' | 'local' | 'empty';

function defaultKindForPage(page: string): PageContentKind {
  if (page === 'programmes' || page === 'admissions') return 'json';
  return 'markdown';
}

function getDefaultJsonPayload(page: string): string {
  if (page === 'programmes') return JSON.stringify(programmesContent, null, 2);
  if (page === 'admissions') return JSON.stringify(admissionsContent, null, 2);
  return JSON.stringify({}, null, 2);
}

const AdminContentEditor: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();

  const allPages = useMemo(() => pageNames, []);

  const [page, setPage] = useState<string>(allPages[0] || 'accueil');
  const [kind, setKind] = useState<PageContentKind>(defaultKindForPage(allPages[0] || 'accueil'));
  const [payload, setPayload] = useState<string>('');
  const [source, setSource] = useState<Source>('empty');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/ecqm19-admin');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      try {
        const published = await fetchPageContent(page);
        if (published && published.kind && typeof published.payload === 'string') {
          if (isMounted) {
            setKind(published.kind);
            setPayload(published.payload);
            setSource('published');
          }
          return;
        }

        const defaultKind = defaultKindForPage(page);

        if (defaultKind === 'json') {
          if (isMounted) {
            setKind('json');
            setPayload(getDefaultJsonPayload(page));
            setSource('local');
          }
          return;
        }

        const filePath = getContentFilePath(page);
        if (!filePath) {
          if (isMounted) {
            setKind('markdown');
            setPayload('');
            setSource('empty');
          }
          return;
        }

        const res = await fetch(filePath);
        if (!res.ok) {
          if (isMounted) {
            setKind('markdown');
            setPayload('');
            setSource('empty');
          }
          return;
        }

        const text = await res.text();
        if (isMounted) {
          setKind('markdown');
          setPayload(text);
          setSource('local');
        }
      } catch {
        if (isMounted) {
          const defaultKind = defaultKindForPage(page);
          setKind(defaultKind);
          setPayload(defaultKind === 'json' ? getDefaultJsonPayload(page) : '');
          setSource('empty');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const previewHtml = useMemo(() => {
    if (kind !== 'markdown') return '';
    try {
      return renderMarkdownToHtml(page, payload);
    } catch {
      return '';
    }
  }, [kind, page, payload]);

  const canPublish = useMemo(() => {
    if (!token) return false;
    if (!payload.trim()) return false;
    if (kind === 'json') {
      try {
        JSON.parse(payload);
      } catch {
        return false;
      }
    }
    return true;
  }, [kind, payload, token]);

  const onPublish = async () => {
    if (!token) return;

    setIsPublishing(true);
    try {
      await publishPageContent(token, page, kind, payload);
      setSource('published');
      toast({
        title: 'Publié',
        description: `La page '${page}' a été mise à jour.`,
      });
    } catch (e) {
      toast({
        title: 'Erreur',
        description: e instanceof Error ? e.message : 'Publication impossible',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-full w-72 bg-orange-950 text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Administration</h1>
          <p className="text-orange-200 text-sm">Vision Future</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/ecqm19-admin/dashboard"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <Settings className="w-5 h-5" />
            Tableau de bord
          </Link>

          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/20">
            <FileText className="w-5 h-5" />
            Contenu du site
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <div className="max-w-6xl">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contenu du site</h2>
              <p className="text-gray-600">
                Publie une version qui sera visible immédiatement sur le site (sans redeploy).
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-gray-500">Source: {source}</div>
              <Button onClick={onPublish} disabled={!canPublish || isPublishing}>
                {isPublishing ? 'Publication...' : 'Publier (Terminer l\'édition)'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="mb-2 block">Page</Label>
                  <Select value={page} onValueChange={setPage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPages.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Type</Label>
                  <Select value={kind} onValueChange={(v) => setKind(v as PageContentKind)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="markdown">markdown</SelectItem>
                      <SelectItem value="json">json</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Contenu</Label>
                <Textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="min-h-[420px] font-mono"
                  disabled={isLoading}
                />
                {kind === 'json' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Le JSON doit être valide pour publier.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Aperçu</h3>
                {kind === 'markdown' && (
                  <div className="text-xs text-gray-500">HTML rendu</div>
                )}
              </div>

              {kind === 'markdown' ? (
                <div
                  className="prose prose-lg prose-orange max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-xl p-4">
                  {payload}
                </pre>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContentEditor;
