"use client";

import React from "react";
import {
  TrackingShell,
  TrackingHeader,
  ShipmentStatusCard,
  ShippingTimeline,
  ShipmentUpdates,
  TrackingActions,
  TrackingItemsCard,
  TrackingAddressCard,
  type ShipmentUpdate,
  type ShippingStep,
  type ShipmentStatus,
} from "@/components/orders";
import { useOrder } from "@/hooks/use-orders";
import type { FulfillmentStatus } from "@/lib/generated/prisma/enums";

function TrackingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded-lg mb-6" />
      <div className="h-px w-16 bg-muted mb-6" />
      <div className="h-10 w-48 bg-muted rounded-lg mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function mapFulfillmentToShipmentStatus(fulfillmentStatus: FulfillmentStatus): ShipmentStatus {
  switch (fulfillmentStatus) {
    case "DELIVERED": return "delivered";
    case "SHIPPED": return "in_transit";
    case "PROCESSING": return "label_created";
    case "CANCELLED": return "exception";
    default: return "label_created";
  }
}

function mapFulfillmentToShippingStep(fulfillmentStatus: FulfillmentStatus): ShippingStep {
  switch (fulfillmentStatus) {
    case "DELIVERED": return "delivered";
    case "SHIPPED": return "in_transit";
    case "PROCESSING": return "label_created";
    default: return "label_created";
  }
}

function generateShipmentUpdates(shipment: { deliveredAt?: Date | string | null; shippedAt?: Date | string | null }, fulfillmentStatus: FulfillmentStatus): ShipmentUpdate[] {
  const updates: ShipmentUpdate[] = [];
  if (fulfillmentStatus === "DELIVERED" && shipment.deliveredAt) {
    updates.push({ id: "1", date: new Date(shipment.deliveredAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), message: "Delivered", location: "Destination", status: "completed" });
  }
  if (fulfillmentStatus === "SHIPPED" || fulfillmentStatus === "DELIVERED") {
    if (shipment.shippedAt) {
      updates.push({ id: "2", date: new Date(shipment.shippedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), message: "Package shipped", location: "Origin", status: fulfillmentStatus === "DELIVERED" ? "completed" : "current" });
    }
  }
  if (updates.length === 0) {
    updates.push({ id: "1", date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), message: "Order processing", status: "current" });
  }
  return updates.reverse();
}

function getCarrierUrl(carrier: string, trackingNumber: string): string {
  switch (carrier.toLowerCase()) {
    case "usps": return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
    case "ups": return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case "fedex": return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
    default: return "#";
  }
}

interface TrackingPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = React.use(params);
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <TrackingShell>
            <TrackingSkeleton />
          </TrackingShell>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <TrackingShell>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error instanceof Error ? error.message : "Order not found"}</p>
            </div>
          </TrackingShell>
        </main>
      </div>
    );
  }

  const shipment = order.latestShipment;
  if (!shipment) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <TrackingShell>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tracking information not available yet</p>
            </div>
          </TrackingShell>
        </main>
      </div>
    );
  }

  const shipmentStatus = mapFulfillmentToShipmentStatus(order.fulfillmentStatus);
  const shippingStep = mapFulfillmentToShippingStep(order.fulfillmentStatus);

  let estimatedDelivery = "Not available";
  if (shipment.shippedAt) {
    const shippedDate = new Date(shipment.shippedAt);
    shippedDate.setDate(shippedDate.getDate() + 5);
    estimatedDelivery = shippedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  const updates = generateShipmentUpdates(shipment, order.fulfillmentStatus);
  const carrierUrl = getCarrierUrl(shipment.carrier, shipment.trackingNumber || "");

  return (
    <div className="min-h-screen bg-background">
      <main>
        <TrackingShell>
          <TrackingHeader
            orderNumber={order.orderNumber}
            carrier={shipment.carrier}
            trackingNumber={shipment.trackingNumber || "Not available"}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <ShipmentStatusCard status={shipmentStatus} estimatedDelivery={estimatedDelivery} currentLocation={undefined} />
              <ShippingTimeline currentStep={shippingStep} />
              <ShipmentUpdates updates={updates} />
              {order.items && order.items.length > 0 && (
                <TrackingItemsCard items={order.items} />
              )}
            </div>
            <div className="lg:col-span-1 space-y-6">
              <TrackingActions trackingNumber={shipment.trackingNumber || ""} carrierUrl={carrierUrl} />
              {order.shippingAddress && (
                <TrackingAddressCard address={order.shippingAddress} />
              )}
            </div>
          </div>
        </TrackingShell>
      </main>
    </div>
  );
}