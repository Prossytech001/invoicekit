import Link from "next/link";
import { formatMoney } from "@/engine/calculate";
import { InvoiceListRow, statusBadge } from "@/lib/invoice-types";
import { serverApi } from "@/lib/server-session";
import { getTemplate } from "@/templates/registry";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Drafts", value: "draft" },
  { label: "Issued", value: "issued" },
  { label: "Archived", value: "archived" },
];

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "", q = "" } = await searchParams;

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q.trim()) params.set("q", q.trim());
  const qs = params.toString();
  const invoices = (await serverApi<InvoiceListRow[]>(`/invoices${qs ? `?${qs}` : ""}`)) ?? [];

  const tabHref = (value: string) => {
    const p = new URLSearchParams();
    if (value) p.set("status", value);
    if (q.trim()) p.set("q", q.trim());
    return `/invoices${p.toString() ? `?${p}` : ""}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full border border-gray-200 bg-white p-1">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={tabHref(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                status === f.value ? "bg-emerald-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <form method="get" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search client or number"
            className="w-56 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          />
          <button className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Search</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        {invoices.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-gray-900">{status || q ? "No invoices match your search" : "No saved invoices yet"}</p>
            <p className="mt-1 text-sm text-gray-500">Create one from a template and press Save draft.</p>
            <Link href="/templates" className="mt-5 inline-block rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
              Browse templates
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Template</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <Link href={`/invoices/${inv.id}`} className="font-medium text-emerald-900 hover:underline">
                      {inv.invoice_number ?? "No number"}
                    </Link>
                    {inv.parent_invoice_id && <span className="ml-2 text-xs text-gray-400">revision</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{inv.customer_name || "Untitled client"}</td>
                  <td className="px-5 py-3.5 text-gray-500">{getTemplate(inv.template_id)?.manifest.name ?? inv.template_id}</td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-gray-900">
                    {inv.total_minor != null ? formatMoney(Number(inv.total_minor), inv.currency) : "-"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[inv.status]}`}>{inv.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}