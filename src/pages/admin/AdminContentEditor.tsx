import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { fetchPageContent, publishPageContent } from '@/lib/pageContentApi';
import {
  homeContent,
  visiteContent,
  visionContent,
  histoireContent,
  contactContent,
  mentionsLegalesContent,
  confidentialiteContent,
  programmesContent,
  admissionsContent,
} from '@/data/content';
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
import { FileText, LogOut, Monitor, Settings, BriefcaseBusiness, ExternalLink } from 'lucide-react';

const pageLabels: Record<string, string> = {
  accueil: 'Accueil',
  visite: 'Visite',
  'notre-ecole': 'Notre École',
  vision: 'Vision',
  histoire: 'Histoire',
  contact: 'Contact',
  'mentions-legales': 'Mentions Légales',
  confidentialite: 'Confidentialité',
  programmes: 'Programmes',
  admissions: 'Admissions',
  actualites: 'Actualités',
};

type Source = 'published' | 'local' | 'empty';

function getDefaultJsonPayload(page: string): string {
  switch (page) {
    case 'accueil':
      return JSON.stringify(homeContent, null, 2);
    case 'visite':
      return JSON.stringify(visiteContent, null, 2);
    case 'vision':
      return JSON.stringify(visionContent, null, 2);
    case 'histoire':
      return JSON.stringify(histoireContent, null, 2);
    case 'contact':
      return JSON.stringify(contactContent, null, 2);
    case 'mentions-legales':
      return JSON.stringify(mentionsLegalesContent, null, 2);
    case 'confidentialite':
      return JSON.stringify(confidentialiteContent, null, 2);
    case 'programmes':
      return JSON.stringify(programmesContent, null, 2);
    case 'admissions':
      return JSON.stringify(admissionsContent, null, 2);
    case 'notre-ecole':
    case 'actualites':
      return JSON.stringify({}, null, 2);
    default:
      return JSON.stringify({}, null, 2);
  }
}

const AdminContentEditor: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, logout, token } = useAdminAuth();
  const navigate = useNavigate();

  const allPages = useMemo(
    () => [
      'accueil',
      'visite',
      'notre-ecole',
      'vision',
      'histoire',
      'contact',
      'mentions-legales',
      'confidentialite',
      'programmes',
      'admissions',
      'actualites',
    ],
    []
  );

  const [page, setPage] = useState<string>(allPages[0] || 'accueil');
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
            setPayload(published.payload);
            setSource('published');
          }
          return;
        }

        if (isMounted) {
          setPayload(getDefaultJsonPayload(page));
          setSource('local');
        }
      } catch {
        if (isMounted) {
          setPayload(getDefaultJsonPayload(page));
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

  const canPublish = useMemo(() => {
    if (!token) return false;
    if (!payload.trim()) return false;
    try {
      JSON.parse(payload);
    } catch {
      return false;
    }
    return true;
  }, [payload, token]);

  const onPublish = async () => {
    if (!token) return;

    setIsPublishing(true);
    try {
      await publishPageContent(token, page, 'json', payload);
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

          <Link
            to="/ecqm19-admin/visual"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <Monitor className="w-5 h-5" />
            Éditeur visuel
          </Link>

          <Link
            to="/ecqm19-admin/jobs"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-orange-200 hover:text-white"
          >
            <BriefcaseBusiness className="w-5 h-5" />
            Offres d'emploi
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-orange-200 hover:text-white hover:bg-white/10"
          >
            <ExternalLink className="w-5 h-5" />
            Voir le site
          </a>
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
                          {pageLabels[p] || p}
                        </SelectItem>
                      ))}
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
                <div className="mt-2 text-xs text-gray-500">Le JSON doit être valide pour publier.</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Aperçu</h3>
              </div>

              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-xl p-4">
                {payload}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContentEditor;
