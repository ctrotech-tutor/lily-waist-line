"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PaymentProofShell } from "@/components/order/payment-proof-shell";
import { PaymentProofHeader } from "@/components/order/payment-proof-header";
import { PaymentProofDropzone } from "@/components/order/payment-proof-dropzone";

import { getOrderDetails } from "@/server/actions/orders";
import type { PaymentStatus } from "@/lib/generated/prisma/enums";

export default function PaymentProofUploadClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const result = await getOrderDetails(orderId);
        if (result.success && result.data) {
          setOrderData(result.data);
        } else {
          toast.error(result.error || "Failed to load order details");
          router.push("/orders");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <PaymentProofShell>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>
      </PaymentProofShell>
    );
  }

  if (!orderData) {
    return (
      <PaymentProofShell>
        <div className="text-center">
          <p className="font-sans text-muted-foreground">Order not found</p>
          <Link href="/orders" className="mt-4 inline-block">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </PaymentProofShell>
    );
  }

  const paymentStatus = orderData.paymentStatus as PaymentStatus;
  const paymentMethod = orderData.paymentMethod?.toLowerCase() === "cash_app" ? "cashapp" : "paypal";

  // Don't allow upload if payment is already paid
  if (paymentStatus === "PAID") {
    return (
      <PaymentProofShell>
        <PaymentProofHeader />
        <Card className="p-6 md:p-8 border border-[#d4af37]/30 bg-[#d4af37]/5">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Payment Complete
              </h3>
              <p className="font-sans text-sm text-muted-foreground">
                Your payment has been verified. You can track your order status from your orders page.
              </p>
            </div>
          </div>
        </Card>
        <div className="flex justify-center mt-6">
          <Link href="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </PaymentProofShell>
    );
  }

  return (
    <PaymentProofShell>
      <div className="mb-6">
        <Link
          href={`/order/confirmation/${orderId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order
        </Link>
      </div>

      <PaymentProofHeader />

      <div className="space-y-6">
        {/* Payment Instructions */}
        <Card className="p-6 md:p-8 border border-border bg-card">
          <h3 className="font-heading text-base font-semibold text-foreground mb-4">
            Payment Instructions
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              1. Complete your payment using the payment method selected during checkout.
            </p>
            <p>
              2. Take a clear screenshot of your payment confirmation.
            </p>
            <p>
              3. Upload the screenshot below for verification.
            </p>
            <p className="font-semibold text-foreground">
              Note: Include your order number in the payment reference if possible.
            </p>
          </div>
        </Card>

        {/* Upload Section */}
        <PaymentProofDropzone paymentMethod={paymentMethod} />

        {/* Info Alert */}
        <Card className="p-4 border border-[#d4af37]/20 bg-[#d4af37]/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">
                Verification Process
              </p>
              <p>
                Your payment proof will be reviewed by our team. You will receive an email once your payment is verified.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PaymentProofShell>
  );
}
