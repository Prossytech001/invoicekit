// Calls the Express backend through the Next.js /api proxy. The session lives in an httpOnly
// cookie, so there is no token handling in the browser.
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "same-origin",
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export type User = { id: string; email: string; display_name: string | null; default_currency: string };
