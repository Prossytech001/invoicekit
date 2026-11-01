import { formatMoney } from "@/engine/calculate";
import { fmtDate } from "@/lib/invoice-utils";
import type { TemplateProps } from "../types";
import SignatureBlock from "../SignatureBlock";

const SERIF = "Georgia, 'Times New Roman', serif";

function Val({ v, ph }: { v?: string; ph: string }) {
  return v && v.trim() ? <>{v}</> : <span className="text-gray-300">{ph}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">{children}</div>;
}

export default function FormalFeeHeaderTemplate({ data, totals, accent }: TemplateProps) {
  const { business, customer, invoice, items, taxes, payment, extras } = data;
  const cur = invoice.currency || "USD";
  const money = (n: number) => formatMoney(n, cur);
  const taxRate = taxes[0]?.rate || "0";
  const dueTerms = String(extras.dueTerms ?? "On Receipt");
  const due = dueTerms === "Specific date" ? fmtDate(invoice.dueDate) : dueTerms;
  const contact = [business.email, business.phone].filter(Boolean).join("  ·  ");

  return (
    <div
      className="relative text-[13px] leading-relaxed text-gray-800"
      style={{ minHeight: 1123, padding: "56px 56px 48px", fontFamily: "Arial, Helvetica, sans-serif" }}
    >
              {/* Watermark (the user's logo, faded) */}
      {business.logo && extras.showWatermark !== false && (
        <div data-watermark className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={business.logo}
            alt=""
            style={{ width: 460, maxHeight: 460, objectFit: "contain", opacity: Number(extras.watermarkOpacity ?? 8) / 100 }}
          />
        </div>
      )}
      {/* Header */}
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-[330px]">
          <div className="whitespace-pre-line text-[15px] font-bold text-gray-900">
            <Val v={business.name} ph="Your business name" />
          </div>
          <div className="mt-2 whitespace-pre-line text-[11px] text-gray-500">{business.address}</div>
          {contact && <div className="mt-1 text-[11px] text-gray-500">{contact}</div>}
        </div>
                {business.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.logo} alt="Logo" style={{ maxWidth: 130, maxHeight: 90, objectFit: "contain" }} />
        )}
        <div className="text-right">
          <div style={{ fontFamily: SERIF, letterSpacing: "0.14em", color: accent }} className="text-[34px] leading-none">
            INVOICE
          </div>
          <div className="mt-2 text-[11px] font-bold text-gray-500">
            <Val v={invoice.number} ph="INV-0001" />
          </div>
          <div className="mt-5 text-[10px] tracking-[0.15em] text-gray-400">AMOUNT DUE</div>
          <div style={{ fontFamily: SERIF, color: accent }} className="text-[26px]">{money(totals.total)}</div>
        </div>
      </div>

      {extras.subject ? <div className="mt-6 text-[12px] text-gray-600">{String(extras.subject)}</div> : null}
      <div className="my-7 h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

      {/* Bill to + dates */}
      <div className="flex justify-between gap-8">
        <div className="max-w-[360px]">
          <Label>Bill to</Label>
          <div className="mt-2 text-[14px] font-bold text-gray-900"><Val v={customer.name} ph="Client name" /></div>
          {customer.email && <div className="text-gray-500">{customer.email}</div>}
          {customer.phone && <div className="text-gray-500">{customer.phone}</div>}
          {customer.address && <div className="whitespace-pre-line text-gray-500">{customer.address}</div>}
        </div>
        <div className="flex gap-10 text-right">
          <div>
            <Label>Issue date</Label>
            <div className="mt-2 text-gray-600">{fmtDate(invoice.issueDate) || "-"}</div>
          </div>
          <div>
            <Label>Due date</Label>
            <div className="mt-2 text-gray-600">{due || "-"}</div>
          </div>
        </div>
      </div>

      {/* Items */}
      <table className="mt-9 w-full border-collapse">
        <thead>
          <tr style={{ background: "#f5f4ef" }} className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            <th className="px-3 py-3 text-left">Description</th>
            <th className="w-14 px-3 py-3 text-center">Qty</th>
            <th className="w-28 px-3 py-3 text-right">Rate</th>
            <th className="w-28 px-3 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-b border-gray-100 align-top" style={{ breakInside: "avoid" }}>
              <td className="whitespace-pre-line px-3 py-4"><Val v={it.description} ph="Item description" /></td>
              <td className="px-3 py-4 text-center">{it.qty || "1"}</td>
              <td className="px-3 py-4 text-right">{money(it.unitPrice)}</td>
              <td className="px-3 py-4 text-right">{money(totals.lineTotals[it.id] ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 ml-auto w-[300px]" style={{ breakInside: "avoid" }}>
        <div className="flex justify-between border-b border-gray-100 px-3 py-2 text-gray-500">
          <span>Subtotal</span><span className="font-bold text-gray-900">{money(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 px-3 py-2 text-gray-500">
          <span>Tax ({taxRate}%)</span><span className="font-bold text-gray-900">{money(totals.taxes[0]?.amount ?? 0)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between px-3 py-3" style={{ background: "#f5f4ef" }}>
          <span className="text-[10px] font-bold tracking-[0.15em] text-gray-700">TOTAL DUE</span>
          <span style={{ fontFamily: SERIF, color: accent }} className="text-[20px]">{money(totals.total)}</span>
        </div>
      </div>

      {/* Notes + payment */}
      {invoice.notes && (
        <div className="mt-10" style={{ breakInside: "avoid" }}>
          <Label>Notes / payment terms</Label>
          <div className="mt-2 whitespace-pre-line text-[12px] leading-6 text-gray-600">{invoice.notes}</div>
        </div>
      )}
      {(payment.details || invoice.paymentMethod) && (
        <div className="mt-7" style={{ breakInside: "avoid" }}>
          <Label>Payment details</Label>
          <div className="mt-2 whitespace-pre-line text-[12px] leading-6 text-gray-600">
            {invoice.paymentMethod}
            {invoice.paymentMethod && payment.details ? "\n" : ""}
            {payment.details}
          </div>
        </div>
      )}

      {/* Signature */}
            {/* Signature */}
      {extras.showSignature ? <SignatureBlock extras={extras} variant="inline" /> : null}

      <div className="mt-6 flex justify-between text-[10px] text-gray-400">
        <span>Thank you for choosing <b className="text-gray-500">{business.name || "us"}</b>.</span>
        <span>{invoice.number}</span>
      </div>
    </div>
  );
}