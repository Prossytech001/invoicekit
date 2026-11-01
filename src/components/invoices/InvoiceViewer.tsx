"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ScaledPage from "@/components/editor/ScaledPage";
import { calculate } from "@/engine/calculate";
import { api } from "@/lib/api";
import { mergeDraft } from "@/lib/draft";
import { downloadInvoicePdf, printInvoicePdf } from "@/lib/download";
import { InvoiceRecord, statusBadge } from "@/lib/invoice-types";
import { getTemplate } from "@/templates/registry";

// Read-only view of an issued or archived invoice: download / print, duplicate, revise, archive.
export default function InvoiceViewer({ invoice }: { invoice: InvoiceRecord }) {
  const router = useRouter();
  const def = getTemplate(invoice.template_id);
  const data = useMemo(() => mergeDraft(invoice.data), [invoice.data]);
  const totals = useMemo(() => calculate(data), [data]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function run(kind: "duplicate" | "revise" | "archive" | "download" | "print") {
    if (kind === "archive" && !window.confirm("Archive this invoice?")) return;
    setBusy(kind);
    setError("");
    try {
      if (kind === "archive") {
        await api(`/invoices/${invoice.id}/archive`, { method: "POST" });
        router.refresh();
      } else if (kind === "download") {
        await downloadInvoicePdf(invoice.id, `${invoice.invoice_number ?? "invoice"}.pdf`);
      } else if (kind === "print") {
        await printInvoicePdf(invoice.id);
      } else {
        const copy = await api<{ id: string }>(`/invoices/${invoice.id}/duplicate${kind === "revise" ? "?revise=true" : ""}`, {
          method: "POST",
        });
        router.push(`/invoices/${copy.id}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  const btn = "rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60";
  const primary = "rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60";

  return (
    <div>
      <Link href="/invoices" className="text-sm text-emerald-800 hover:underline">← My Invoices</Link>
      <div className="mb-5 mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-emerald-950">{invoice.invoice_number ?? "Invoice"}</h2>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusBadge[invoice.status]}`}>
            {invoice.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {invoice.paid_at && (
            <>
              <button className={primary} disabled={busy !== null} onClick={() => run("download")}>
                {busy === "download" ? "Preparing PDF..." : "Download PDF"}
              </button>
              <button className={btn} disabled={busy !== null} onClick={() => run("print")}>Print</button>
            </>
          )}
          <button className={btn} disabled={busy !== null} onClick={() => run("duplicate")}>
            {busy === "duplicate" ? "Duplicating..." : "Duplicate"}
          </button>
          {invoice.status === "issued" && (
            <button className={btn} disabled={busy !== null} onClick={() => run("revise")}>
              {busy === "revise" ? "Creating..." : "Create revision"}
            </button>
          )}
          {invoice.status !== "archived" && (
            <button className={btn} disabled={busy !== null} onClick={() => run("archive")}>Archive</button>
          )}
        </div>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

      <div className="mx-auto max-w-3xl">
        {def ? (
          <ScaledPage>
            <def.Component data={data} totals={totals} accent={def.manifest.accent} />
          </ScaledPage>
        ) : (
          <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">This invoice uses a template that is no longer available.</p>
        )}
      </div>
    </div>
  );
}