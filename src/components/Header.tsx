"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, User } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api<User>("/auth/me").then(setUser).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-8 py-3">
        <Link href="/" className="font-bold">InvoiceKit</Link>
        <div className="flex items-center gap-4 text-sm">
          {!ready ? null : user ? (
            <>
              <span className="text-gray-600">{user.display_name ?? user.email}</span>
              <button onClick={logout} className="text-blue-600 underline">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-600 underline">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
