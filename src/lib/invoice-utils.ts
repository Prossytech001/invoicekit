import Decimal from "decimal.js";

// ----- money: users type major units ("1,500.50"); we store integer minor units (150050) -----
export function currencyDigits(currency: string): number {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

export function toMinor(text: string, currency: string): number {
  const clean = text.replace(/[^0-9.]/g, "");
  if (!clean || clean === ".") return 0;
  try {
    return new Decimal(clean)
      .mul(new Decimal(10).pow(currencyDigits(currency)))
      .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
      .toNumber();
  } catch {
    return 0;
  }
}

export function fromMinor(minor: number, currency: string): string {
  if (!minor) return "";
  const d = currencyDigits(currency);
  return (minor / 10 ** d).toFixed(d);
}

// ----- dates -----
export function fmtDate(v?: string): string {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return v;
}

// ----- dotted-path access: "business.name" -----
export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const o = (obj ?? {}) as Record<string, unknown>;
  return { ...o, [head]: rest.length ? setPath(o[head] ?? {}, rest.join("."), value) : value } as T;
}