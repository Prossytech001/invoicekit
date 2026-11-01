import { formatMoney } from "@/engine/calculate";
import { fmtDate } from "@/lib/invoice-utils";
import type { TemplateProps } from "../types";
import SignatureBlock from "../SignatureBlock";

function Val({ v, ph }: { v?: string; ph: string }) {
  return v && v.trim() ? <>{v}</> : <span className="text-gray-300">{ph}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{children}</div>;
}

export default function FormalFeeCenteredTemplate({ data, totals, accent }: TemplateProps) {
  const { business, customer, invoice, items, taxes, payment, extras } = data;
  const cur = invoice.currency || "USD";
  const money = (n: number) => formatMoney(n, cur);
  const taxRate = taxes[0]?.rate || "0";
  const showTax = Number(taxRate) > 0;
  const dueTerms = String(extras.dueTerms ?? "On Receipt");
  const due = dueTerms === "Specific date" ? fmtDate(invoice.dueDate) : dueTerms;
  const contact = [business.email, business.phone].filter(Boolean).join("\n");

  return (
    <div
      className="relative isolate text-[13px] leading-relaxed text-gray-900"
      style={{ minHeight: 1123, padding: "48px 56px", fontFamily: "Roboto, Arial, Helvetica, sans-serif" }}
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

      {/* Centered header */}
      <div className="flex flex-col items-center text-center">
        {business.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.logo} alt="Logo" style={{ maxWidth: 260, maxHeight: 90, objectFit: "contain" }} />
        )}
        <div className="mt-6 text-[40px] font-light leading-none tracking-wide" style={{ color: accent }}>INVOICE</div>
        {extras.subject ? <div className="mt-3 text-[13px] italic text-gray-500">{String(extras.subject)}</div> : null}
      </div>
      <div className="mt-6 h-[3px]" style={{ background: accent }} />

      {/* From / To / details */}
      <div className="mt-5 grid grid-cols-[1.1fr_1.1fr_0.9fr] gap-6">
        <div>
          <Label>From</Label>
          <div className="mt-1 font-bold"><Val v={business.name} ph="Your business name" /></div>
          <div className="whitespace-pre-line text-gray-700">{business.address}</div>
          {contact && <div className="mt-1 whitespace-pre-line text-gray-700">{contact}</div>}
        </div>
        <div>
          <Label>To</Label>
          <div className="mt-1 font-bold"><Val v={customer.name} ph="Client name" /></div>
          <div className="whitespace-pre-line text-gray-700">{customer.address}</div>
          {customer.phone && <div className="text-gray-700">Phone: {customer.phone}</div>}
          {customer.email && <div className="text-gray-700">Email: {customer.email}</div>}
        </div>
        <div className="space-y-2 text-right">
          <div><Label>Invoice no.</Label><div className="font-bold"><Val v={invoice.number} ph="INV-0001" /></div></div>
          <div><Label>Invoice date</Label><div className="font-bold">{fmtDate(invoice.issueDate) || "-"}</div></div>
          <div><Label>Due date</Label><div className="font-bold">{due || "-"}</div></div>
          {invoice.paymentMethod && <div><Label>Payment method</Label><div className="font-bold">{invoice.paymentMethod}</div></div>}
        </div>
      </div>

      {/* Itemization */}
      <div className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-gray-500">Itemization</div>
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr style={{ background: accent }} className="text-[13px] text-white">
            <th className="px-3 py-2.5 text-left font-medium">Description</th>
            <th className="w-36 px-3 py-2.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id} className="border-b border-gray-200 align-top" style={{ background: i % 2 ? "#f3f4f8" : "transparent", breakInside: "avoid" }}>
              <td className="whitespace-pre-line px-3 py-2.5"><Val v={it.description} ph="Item description" /></td>
              <td className="px-3 py-2.5 text-right">{money(totals.lineTotals[it.id] ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ breakInside: "avoid" }}>
        <div className="flex justify-between border-b border-gray-200 px-3 py-2.5">
          <span>Subtotal</span><span>{money(totals.subtotal)}</span>
        </div>
        {showTax && (
          <div className="flex justify-between border-b border-gray-200 px-3 py-2.5">
            <span>Tax ({taxRate}%)</span><span>{money(totals.taxes[0]?.amount ?? 0)}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-3">
          <span className="text-[17px] font-medium" style={{ color: accent }}>Total</span>
          <span className="text-[17px] font-medium" style={{ color: accent }}>{money(totals.total)}</span>
        </div>
      </div>

      {payment.details && (
        <div className="mt-8" style={{ breakInside: "avoid" }}>
          <Label>Account details for payment</Label>
          <div className="mt-1 whitespace-pre-line">{payment.details}</div>
        </div>
      )}

      {invoice.notes && (
        <div className="mt-8" style={{ breakInside: "avoid" }}>
          <Label>Notes</Label>
          <div className="mt-1 whitespace-pre-line text-[12px] leading-5 text-gray-700">{invoice.notes}</div>
        </div>
      )}

           {extras.showSignature ? <SignatureBlock extras={extras} variant="stacked" /> : null}
    </div>
  );
}