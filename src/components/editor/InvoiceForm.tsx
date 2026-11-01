"use client";

import { useMemo } from "react";
import { calculate, formatMoney } from "@/engine/calculate";
import { fromMinor, getPath, toMinor } from "@/lib/invoice-utils";
import { useDraft } from "@/store/invoiceStore";
import type { FieldDef, TemplateManifest } from "@/templates/types";
import LogoUpload from "./LogoUpload";
import SignatureField from "./SignatureField";

const input =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20";

function Field({ def }: { def: FieldDef }) {
  const value = useDraft((s) => getPath(s.data, def.key));
  const gate = useDraft((s) => (def.showIf ? getPath(s.data, def.showIf.key) : undefined));
  const setField = useDraft((s) => s.setField);

  if (def.showIf && gate !== def.showIf.equals) return null;

  if (def.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
        <input type="checkbox" className="h-4 w-4 accent-emerald-800" checked={Boolean(value)}
          onChange={(e) => setField(def.key, e.target.checked)} />
        {def.label}
      </label>
    );
  }

    if (def.type === "image") return <LogoUpload fieldKey={def.key} label={def.label} />;
    if (def.type === "signature") return <SignatureField fieldKey={def.key} label={def.label} />;

  if (def.type === "range") {
    const n = typeof value === "number" ? value : Number(value ?? def.min ?? 0);
    return (
      <label className="block sm:col-span-2">
        <span className="mb-1.5 flex justify-between text-xs font-medium text-gray-700">
          {def.label}<span className="text-gray-400">{n}%</span>
        </span>
        <input type="range" min={def.min} max={def.max} step={def.step} value={n} className="w-full accent-emerald-800"
          onChange={(e) => setField(def.key, Number(e.target.value))} />
      </label>
    );
  }

  const str = typeof value === "string" ? value : "";
  return (
    <label className={`block ${def.full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-gray-700">
        {def.label}{def.required && <span className="text-red-500"> *</span>}
      </span>
      {def.type === "textarea" ? (
        <textarea rows={3} className={input} value={str} placeholder={def.placeholder}
          onChange={(e) => setField(def.key, e.target.value)} />
      ) : def.type === "select" ? (
        <select className={input} value={str} onChange={(e) => setField(def.key, e.target.value)}>
          {def.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={def.type} className={input} value={str} placeholder={def.placeholder}
          onChange={(e) => setField(def.key, e.target.value)} />
      )}
    </label>
  );
}

function ItemsEditor({ columns }: { columns: TemplateManifest["itemColumns"] }) {
  const items = useDraft((s) => s.data.items);
  const taxes = useDraft((s) => s.data.taxes);
  const currency = useDraft((s) => s.data.invoice.currency);
  const version = useDraft((s) => s.version);
  const { addItem, updateItem, removeItem, setTaxRate } = useDraft.getState();
  const totals = useMemo(() => calculate({ items, taxes }), [items, taxes]);
  const hasQty = columns.includes("qty");


  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={`${item.id}-${version}-${currency}`} className="rounded-lg border border-gray-200 bg-gray-50/60 p-3">
          <div className="flex items-start gap-2">
            <textarea rows={2} className={input} placeholder={`Item ${idx + 1} description`}
              defaultValue={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })} />
            <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1}
              aria-label="Remove item" className="mt-1 px-2 text-lg text-gray-400 hover:text-red-600 disabled:opacity-30">
              ×
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            {(hasQty || item.qty !== "1") && (
              <label className="w-20">
                <span className="mb-1 block text-[11px] text-gray-500">Qty</span>
                <input className={input} inputMode="decimal" defaultValue={item.qty}
                  onChange={(e) => updateItem(item.id, { qty: e.target.value.replace(/[^0-9.]/g, "") })} />
              </label>
            )}
            <label className="w-32">
              <span className="mb-1 block text-[11px] text-gray-500">{hasQty || item.qty !== "1" ? "Rate" : "Amount"}</span>
              <input className={input} inputMode="decimal" placeholder="0.00"
                defaultValue={fromMinor(item.unitPrice, currency)}
                onChange={(e) => updateItem(item.id, { unitPrice: toMinor(e.target.value, currency) })} />
            </label>
            <div className="ml-auto text-right">
              <span className="block text-[11px] text-gray-500">Line total</span>
              <span className="text-sm font-semibold text-gray-900">{formatMoney(totals.lineTotals[item.id] ?? 0, currency)}</span>
            </div>
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem}
        className="w-full rounded-lg border border-dashed border-emerald-800/40 py-2.5 text-sm font-medium text-emerald-900 hover:bg-emerald-50">
        + Add item
      </button>

      <div className="flex items-end justify-between gap-4 border-t border-gray-200 pt-4">
        <label className="w-32">
          <span className="mb-1 block text-xs font-medium text-gray-700">Tax rate (%)</span>
          <input className={input} inputMode="decimal" defaultValue={taxes[0]?.rate ?? "0"} key={`tax-${version}`}
            onChange={(e) => setTaxRate(e.target.value.replace(/[^0-9.]/g, "") || "0")} />
        </label>
        <dl className="text-right text-sm">
          <div className="flex justify-end gap-6 text-gray-500">
            <dt>Subtotal</dt><dd className="w-28 font-medium text-gray-900">{formatMoney(totals.subtotal, currency)}</dd>
          </div>
          <div className="flex justify-end gap-6 text-gray-500">
            <dt>Tax</dt><dd className="w-28 font-medium text-gray-900">{formatMoney(totals.taxes[0]?.amount ?? 0, currency)}</dd>
          </div>
          <div className="mt-1 flex justify-end gap-6 text-base font-bold text-emerald-950">
            <dt>Total</dt><dd className="w-28">{formatMoney(totals.total, currency)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function InvoiceForm({ manifest }: { manifest: TemplateManifest }) {
  return (
    <div className="space-y-5">
      {manifest.sections.map((section) => (
        <section key={section.id} className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-emerald-950">{section.title}</h3>
          {section.kind === "items" ? (
            <ItemsEditor columns={manifest.itemColumns} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields?.map((f) => <Field key={f.key} def={f} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}