import { Suspense } from "react";
import PaymentResult from "@/components/payments/PaymentResult";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<p className="mt-10 text-center text-sm text-gray-500">Confirming your payment...</p>}>
      <PaymentResult />
    </Suspense>
  );
}