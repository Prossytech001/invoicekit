"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { downloadInvoicePdf, printInvoicePdf } from "@/lib/download";
import { useDraft } from "@/store/invoiceStore";

type Phase = "checking" | "success" | "pending" | "failed" | "error";

// Paystack sends the user back here. We ask the backend to confirm the payment with Paystack.
export default function PaymentResult() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const [phase, setPhase] = useState<Phase>("checking");
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const check = useCallback(async () => {
    if (!reference) {
      setPhase("error");
      setError("No payment reference found.");
      return;
    }
    setPhase("checking");
    try {
      const r = await api<{ status: "success" | "pending" | "failed" | "duplicate"; invoiceId: string }>("/payments/verify", {
        method: "POST",
        body: JSON.stringify({ reference }),
      });
      setInvoiceId(r.invoiceId);
      if (r.status === "success" || r.status === "duplicate") {
        useDraft.getState().reset(); // the invoice is saved and locked; start the next one clean
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

  async function run(kind: "download" | "print") {
    if (!invoiceId) return;
    setBusy(true);
    setError("");
    try {
      if (kind === "download") await downloadInvoicePdf(invoiceId, "invoice.pdf");
      else await printInvoicePdf(invoiceId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const card = "mx-auto mt-10 max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm";
  const primary = "rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60";
  const secondary = "rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60";

  if (phase === "checking") {
    return <div className={card}><p className="font-medium text-gray-900">Confirming your payment...</p><p className="mt-1 text-sm text-gray-500">This takes a few seconds.</p></div>;
  }

  if (phase === "success") {
    return (
      <div className={card}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-800">✓</div>
        <h2 className="mt-4 text-xl font-bold text-emerald-950">Payment received</h2>
        <p className="mt-1 text-sm text-gray-600">Your invoice is final and ready to download.</p>
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className={primary} disabled={busy} onClick={() => run("download")}>{busy ? "Preparing PDF..." : "Download PDF"}</button>
          <button className={secondary} disabled={busy} onClick={() => run("print")}>Print</button>
        </div>
        {invoiceId && <Link href={`/invoices/${invoiceId}`} className="mt-5 inline-block text-sm text-emerald-800 underline">View invoice</Link>}
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
          <Link href="/invoices" className={secondary}>My Invoices</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={card}>
      <h2 className="text-lg font-bold text-gray-900">{phase === "failed" ? "Payment was not completed" : "Something went wrong"}</h2>
      <p className="mt-1 text-sm text-gray-600">{phase === "failed" ? "You have not been charged for a PDF. You can try again from your invoice." : error}</p>
      <div className="mt-6 flex justify-center gap-3">
        {invoiceId && <Link href={`/invoices/${invoiceId}`} className={primary}>Back to invoice</Link>}
        <Link href="/invoices" className={secondary}>My Invoices</Link>
      </div>
    </div>
  );
}