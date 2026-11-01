import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LineItem } from "@/engine/types";
import { mergeDraft, newDraft, newItem } from "@/lib/draft";
import { setPath } from "@/lib/invoice-utils";
import type { InvoiceDraft } from "@/templates/types";

export { mergeDraft, newDraft };
// const newItem = (): LineItem => ({ id: crypto.randomUUID(), description: "", qty: "1", unitPrice: 0 });

// export const newDraft = (): InvoiceDraft => ({
//   business: { name: "", address: "", email: "", phone: "" },
//   customer: { name: "", email: "", phone: "", address: "" },
//   invoice: {
//     number: "",
//     issueDate: new Date().toISOString().slice(0, 10),
//     dueDate: "",
//     currency: "USD",
//     paymentMethod: "",
//     notes: "",
//   },
//   items: [newItem()],
//   taxes: [{ label: "Tax", rate: "0" }],
//   payment: { details: "" },
//   extras: { dueTerms: "On Receipt", showSignature: true, subject: "", showWatermark: true, watermarkOpacity: 8 },
// });

// // Fills in any missing fields (older drafts, saved invoices) with defaults.
// export const mergeDraft = (d?: Partial<InvoiceDraft> | null): InvoiceDraft => {
//   const base = newDraft();
//   if (!d) return base;
//   return {
//     ...base,
//     ...d,
//     business: { ...base.business, ...d.business },
//     customer: { ...base.customer, ...d.customer },
//     invoice: { ...base.invoice, ...d.invoice },
//     payment: { ...base.payment, ...d.payment },
//     items: d.items?.length ? d.items : base.items,
//     taxes: d.taxes?.length ? d.taxes : base.taxes,
//     extras: { ...base.extras, ...d.extras },
//   };
// };

interface DraftState {
  templateId: string | null;
  invoiceId: string | null; // set once the draft has been saved to the account
  data: InvoiceDraft;
  version: number; // bumps on reset/load so uncontrolled inputs remount
  setTemplate: (id: string) => void;
  setInvoiceId: (id: string | null) => void;
  loadInvoice: (inv: { id: string; template_id: string; data: Partial<InvoiceDraft> }) => void;
  setField: (path: string, value: unknown) => void;
  setTaxRate: (rate: string) => void;
  addItem: () => void;
  updateItem: (id: string, patch: Partial<LineItem>) => void;
  removeItem: (id: string) => void;
  reset: () => void;
}

// One shared draft: switching templates only changes templateId, so compatible data is kept.
export const useDraft = create<DraftState>()(
  persist(
    (set) => ({
      templateId: null,
      invoiceId: null,
      data: newDraft(),
      version: 0,
      setTemplate: (id) => set({ templateId: id }),
      setInvoiceId: (id) => set({ invoiceId: id }),
      loadInvoice: (inv) =>
        set((s) => ({ invoiceId: inv.id, templateId: inv.template_id, data: mergeDraft(inv.data), version: s.version + 1 })),
      setField: (path, value) => set((s) => ({ data: setPath(s.data, path, value) })),
      setTaxRate: (rate) => set((s) => ({ data: { ...s.data, taxes: [{ label: "Tax", rate }] } })),
      addItem: () => set((s) => ({ data: { ...s.data, items: [...s.data.items, newItem()] } })),
      updateItem: (id, patch) =>
        set((s) => ({ data: { ...s.data, items: s.data.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) } })),
      removeItem: (id) =>
        set((s) => ({
          data: { ...s.data, items: s.data.items.length > 1 ? s.data.items.filter((i) => i.id !== id) : s.data.items },
        })),
      reset: () => set((s) => ({ data: newDraft(), invoiceId: null, version: s.version + 1 })),
    }),
    {
      name: "invoicekit-draft",
      version: 1,
      // keep newly added default fields when an older saved draft is loaded
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<DraftState>;
        return { ...current, ...p, data: mergeDraft(p.data) } as DraftState;
      },
    }
  )
);