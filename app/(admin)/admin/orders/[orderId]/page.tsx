"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminOrderHeader,
  AdminPaymentReview,
  AdminOrderItems,
  AdminCustomerInfo,
  AdminFulfillmentPanel,
  AdminOrderAlerts,
  getOrderById,
} from "@/components/admin/order";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-[family-name:var(--font-bodoni-moda)] text-xl font-semibold">
          Order Not Found
        </h1>
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
          The order you are looking for does not exist.
        </p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mt-4 rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-[#d4af37]/50 hover:text-[#d4af37]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <AdminOrderHeader order={order} />

      {/* Alerts */}
      <AdminOrderAlerts order={order} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Payment & Fulfillment */}
        <div className="space-y-6 lg:col-span-2">
          <AdminPaymentReview order={order} />
          <AdminFulfillmentPanel order={order} />
        </div>

        {/* Right Column - Customer & Items */}
        <div className="space-y-6">
          <AdminCustomerInfo order={order} />
          <AdminOrderItems order={order} />
        </div>
      </div>
    </div>
  );
}
