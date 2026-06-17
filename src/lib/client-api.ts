'use client';
// Tiny client-side fetch helpers (JSON in/out, throws on non-2xx with the API message).

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `GET ${path} → ${res.status}`);
  return data as T;
}

export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `POST ${path} → ${res.status}`);
  return data as T;
}
