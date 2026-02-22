export type AdminBackupResponse = {
  ok: boolean;
  fileName: string;
  downloadUrl: string;
  savedPath: string;
  createdAt: string;
};

export async function createAdminBackup(token: string): Promise<AdminBackupResponse> {
  const res = await fetch('/api/admin-backup/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Backup request failed: ${res.status}`);
  }

  return (await res.json()) as AdminBackupResponse;
}

export async function downloadAdminBackup(token: string, downloadUrl: string, fileName: string) {
  const res = await fetch(downloadUrl, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Backup download failed: ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
