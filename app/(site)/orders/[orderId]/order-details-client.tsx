"use client";

import {
  OrderDetailsShell,
  OrderDetailsHeader,
  OrderStatusOverview,
  OrderTimeline,
  OrderItemsList,
  OrderActions,
} from "@/components/orders";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { PaymentStatus, FulfillmentStatus } from "@/components/orders/order-card";
import type { OrderItemData } from "@/components/orders/order-items-list";

interface OrderSummary {
  id: string;
  orderNumber: string;
  orderDate: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
}

interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
}

interface OrderDetailsClientProps {
  order: OrderSummary;
  items: OrderItemData[];
  shippingAddress: ShippingAddress;
}

export function OrderDetailsClient({
  order,
  items,
  shippingAddress,
}: OrderDetailsClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <OrderDetailsShell>
          {/* Header Section */}
          <OrderDetailsHeader
            orderNumber={order.orderNumber}
            orderDate={order.orderDate}
            total={order.total}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Overview */}
              <OrderStatusOverview
                paymentStatus={order.paymentStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />

              {/* Order Timeline */}
              <OrderTimeline
                paymentStatus={order.paymentStatus}
                fulfillmentStatus={order.fulfillmentStatus}
              />

              {/* Order Items */}
              <OrderItemsList items={items} />

              {/* Shipping Address */}
              <Card className="p-6 md:p-8 border border-border bg-card">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="font-heading text-xl md:text-2xl text-foreground">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-1 font-sans text-sm text-foreground">
                  <p className="font-medium">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  {shippingAddress.company && (
                    <p className="text-muted-foreground">{shippingAddress.company}</p>
                  )}
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && (
                    <p>{shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  {shippingAddress.phone && (
                    <p className="mt-2 text-muted-foreground">{shippingAddress.phone}</p>
                  )}
                </div>
              </Card>

              {/* Order Summary */}
              <Card className="p-6 md:p-8 border border-border bg-card">
                <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-sans text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between font-sans text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">${order.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm uppercase tracking-wider text-muted-foreground">
                      Total
                    </span>
                    <span className="font-heading text-xl text-foreground">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OrderActions
                  orderId={order.id}
                  paymentStatus={order.paymentStatus}
                  fulfillmentStatus={order.fulfillmentStatus}
                />
              </div>
            </div>
          </div>
        </OrderDetailsShell>
      </main>
    </div>
  );
}
