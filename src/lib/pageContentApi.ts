export type PageContentKind = 'markdown' | 'json';

export type PageContentDocument = {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  page: string;
  kind: PageContentKind;
  payload: string;
  updatedAt?: string;
};

export async function fetchPageContent(page: string): Promise<PageContentDocument | null> {
  const res = await fetch(`/api/page-content?page=${encodeURIComponent(page)}`);
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as { document?: PageContentDocument | null };
  return (data && data.document) || null;
}

export async function publishPageContent(
  token: string,
  page: string,
  kind: PageContentKind,
  payload: string
): Promise<PageContentDocument> {
  const res = await fetch(`/api/page-content?page=${encodeURIComponent(page)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ kind, payload }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  const data = (await res.json()) as { document: PageContentDocument };
  return data.document;
}
