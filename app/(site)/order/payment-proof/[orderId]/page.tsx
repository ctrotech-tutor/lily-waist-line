import { Suspense } from "react";
import PaymentProofUploadClient from "./payment-proof-upload-client";

interface PageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function PaymentProofUploadPage({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <Suspense fallback={null}>
      <PaymentProofUploadClient orderId={orderId} />
    </Suspense>
  );
}
