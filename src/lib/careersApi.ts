import { fetchPageContent, publishPageContent } from '@/lib/pageContentApi';

export type CareerOfferStatus = 'published' | 'closed';

export type CareerOffer = {
  id: string;
  title: string;
  deadline: string;
  summary: string;
  documentUrl: string;
  status: CareerOfferStatus;
  createdAt: string;
};

type CareersPayload = {
  offers: CareerOffer[];
};

const CAREERS_PAGE_KEY = 'carrieres';

function normalizeCareersPayload(raw: unknown): CareersPayload {
  if (!raw || typeof raw !== 'object') {
    return { offers: [] };
  }

  const offers = Array.isArray((raw as { offers?: unknown[] }).offers)
    ? (raw as { offers: CareerOffer[] }).offers
    : [];

  return { offers };
}

export async function fetchCareersPayload(): Promise<CareersPayload> {
  const doc = await fetchPageContent(CAREERS_PAGE_KEY);
  if (!doc?.payload) {
    return { offers: [] };
  }

  try {
    const parsed = JSON.parse(doc.payload);
    return normalizeCareersPayload(parsed);
  } catch {
    return { offers: [] };
  }
}

export async function saveCareersOffers(token: string, offers: CareerOffer[]): Promise<void> {
  const payload = JSON.stringify({ offers }, null, 2);
  await publishPageContent(token, CAREERS_PAGE_KEY, 'json', payload);
}

export async function uploadCareersPdf(token: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('document', file);

  const res = await fetch('/api/upload-document/?folder=carrieres', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || 'Échec de l\'upload du PDF');
  }

  return (await res.json()) as { url: string };
}
