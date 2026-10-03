"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaymentProofShell } from "@/components/order/payment-proof-shell";
import { PaymentProofHeader } from "@/components/order/payment-proof-header";
import { PaymentProofDropzone } from "@/components/order/payment-proof-dropzone";
import { useOrder } from "@/hooks/use-orders";
import { ROUTES } from "@/lib/constants/routes";

function PaymentProofSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded-lg" />
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted" />
      </div>
      <div className="text-center space-y-3">
        <div className="h-8 w-64 bg-muted rounded-lg mx-auto" />
        <div className="h-5 w-72 bg-muted rounded-lg mx-auto" />
      </div>
      <div className="h-40 bg-muted rounded-lg" />
      <div className="h-48 bg-muted rounded-lg" />
    </div>
  );
}

export default function PaymentProofUploadClient({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: orderData, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <PaymentProofShell>
        <PaymentProofSkeleton />
      </PaymentProofShell>
    );
  }

  if (error || !orderData) {
    return (
      <PaymentProofShell>
        <div className="text-center py-12">
          <p className="font-sans text-muted-foreground">Order not found</p>
          <Button variant="outline" className="mt-4 rounded-lg" onClick={() => router.push(ROUTES.ORDERS)}>
            Back to Orders
          </Button>
        </div>
      </PaymentProofShell>
    );
  }

  const paymentStatus = orderData.paymentStatus;
  const isCashApp = orderData.paymentMethod === "CASH_APP";
  const paymentMethod = isCashApp ? "cashapp" : "paypal";

  if (orderData.fulfillmentStatus === "CANCELLED" || paymentStatus === "REJECTED") {
    return (
      <PaymentProofShell>
        <PaymentProofHeader />
        <Card className="p-6 md:p-8 border border-destructive/30 bg-destructive/5 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Order closed</h3>
              <p className="font-sans text-sm text-muted-foreground">
                This order can no longer accept payment proof. Place a new order if you still want the items; if you have already paid, contact support before ordering again.
              </p>
              {orderData.latestPaymentProof?.rejectionReason && (
                <p className="mt-3 text-sm text-foreground">
                  <strong>Review note:</strong> {orderData.latestPaymentProof.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </Card>
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={() => router.push(ROUTES.ORDERS)} className="rounded-lg">
            View My Orders
          </Button>
          <Button onClick={() => router.push(ROUTES.SHOP)} className="rounded-lg">
            Continue Shopping
          </Button>
        </div>
      </PaymentProofShell>
    );
  }

  if (orderData.hasPendingPaymentProof) {
    return (
      <PaymentProofShell>
        <PaymentProofHeader />
        <Card className="p-6 md:p-8 border border-primary/30 bg-primary/[0.03] rounded-lg">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Proof received</h3>
              <p className="font-sans text-sm text-muted-foreground">
                {orderData.hasInventoryReservation
                  ? "Your payment proof is pending review. Your items remain reserved while our team makes a decision."
                  : "Your payment proof is pending review. Our team will confirm the order before processing it."}
              </p>
            </div>
          </div>
        </Card>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push(ROUTES.ORDERS)} className="rounded-lg">
            View My Orders
          </Button>
        </div>
      </PaymentProofShell>
    );
  }

  if (paymentStatus === "PAID") {
    return (
      <PaymentProofShell>
        <PaymentProofHeader />
        <Card className="p-6 md:p-8 border border-primary/30 bg-primary/[0.03] rounded-lg">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
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
          <Button onClick={() => router.push(ROUTES.ORDERS)} className="rounded-lg">
            View My Orders
          </Button>
        </div>
      </PaymentProofShell>
    );
  }

  if (!orderData.paymentRecipient) {
    return (
      <PaymentProofShell>
        <PaymentProofHeader />
        <Card className="p-6 md:p-8 border border-warning/30 bg-warning/5 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Confirm payment details</h3>
              <p className="font-sans text-sm text-muted-foreground">
                We cannot safely verify the payment recipient for this order. Do not send money until support confirms the correct details.
              </p>
            </div>
          </div>
        </Card>
        <div className="flex justify-center mt-6">
          <Button onClick={() => router.push(ROUTES.CONTACT)} className="rounded-lg">Contact Support</Button>
        </div>
      </PaymentProofShell>
    );
  }

  return (
    <PaymentProofShell>
      <div className="mb-6">
        <button
          onClick={() => router.push(`/order/confirmation/${orderId}`)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order
        </button>
      </div>

      <PaymentProofHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 border border-border bg-card rounded-lg">
            <h3 className="font-heading text-base font-semibold text-foreground mb-4">
              Payment Instructions
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Recipient: <strong className="text-foreground">{orderData.paymentRecipient}</strong></p>
              <p>Amount due: <strong className="text-foreground">${Number(orderData.total).toFixed(2)}</strong></p>
              {orderData.paymentUrl && (
                <a href={orderData.paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex font-semibold text-primary underline underline-offset-4">
                  Open {isCashApp ? "Cash App" : "PayPal"}
                </a>
              )}
              <p>
                {isCashApp || orderData.paymentUrl
                  ? "Use the payment link above to send the exact amount."
                  : "Open PayPal, choose Send, and enter this merchant email as the recipient."}
              </p>
              <p>Take a clear screenshot of your payment confirmation and upload it below for verification.</p>
              <p className="font-semibold text-foreground">Include your order number in the payment reference if possible.</p>
              {orderData.reservationExpiresAt && (
                <p className="font-semibold text-foreground">
                  Submit proof by {new Date(orderData.reservationExpiresAt).toLocaleString()} to keep your stock reservation active.
                </p>
              )}
            </div>
          </Card>

          <PaymentProofDropzone
            orderId={orderId}
            paymentMethod={paymentMethod}
          />
        </div>

        <div className="lg:col-span-1">
          <Card className="p-4 border border-primary/20 bg-primary/[0.03] rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
      </div>
    </PaymentProofShell>
  );
}
