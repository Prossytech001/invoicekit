export interface BillingPlan {
  priceMinor: number;
  currency: string;
  passDays: number;
  autoRenewAvailable: boolean;
}

export interface BillingStatus {
  active: boolean;
  accessUntil: string | null;
  renewal: "auto" | "manual" | "cancelled" | "failed" | null;
  canCancel: boolean;
  hasCard: boolean;
}

export const fmtLongDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";