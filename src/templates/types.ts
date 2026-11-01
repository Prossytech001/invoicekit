import type { ComponentType } from "react";
import type { LineItem, Totals } from "@/engine/types";

// The canonical invoice data every template reads. Templates differ in layout, not in data,
// so switching templates keeps everything the user typed.
export interface InvoiceDraft {
  business: { name: string; address: string; email: string; phone: string; logo?: string };
  customer: { name: string; email: string; phone: string; address: string };
  invoice: {
    number: string; issueDate: string; dueDate: string; currency: string;
    paymentMethod: string; notes: string;
  };
  items: LineItem[];
  taxes: { label: string; rate: string }[];
  payment: { details: string };
  extras: Record<string, unknown>; // template-specific fields live here
}

export type FieldType = "text" | "textarea" | "email" | "tel" | "date" | "select" | "checkbox" | "image" | "range" | "signature";

export interface FieldDef {
  key: string;                 // dotted path into InvoiceDraft, e.g. "business.name"
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];          // for select
  full?: boolean;              // span both columns
    min?: number;                // for range
  max?: number;
  step?: number;
  showIf?: { key: string; equals: string | boolean };
}

export type ItemColumn = "description" | "qty" | "rate" | "amount";

export interface SectionDef {
  id: string;
  title: string;
  kind?: "fields" | "items";   // "items" renders the line-items editor + tax
  fields?: FieldDef[];
}

export interface TemplateManifest {
  id: string;                  // must match templates.id in the database
  name: string;
  category: string;
  description: string;
  access: "free" | "premium";
  accent: string;
  itemColumns: ItemColumn[];   // which columns the items table has
  sections: SectionDef[];
}

export interface TemplateProps {
  data: InvoiceDraft;
  totals: Totals;
  accent: string;
}

export interface TemplateDefinition {
  manifest: TemplateManifest;
  Component: ComponentType<TemplateProps>;
}