import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomeContent from '@/components/pages/HomeContent';
import VisiteContent from '@/components/pages/VisiteContent';
import NotreEcoleContent from '@/components/pages/NotreEcoleContent';
import ExcellenceContent from '@/components/pages/ExcellenceContent';
import ContactContent from '@/components/pages/ContactContent';
import MentionsLegalesContent from '@/components/pages/MentionsLegalesContent';
import ConfidentialiteContent from '@/components/pages/ConfidentialiteContent';
import ProgrammesContent from '@/components/pages/ProgrammesContent';
import AdmissionsContent from '@/components/pages/AdmissionsContent';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchPageContent, publishPageContent } from '@/lib/pageContentApi';
import {
  homeContent,
  visiteContent,
  excellenceContent,
  contactContent,
  mentionsLegalesContent,
  confidentialiteContent,
  programmesContent,
  admissionsContent,
} from '@/data/content';
import { EditSessionProvider } from '@/contexts/EditSessionContext';
import { PageJsonOverrideProvider } from '@/contexts/PageJsonOverrideContext';
import { FileText, LogOut, Monitor, Settings } from 'lucide-react';

type EditablePage =
  | 'accueil'
  | 'visite'
  | 'notre-ecole'
  | 'excellence'
  | 'contact'
  | 'mentions-legales'
  | 'confidentialite'
  | 'programmes'
  | 'admissions';

type JsonObject = Record<string, unknown>;

function getFallback(page: EditablePage): JsonObject {
  switch (page) {
    case 'accueil':
      return homeContent as unknown as JsonObject;
    case 'visite':
      return visiteContent as unknown as JsonObject;
    case 'notre-ecole':
      return {} as JsonObject;
    case 'excellence':
      return excellenceContent as unknown as JsonObject;
    case 'contact':
      return contactContent as unknown as JsonObject;
    case 'mentions-legales':
      return mentionsLegalesContent as unknown as JsonObject;
    case 'confidentialite':
      return confidentialiteContent as unknown as JsonObject;
    case 'programmes':
      return programmesContent as unknown as JsonObject;
    case 'admissions':
      return admissionsContent as unknown as JsonObject;
  }
}

const AdminVisualEditor: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();

  const pages: EditablePage[] = useMemo(
    () => [
      'accueil',
      'visite',
      'notre-ecole',
      'excellence',
      'contact',
      'mentions-legales',
      'confidentialite',
      'programmes',
      'admissions',
    ],
    []
  );

  const [page, setPage] = useState<EditablePage>('accueil');
  const [draft, setDraft] = useState<JsonObject | null>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const renderSelectedPage = () => {
    switch (page) {
      case 'accueil':
        return <HomeContent />;
      case 'visite':
        return <VisiteContent />;
      case 'notre-ecole':
        return <NotreEcoleContent />;
      case 'excellence':
        return <ExcellenceContent />;
      case 'contact':
        return <ContactContent />;
      case 'mentions-legales':
        return <MentionsLegalesContent />;
      case 'confidentialite':
        return <ConfidentialiteContent />;
      case 'programmes':
        return <ProgrammesContent />;
      case 'admissions':
        return <AdmissionsContent />;
    }
  };

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
        const doc = await fetchPageContent(page);
        if (doc && doc.kind === 'json' && typeof doc.payload === 'string') {
          const parsed = JSON.parse(doc.payload) as JsonObject;
          if (isMounted) {
            setDraft(parsed);
            setInitialSnapshot(JSON.stringify(parsed));
          }
          return;
        }
      } catch {
        // ignore
      }

      const fallback = getFallback(page);
      if (isMounted) {
        setDraft(fallback);
        setInitialSnapshot(JSON.stringify(fallback));
      }
    };

    load().finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [page]);

  const isDirty = useMemo(() => {
    if (!draft) return false;
    try {
      return JSON.stringify(draft) !== initialSnapshot;
    } catch {
      return true;
    }
  }, [draft, initialSnapshot]);

  const onPublish = async () => {
    if (!token || !draft) return;

    setIsPublishing(true);
    try {
      const payload = JSON.stringify(draft);
      await publishPageContent(token, page, 'json', payload);
      setInitialSnapshot(payload);
      toast({ title: 'Publié', description: `La page '${page}' a été mise à jour.` });
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

          <Link
            to="/ecqm19-admin/content"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <FileText className="w-5 h-5" />
            Publication (texte)
          </Link>

          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/20">
            <Monitor className="w-5 h-5" />
            Éditeur visuel
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
        <div className="max-w-7xl">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Éditeur visuel (v1)</h2>
              <p className="text-gray-600">
                Clique sur les textes encadrés pour modifier, puis “Terminer l’édition” pour publier.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="min-w-[220px]">
                <Label className="mb-2 block">Page</Label>
                <Select value={page} onValueChange={(v) => setPage(v as EditablePage)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-end gap-2 pt-7">
                <div className="text-xs text-gray-500">{isDirty ? 'Modifications non publiées' : 'Publié'}</div>
                <Button onClick={onPublish} disabled={!token || !draft || isPublishing || !isDirty}>
                  {isPublishing ? 'Publication...' : "Terminer l'édition (Publier)"}
                </Button>
              </div>
            </div>
          </div>

          {isLoading || !draft ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <PageJsonOverrideProvider overrides={{ [page]: draft }}>
              <EditSessionProvider page={page} draft={draft} setDraft={setDraft}>
                <div
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
                  onClickCapture={(e) => {
                    const target = e.target as HTMLElement;
                    const anchor = target.closest('a');
                    if (anchor) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <Layout>
                    {renderSelectedPage()}
                  </Layout>
                </div>
              </EditSessionProvider>
            </PageJsonOverrideProvider>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminVisualEditor;
