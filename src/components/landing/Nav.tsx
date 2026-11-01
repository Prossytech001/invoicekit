"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import Logo from "./Logo";
import { api, User } from "@/lib/api";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#templates", label: "Templates" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [signedIn, setSignedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);


 useEffect(() => {
    api<User>("/auth/me").then(setUser).catch(() => setUser(null));
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${scrolled || open ? "bg-ink-deep/85 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Invoice Kit home"><Logo dark /></Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {links.map((l) => <a key={l.href} href={l.href} className="text-sm text-white/80 hover:text-white">{l.label}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {signedIn ? (
            <Link href="/dashboard" className="btn-primary">Open dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="btn text-white/85 hover:text-white">Log in</Link>
              <Link href="/register" className="btn-primary">Start free</Link>
            </>
          )}
        </div>
        <button className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-white/10 px-4 pb-4 pt-2 md:hidden">
          {links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-2 py-2.5 text-white/85 hover:bg-white/10">{l.label}</a>)}
          <div className="flex gap-2 pt-2">
            {signedIn ? <Link href="/dashboard" className="btn-primary flex-1">Open dashboard</Link> : (
              <>
                <Link href="/login" className="btn flex-1 border border-white/30 text-white">Log in</Link>
                <Link href="/register" className="btn-primary flex-1">Start free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
