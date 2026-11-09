"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { calculate } from "@/engine/calculate";
import { api } from "@/lib/api";
import { BillingStatus } from "@/lib/billing";
import { downloadInvoicePdf } from "@/lib/download";
import { useDraft } from "@/store/invoiceStore";
import { getTemplate, templates } from "@/templates/registry";
import type { InvoiceDraft } from "@/templates/types";
import InvoiceForm from "./InvoiceForm";
import ScaledPage from "./ScaledPage";

interface Props {
  templateId: string;
  isNew?: boolean; // arrived from "Use This Template": start with a blank draft
  initial?: { id: string; template_id: string; data: Partial<InvoiceDraft> }; // a saved draft opened from My Invoices
}

export default function InvoiceEditor({ templateId, isNew = false, initial }: Props) {
  const router = useRouter();
  const def = getTemplate(templateId);
  const data = useDraft((s) => s.data);
  const invoiceId = useDraft((s) => s.invoiceId);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"form" | "preview">("form");
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string; link?: boolean } | null>(null);
  const totals = useMemo(() => calculate(data), [data]);

  // The draft lives in localStorage, so decide what to show only after the browser has loaded it.
  useEffect(() => {
    const s = useDraft.getState();
    if (initial) {
      if (s.invoiceId !== initial.id) {
        s.loadInvoice(initial);
        setSavedJson(JSON.stringify(useDraft.getState().data));
      }
    } else if (isNew) {
      s.reset();
      setSavedJson(null);
      router.replace(`/create/${templateId}`); // drop ?new=1 so a refresh keeps the draft
    }
    s.setTemplate(templateId);
    setMounted(true);
  }, [templateId, isNew, initial, router]);

  useEffect(() => {
    api<BillingStatus>("/billing/status").then(setBilling).catch(() => {});
  }, []);

  if (!def) return null;
  if (!mounted) return <div className="h-96 animate-pulse rounded-xl bg-white" />;

  const Template = def.Component;
  const dirty = savedJson !== JSON.stringify(data);
  const status = !invoiceId ? "Not saved yet" : dirty ? "Unsaved changes" : "All changes saved";
  const subscribed = billing?.active === true;

  // Creates or updates the saved invoice and returns its id.
  async function persist(): Promise<string> {
    const body = JSON.stringify({ templateId, data });
    let id = useDraft.getState().invoiceId;
    if (id) {
      await api(`/invoices/${id}`, { method: "PUT", body });
    } else {
      const created = await api<{ id: string }>("/invoices", { method: "POST", body });
      id = created.id;
      useDraft.getState().setInvoiceId(id);
    }
    setSavedJson(JSON.stringify(useDraft.getState().data));
    return id;
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      await persist();
      setMessage({ ok: true, text: "Saved to My Invoices.", link: true });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Could not save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function missingFields(): string[] {
    const missing: string[] = [];
    if (!data.business.name.trim()) missing.push("your business name");
    if (!data.customer.name.trim()) missing.push("the client name");
    if (!data.invoice.number.trim()) missing.push("the invoice number");
    if (totals.total <= 0) missing.push("at least one item with an amount");
    return missing;
  }

  // Subscribers: lock the invoice as final, then download the PDF.
  async function finalizeAndDownload() {
    const missing = missingFields();
    if (missing.length) {
      setMessage({ ok: false, text: `Before finalizing, please add ${missing.join(", ")}.` });
      return;
    }
    setWorking(true);
    setMessage(null);
    try {
      const id = await persist();
      await api(`/invoices/${id}/finalize`, { method: "POST" });
      const filename = `${data.invoice.number.trim() || "invoice"}.pdf`;
      useDraft.getState().reset(); // the saved invoice is final now; the next one starts clean
      try {
        await downloadInvoicePdf(id, filename);
      } catch {
        /* the invoice page has a Download button if this fails */
      }
      router.push(`/invoices/${id}`);
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Could not finalize the invoice.", link: true });
      setWorking(false);
    }
  }

  // Everyone else: keep the draft, then go to the plans page. They come back here afterwards.
  async function goSubscribe() {
    setWorking(true);
    try {
      await persist();
    } catch {
      /* the draft is still kept in this browser */
    }
    sessionStorage.setItem("billingReturn", window.location.pathname);
    router.push("/billing");
  }

  function startOver() {
    if (!window.confirm("Clear the form and start a new invoice? Invoices you already saved are not affected.")) return;
    useDraft.getState().reset();
    setSavedJson(null);
    setMessage(null);
    if (initial) router.push(`/create/${templateId}`);
  }

  const tabBtn = (id: "form" | "preview", label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`flex-1 rounded-full py-2 text-sm font-medium ${tab === id ? "bg-emerald-900 text-white" : "text-gray-600"}`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-emerald-950">{def.manifest.name}</h2>
          <p className={`text-sm ${dirty && invoiceId ? "text-amber-600" : "text-gray-500"}`}>{status}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {/* Switching templates keeps everything typed so far */}
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-gray-500">Template</span>
            <select
              value={templateId}
              onChange={(e) => router.push(`/create/${e.target.value}`)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            >
              {templates.map((t) => (
                <option key={t.manifest.id} value={t.manifest.id}>{t.manifest.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={startOver}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || working}
            className="rounded-full border border-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-50 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save draft"}
          </button>
          <button
            type="button"
            onClick={subscribed ? finalizeAndDownload : goSubscribe}
            disabled={saving || working || billing === null}
            className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {working ? "Please wait..." : subscribed ? "Finalize & Download" : "Subscribe to download"}
          </button>
        </div>
      </div>

      {message && (
        <p
          role={message.ok ? "status" : "alert"}
          className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${message.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {message.text}{" "}
          {message.link && <Link href="/invoices" className="font-semibold underline">View My Invoices</Link>}
        </p>
      )}

      {/* Mobile: switch between form and preview */}
      <div className="mb-4 flex rounded-full border border-gray-200 bg-white p-1 lg:hidden">
        {tabBtn("form", "Form")}
        {tabBtn("preview", "Preview")}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className={tab === "form" ? "block" : "hidden lg:block"}>
          <InvoiceForm manifest={def.manifest} />
        </div>
        <div className={tab === "preview" ? "block" : "hidden lg:block"}>
          <div className="lg:sticky lg:top-24">
            <ScaledPage overlay={subscribed ? undefined : "PREVIEW"}>
              <Template data={data} totals={totals} accent={def.manifest.accent} />
            </ScaledPage>
          </div>
        </div>
      </div>
    </div>
  );
}