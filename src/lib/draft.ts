import type { LineItem } from "@/engine/types";
import type { InvoiceDraft } from "@/templates/types";

export const newItem = (): LineItem => ({ id: crypto.randomUUID(), description: "", qty: "1", unitPrice: 0 });

export const newDraft = (): InvoiceDraft => ({
  business: { name: "", address: "", email: "", phone: "" },
  customer: { name: "", email: "", phone: "", address: "" },
  invoice: {
    number: "",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    currency: "USD",
    paymentMethod: "",
    notes: "",
  },
  items: [newItem()],
  taxes: [{ label: "Tax", rate: "0" }],
  payment: { details: "" },
  extras: { dueTerms: "On Receipt", showSignature: true, subject: "", showWatermark: true, watermarkOpacity: 8 },
});

// Fills in any missing fields (older drafts, saved invoices) with defaults.
export const mergeDraft = (d?: Partial<InvoiceDraft> | null): InvoiceDraft => {
  const base = newDraft();
  if (!d) return base;
  return {
    ...base,
    ...d,
    business: { ...base.business, ...d.business },
    customer: { ...base.customer, ...d.customer },
    invoice: { ...base.invoice, ...d.invoice },
    payment: { ...base.payment, ...d.payment },
    items: d.items?.length ? d.items : base.items,
    taxes: d.taxes?.length ? d.taxes : base.taxes,
    extras: { ...base.extras, ...d.extras },
  };
};