import { Suspense } from "react";
import BillingResult from "@/components/billing/BillingResult";

export default function BillingCallbackPage() {
  return (
    <Suspense fallback={<p className="mt-10 text-center text-sm text-gray-500">Confirming your payment...</p>}>
      <BillingResult />
    </Suspense>
  );
}