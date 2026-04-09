export type Operator = {
  id: string;
  displayName: string;
  role: string;
  active: boolean;
  mustChangePassword: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type OperatorsResponse = {
  operators: Operator[];
};

const jsonHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export async function fetchOperators(token: string): Promise<OperatorsResponse> {
  const res = await fetch('/api/admin-operators/', {
    headers: jsonHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Impossible de charger les opérateurs');
  }
  return res.json();
}

export async function createOperator(token: string, displayName?: string): Promise<{ ok: boolean; operator: Operator; tempPassword: string; }> {
  const res = await fetch('/api/admin-operators/', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ action: 'create', displayName }),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).error || 'Création impossible';
    throw new Error(msg);
  }
  return res.json();
}

export async function toggleOperator(token: string, id: string): Promise<{ ok: boolean; operator: Operator; }> {
  const res = await fetch('/api/admin-operators/', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ action: 'toggle', id }),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).error || 'Mise à jour impossible';
    throw new Error(msg);
  }
  return res.json();
}

export async function resetOperatorPassword(token: string, id: string): Promise<{ ok: boolean; operator: Operator; tempPassword: string; }> {
  const res = await fetch('/api/admin-operators/', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ action: 'reset_password', id }),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).error || 'Reset impossible';
    throw new Error(msg);
  }
  return res.json();
}

export async function clearOperatorLockout(token: string, id: string): Promise<{ ok: boolean; }> {
  const res = await fetch('/api/admin-operators/', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ action: 'clear_lockout', id }),
  });
  if (!res.ok) {
    const msg = (await res.json().catch(() => ({}))).error || 'Impossible de débloquer';
    throw new Error(msg);
  }
  return res.json();
}
