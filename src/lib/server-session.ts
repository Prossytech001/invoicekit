import { cache } from "react";
import { cookies } from "next/headers";
import type { User } from "@/lib/api";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:4000";

// Calls the Express backend from a Server Component, forwarding the user's session cookie.
export async function serverApi<T>(path: string): Promise<T | null> {
  const store = await cookies();
  const cookie = store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  if (!cookie) return null;
  try {
    const res = await fetch(`${BACKEND}/api${path}`, { headers: { cookie }, cache: "no-store" });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

// cache() makes the layout and the page share one request
export const getCurrentUser = cache(() => serverApi<User>("/auth/me"));