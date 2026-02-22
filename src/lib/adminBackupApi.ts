export type AdminBackupResponse = {
  ok: boolean;
  fileName: string;
  downloadUrl: string;
  savedPath: string;
  createdAt: string;
};

export type BackupItem = {
  fileName: string;
  sizeBytes: number;
  createdAt: string;
  downloadUrl: string;
  savedPath: string;
};

export type BackupListResponse = {
  ok: boolean;
  backups: BackupItem[];
};

export type RestoreMode = 'A' | 'B';

export type AdminRestoreResponse = {
  ok: boolean;
  fileName: string;
  mode: RestoreMode;
  restoredCount: number;
  restoredTargets: string[];
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

export async function listAdminBackups(token: string): Promise<BackupListResponse> {
  const res = await fetch('/api/admin-backup/?action=list', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Backup list failed: ${res.status}`);
  }

  return (await res.json()) as BackupListResponse;
}

export async function restoreAdminBackup(
  token: string,
  params: {
    fileName: string;
    mode: RestoreMode;
    confirmationText: string;
    developerCode?: string;
  }
): Promise<AdminRestoreResponse> {
  const res = await fetch('/api/admin-backup/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'restore',
      fileName: params.fileName,
      mode: params.mode,
      confirmationText: params.confirmationText,
      developerCode: params.developerCode || '',
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Restore request failed: ${res.status}`);
  }

  return (await res.json()) as AdminRestoreResponse;
}
