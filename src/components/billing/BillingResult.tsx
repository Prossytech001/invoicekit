"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BillingStatus, fmtLongDate } from "@/lib/billing";

type Phase = "checking" | "success" | "pending" | "failed" | "error";

// Paystack sends the user back here. We ask the backend to confirm the payment with Paystack.
export default function BillingResult() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const [phase, setPhase] = useState<Phase>("checking");
  const [until, setUntil] = useState("");
  const [error, setError] = useState("");
  const [returnTo, setReturnTo] = useState("/templates");

  useEffect(() => {
    const saved = sessionStorage.getItem("billingReturn");
    if (saved && saved.startsWith("/")) setReturnTo(saved);
  }, []);

  const check = useCallback(async () => {
    if (!reference) {
      setPhase("error");
      setError("No payment reference found.");
      return;
    }
    setPhase("checking");
    try {
      const r = await api<{ status: "success" | "pending" | "failed" | "duplicate" }>("/billing/verify", {
        method: "POST",
        body: JSON.stringify({ reference }),
      });
      if (r.status === "success" || r.status === "duplicate") {
        const s = await api<BillingStatus>("/billing/status");
        setUntil(fmtLongDate(s.accessUntil));
        setPhase("success");
      } else {
        setPhase(r.status);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not confirm the payment.");
      setPhase("error");
    }
  }, [reference]);

  useEffect(() => {
    check();
  }, [check]);

  const card = "mx-auto mt-10 max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm";
  const primary = "rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800";
  const secondary = "rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100";

  if (phase === "checking") {
    return <div className={card}><p className="font-medium text-gray-900">Confirming your payment...</p><p className="mt-1 text-sm text-gray-500">This takes a few seconds.</p></div>;
  }

  if (phase === "success") {
    return (
      <div className={card}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">✓</div>
        <h2 className="mt-4 text-xl font-bold text-emerald-950">Your plan is active</h2>
        <p className="mt-1 text-sm text-gray-600">You can finalize and download unlimited invoices{until ? ` until ${until}` : ""}.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={returnTo} onClick={() => sessionStorage.removeItem("billingReturn")} className={primary}>Continue</Link>
          <Link href="/billing" className={secondary}>View plan</Link>
        </div>
      </div>
    );
  }

  if (phase === "pending") {
    return (
      <div className={card}>
        <h2 className="text-lg font-bold text-gray-900">Waiting for confirmation</h2>
        <p className="mt-1 text-sm text-gray-600">We haven't received confirmation from Paystack yet. If you completed the payment, check again in a moment.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className={primary} onClick={check}>Check again</button>
          <Link href="/billing" className={secondary}>Billing</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={card}>
      <h2 className="text-lg font-bold text-gray-900">{phase === "failed" ? "Payment was not completed" : "Something went wrong"}</h2>
      <p className="mt-1 text-sm text-gray-600">{phase === "failed" ? "You have not been charged. You can try again." : error}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/billing" className={primary}>Back to billing</Link>
      </div>
    </div>
  );
}