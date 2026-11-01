import Link from "next/link";
import { formatMoney } from "@/engine/calculate";
import { getCurrentUser, serverApi } from "@/lib/server-session";

type InvoiceRow = {
  id: string;
  status: "draft" | "issued" | "archived";
  invoice_number: string | null;
  customer_name: string | null;
  currency: string;
  total_minor: string | number | null;
  created_at: string;
};

const badge: Record<InvoiceRow["status"], string> = {
  draft: "bg-gray-100 text-gray-700",
  issued: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-100 text-slate-500",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const invoices = (await serverApi<InvoiceRow[]>("/invoices")) ?? [];
  const count = (s: InvoiceRow["status"]) => invoices.filter((i) => i.status === s).length;
  const firstName = (user?.display_name ?? user?.email ?? "there").split(" ")[0];

  const stats = [
    { label: "Total invoices", value: invoices.length },
    { label: "Drafts", value: count("draft") },
    { label: "Issued", value: count("issued") },
    { label: "Archived", value: count("archived") },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-emerald-950">Welcome back, {firstName}</h2>
        <p className="mt-1 text-sm text-gray-600">Pick a template, fill in the details, and download your invoice.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-950">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-emerald-950">Recent invoices</h3>
          {invoices.length > 0 && (
            <Link href="/invoices" className="text-sm font-medium text-emerald-800 hover:underline">View all</Link>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-gray-900">No invoices yet</p>
            <p className="mt-1 text-sm text-gray-500">Start from a template and your invoices will show up here.</p>
            <Link href="/templates" className="mt-5 inline-block rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Browse templates
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invoices.slice(0, 5).map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {inv.customer_name || "Untitled client"}
                    <span className="ml-2 text-gray-400">{inv.invoice_number ?? "No number"}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {inv.total_minor != null && (
                    <span className="text-sm font-semibold text-gray-900">{formatMoney(Number(inv.total_minor), inv.currency)}</span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badge[inv.status]}`}>{inv.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}