"use client";

import { useCallback, useEffect, useState } from "react";
import { formatMoney } from "@/engine/calculate";
import { api } from "@/lib/api";
import { BillingPlan, BillingStatus, fmtLongDate } from "@/lib/billing";

const FEATURES = [
  "Unlimited invoices",
  "Unlimited PDF downloads and printing",
  "All templates, including new ones",
  "Your logo, watermark and signature on every invoice",
];

export default function BillingPanel() {
  const [plan, setPlan] = useState<BillingPlan | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([api<BillingPlan>("/billing/plan"), api<BillingStatus>("/billing/status")]);
    setPlan(p);
    setStatus(s);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e instanceof Error ? e.message : "Could not load your plan."));
  }, [load]);

  async function checkout(mode: "auto" | "pass") {
    setBusy(mode);
    setError("");
    try {
      const { authorizationUrl } = await api<{ authorizationUrl: string }>("/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ mode }),
      });
      window.location.href = authorizationUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the payment.");
      setBusy(null);
    }
  }

  async function cancel() {
    if (!window.confirm("Turn off automatic renewal? You keep access until the end of the period you already paid for.")) return;
    setBusy("cancel");
    setError("");
    try {
      await api("/billing/cancel", { method: "POST" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel.");
    } finally {
      setBusy(null);
    }
  }

  async function manageCard() {
    setBusy("card");
    setError("");
    try {
      const { link } = await api<{ link: string }>("/billing/manage-link");
      window.open(link, "_blank");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the card page.");
    } finally {
      setBusy(null);
    }
  }

  if (!plan || !status) {
    return error
      ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      : <div className="h-64 animate-pulse rounded-xl bg-white" />;
  }

  const price = formatMoney(plan.priceMinor, plan.currency, "en-NG");
  const until = fmtLongDate(status.accessUntil);
  const primary = "rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60";
  const secondary = "rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60";

  const statusText: Record<string, string> = {
    auto: `Renews automatically on ${until}.`,
    manual: `This is a ${plan.passDays}-day pass. It ends on ${until}.`,
    cancelled: `Automatic renewal is off. Your access ends on ${until}.`,
    failed: "Your last renewal payment failed. Update your card, or pay for another period, to stay active.",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {status.active && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-900 px-2.5 py-0.5 text-xs font-semibold text-white">Active</span>
            <h2 className="font-semibold text-emerald-950">Your plan is active until {until}</h2>
          </div>
          {status.renewal && <p className="mt-2 text-sm text-emerald-900">{statusText[status.renewal]}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            {status.canCancel && (
              <button className={secondary} disabled={busy !== null} onClick={cancel}>
                {busy === "cancel" ? "Cancelling..." : "Cancel auto-renewal"}
              </button>
            )}
            {status.hasCard && (
              <button className={secondary} disabled={busy !== null} onClick={manageCard}>Update card</button>
            )}
          </div>
        </section>
      )}

      {!status.active && status.renewal && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Your plan ended on {until}. You can still view and edit your invoices, and download invoices you finalized earlier.
          Subscribe again to finalize and download new ones.
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-emerald-950">InvoiceKit Monthly</h2>
        <p className="mt-2">
          <span className="text-4xl font-bold text-emerald-950">{price}</span>
          <span className="text-gray-500"> / month</span>
        </p>
        <ul className="mt-5 space-y-2 text-sm text-gray-700">
          {FEATURES.map((f) => (
            <li key={f} className="flex gap-2"><span className="text-emerald-700">✓</span>{f}</li>
          ))}
        </ul>

        <div className="mt-6 space-y-3">
          {status.renewal !== "auto" && (
            <div>
              <button className={`${primary} w-full`} disabled={busy !== null || !plan.autoRenewAvailable} onClick={() => checkout("auto")}>
                {busy === "auto" ? "Redirecting..." : "Subscribe with card (renews monthly)"}
              </button>
              {!plan.autoRenewAvailable && (
                <p className="mt-1 text-xs text-gray-500">Card subscriptions are not set up yet. You can pay for {plan.passDays} days below.</p>
              )}
            </div>
          )}
          <div>
            <button className={`${secondary} w-full`} disabled={busy !== null} onClick={() => checkout("pass")}>
              {busy === "pass" ? "Redirecting..." : `${status.active ? "Add" : "Pay for"} ${plan.passDays} days (card, bank transfer or USSD)`}
            </button>
            <p className="mt-1 text-xs text-gray-500">One payment, no automatic renewal. Pay again when it ends.</p>
          </div>
        </div>
        <p className="mt-5 text-xs text-gray-400">
          Card subscriptions renew automatically each month until you cancel. Invoices you finalize while subscribed stay available to download.
        </p>
      </section>
    </div>
  );
}