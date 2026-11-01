import Decimal from "decimal.js";
import type { InvoiceData, Totals } from "./types";

Decimal.set({ rounding: Decimal.ROUND_HALF_UP });

const toMinor = (d: Decimal): number => d.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();

// Order: line totals -> subtotal -> discount -> taxable -> taxes -> extra charges -> total.
// Pure function: identical on client (live preview) and server (PDF / save).
export function calculate(data: Pick<InvoiceData, "items" | "discount" | "taxes" | "extraCharges">): Totals {
  const lineTotals: Totals["lineTotals"] = {};
  let subtotal = 0;
  for (const item of data.items) {
    const line = toMinor(new Decimal(item.qty || 0).mul(item.unitPrice || 0));
    lineTotals[item.id] = line;
    subtotal += line;
  }

  let discount = 0;
  if (data.discount) {
    const v = new Decimal(data.discount.value || 0);
    discount = data.discount.type === "percent"
      ? toMinor(new Decimal(subtotal).mul(v).div(100))
      : toMinor(v);
    discount = Math.min(discount, subtotal);
  }

  const taxable = subtotal - discount;
  const taxes = (data.taxes ?? []).map((t) => ({
    label: t.label,
    amount: toMinor(new Decimal(taxable).mul(t.rate || 0).div(100)),
  }));
  const taxSum = taxes.reduce((s, t) => s + t.amount, 0);
  const extraCharges = (data.extraCharges ?? []).reduce((s, c) => s + c.amount, 0);

  return { lineTotals, subtotal, discount, taxable, taxes, extraCharges, total: taxable + taxSum + extraCharges };
}

// Currency-aware formatting from minor units
export function formatMoney(minor: number, currency: string, locale = "en-US"): string {
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency });
  const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
  return fmt.format(minor / 10 ** digits);
}
