import { Suspense } from "react";
import PaymentProofUploadClient from "./payment-proof-upload-client";

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function PaymentProofUploadPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <PaymentProofUploadClient orderId={params.orderId} />
    </Suspense>
  );
}
