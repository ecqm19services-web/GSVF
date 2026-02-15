export type AdminUpdateStatusPayload = {
  type: 'contact' | 'admission';
  id: string;
  newStatus: string;
  publicNotes?: string;
};

async function apiFetch<T>(
  url: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function fetchAdminContacts(token: string) {
  return apiFetch<{ documents: unknown[] }>(`/api/admin-contacts/`, token);
}

export async function fetchAdminAdmissions(token: string) {
  return apiFetch<{ documents: unknown[] }>(`/api/admin-admissions/`, token);
}

export async function adminUpdateStatus(token: string, payload: AdminUpdateStatusPayload) {
  return apiFetch<{ updated: unknown }>(`/api/admin-update-status/`, token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
