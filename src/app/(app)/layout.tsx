"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/landing/Logo";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/invoices", label: "Invoices" },
  { href: "/emails", label: "Emails" },
  { href: "/customers", label: "Customers" },
  { href: "/documents", label: "Documents" },
  { href: "/settings", label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/login");
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  useEffect(() => setOpen(false), [pathname]);

  if (!ready) return <div className="p-8 text-sm text-muted">Loading...</div>;

  return (
    <div className="min-h-screen md:flex">
      <header className="flex items-center justify-between bg-ink px-4 py-3 text-white md:hidden">
        <Link href="/dashboard"><Logo dark size={26} /></Link>
        <button className="rounded border border-white/30 px-3 py-1 text-sm" onClick={() => setOpen(!open)} aria-expanded={open}>Menu</button>
      </header>
      <aside className={`${open ? "block" : "hidden"} bg-ink text-white md:block md:w-56 md:shrink-0`}>
        <div className="sticky top-0 flex h-full flex-col p-4 md:h-screen">
          <Link href="/dashboard" className="mb-6 hidden md:block"><Logo dark /></Link>
          <nav className="flex flex-col gap-1">
            {nav.map((n) => {
              const active = pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Link key={n.href} href={n.href} className={`rounded-md px-3 py-2 text-sm ${active ? "bg-white/15 font-medium" : "text-white/75 hover:bg-white/10"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button className="mt-4 rounded-md px-3 py-2 text-left text-sm text-white/75 hover:bg-white/10 md:mt-auto"
            onClick={async () => { await supabase.auth.signOut(); router.replace("/login"); }}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
