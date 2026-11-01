// Canonical invoice data. All money is INTEGER MINOR UNITS (cents, kobo).
export type Money = number;

export interface LineItem {
  id: string;
  description: string;
  qty: string;          // decimal string, e.g. "1", "2.5"
  unitPrice: Money;     // minor units
}

export interface Adjustment {
  type: "percent" | "fixed";
  value: string;        // percent as decimal string ("7.5") or fixed in minor units ("5000")
}

export interface InvoiceData {
  business: { name: string; address?: Record<string, string>; logo?: string; taxId?: string };
  customer: { name: string; email?: string; phone?: string; address?: Record<string, string> };
  invoice: {
    number: string; issueDate: string; dueDate?: string; currency: string;
    paymentMethod?: string; notes?: string; terms?: string;
  };
  items: LineItem[];
  discount?: Adjustment;
  taxes?: { label: string; rate: string }[];
  extraCharges?: { label: string; amount: Money }[];
  payment?: { details?: string };
  extras: Record<string, unknown>;             // template-specific fields live here
}

export interface Totals {
  lineTotals: Record<string, Money>;
  subtotal: Money;
  discount: Money;
  taxable: Money;
  taxes: { label: string; amount: Money }[];
  extraCharges: Money;
  total: Money;
}
