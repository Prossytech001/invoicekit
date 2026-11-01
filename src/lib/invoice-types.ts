import type { InvoiceDraft } from "@/templates/types";

export type InvoiceStatus = "draft" | "issued" | "archived";

// One row in the My Invoices list
export interface InvoiceListRow {
  id: string;
  template_id: string;
  status: InvoiceStatus;
  invoice_number: string | null;
  customer_name: string | null;
  currency: string;
  total_minor: string | number | null;
  parent_invoice_id: string | null;
  created_at: string;
  updated_at: string;
}

// A full invoice from GET /api/invoices/:id
export interface InvoiceRecord extends InvoiceListRow {
  paid_at: string | null;
  data: Partial<InvoiceDraft>;
}

export const statusBadge: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  issued: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-100 text-slate-500",
};