"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminOrder, useVerifyPayment, useUpdateFulfillmentStatus, useAddTrackingNumber } from "@/hooks/admin/use-admin-orders";
import { AdminOrderHeader, AdminPaymentReview, AdminOrderItems, AdminCustomerInfo, AdminFulfillmentPanel, AdminOrderAlerts, AdminOrderDetailSkeleton } from "@/components/admin/order";
import type { AdminOrderDetail, AdminOrderDetailItem } from "@/components/admin/order/data";
import type { AdminOrderSerializable } from "@/lib/services";
import { ROUTES } from "@/lib/constants/routes";
import { formatOrderNumber } from "@/lib/utils/order";

function toAdminOrderDetail(raw: AdminOrderSerializable): AdminOrderDetail {
  const paymentProof = raw.paymentProofs?.[0] ?? null;
  const shipment = raw.shipments?.[0] ?? null;

  // Generate formatted order number
  const orderNumber = formatOrderNumber(raw.id);

  return {
    id: raw.id,
    orderNumber,
    customerName: raw.user.fullName,
    customerEmail: raw.user.email,
    paymentStatus: raw.paymentStatus,
    paymentMethod: raw.paymentMethod,
    paymentRecipient: raw.paymentRecipient ?? null,
    paymentUrl: raw.paymentUrl ?? null,
    fulfillmentStatus: raw.fulfillmentStatus,
    items: raw.orderItems.map((item): AdminOrderDetailItem => ({
      id: item.id ?? '',
      productName: item.product.name,
      productImage: item.product.images?.[0]?.url ?? null,
      variant: `${item.variant.size} / ${item.variant.compressionLevel}`,
      quantity: item.quantity,
      price: Number(item.unitPrice),
    })),
    shippingAddress: {
      fullName: `${raw.address.firstName} ${raw.address.lastName}`,
      street: raw.address.addressLine2
        ? `${raw.address.addressLine1}, ${raw.address.addressLine2}`
        : raw.address.addressLine1,
      city: raw.address.city,
      state: raw.address.state,
      zipCode: raw.address.postalCode,
      country: raw.address.country,
      phone: raw.address.phone || raw.user.phone || '',
    },
    subtotal: Number(raw.subtotal),
    shipping: Number(raw.shippingFee),
    total: Number(raw.total),
    paymentProof: paymentProof ? {
      id: paymentProof.id,
      imageUrl: paymentProof.imageUrl,
      status: paymentProof.status,
      rejectionReason: paymentProof.rejectionReason ?? null,
      uploadedAt: typeof paymentProof.uploadedAt === 'string'
        ? paymentProof.uploadedAt
        : paymentProof.uploadedAt?.toISOString?.() || '',
    } : null,
    carrierName: shipment?.carrier || undefined,
    trackingNumber: shipment?.trackingNumber || undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : raw.createdAt?.toISOString?.() || '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : raw.updatedAt?.toISOString?.() || '',
  };
}

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { data: rawOrder, isLoading, error } = useAdminOrder(orderId);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const verifyPayment = useVerifyPayment();
  const updateStatus = useUpdateFulfillmentStatus();
  const addTracking = useAddTrackingNumber();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminOrderDetailSkeleton />
      </div>
    );
  }

  if (error || !rawOrder) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-[family-name:var(--font-bodoni-moda)] text-xl font-semibold">Order Not Found</h1>
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'The order you are looking for does not exist.'}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_ORDERS)}
          className="mt-4 rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-primary/50 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>
    );
  }

  const order = toAdminOrderDetail(rawOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(ROUTES.ADMIN_ORDERS)}
          className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-primary"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <AdminOrderHeader order={order} />
      <AdminOrderAlerts order={order} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminPaymentReview
            order={order}
            onVerify={(id) => {
              setPendingAction('approve');
              verifyPayment.mutate({ orderId: id, action: 'APPROVE' }, { onSettled: () => setPendingAction(null) });
            }}
            onReject={(id, reason) => {
              setPendingAction('reject');
              verifyPayment.mutate({ orderId: id, action: 'REJECT', reason }, { onSettled: () => setPendingAction(null) });
            }}
            isVerifying={verifyPayment.isPending && pendingAction === 'approve'}
            isRejecting={verifyPayment.isPending && pendingAction === 'reject'}
          />
          <AdminFulfillmentPanel
            order={order}
            onUpdateStatus={(id, newStatus) => updateStatus.mutate({ orderId: id, newStatus })}
            onSaveTracking={(id, carrier, trackingNumber) =>
              addTracking.mutate({ orderId: id, carrier, trackingNumber })
            }
            isUpdatingStatus={updateStatus.isPending}
            isSavingTracking={addTracking.isPending}
          />
        </div>
        <div className="space-y-6">
          <AdminCustomerInfo order={order} />
          <AdminOrderItems order={order} />
        </div>
      </div>
    </div>
  );
}