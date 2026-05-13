import { PaymentProofShell } from "@/components/order/payment-proof-shell";
import { PaymentProofHeader } from "@/components/order/payment-proof-header";
import { PaymentProofDropzone } from "@/components/order/payment-proof-dropzone";

export const metadata = {
  title: "Upload Payment Proof | Lily Waist Line",
  description: "Upload your payment screenshot to verify your order and begin processing.",
};

interface PaymentProofPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentProofPage({
  searchParams,
}: PaymentProofPageProps) {
  const params = await searchParams;
  const paymentMethod = params.method === "paypal" ? "paypal" : "cashapp";

  return (
    <PaymentProofShell>
      <div className="space-y-8">
        <PaymentProofHeader />
        <PaymentProofDropzone paymentMethod={paymentMethod} />
      </div>
    </PaymentProofShell>
  );
}
