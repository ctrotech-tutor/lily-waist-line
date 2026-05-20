import { notFound } from "next/navigation";
import { getOrderDetails } from "@/server/actions/orders";
import {
  deriveShipmentStatus,
  deriveShippingStep,
  formatOrderDate,
  getCarrierTrackingUrl,
} from "@/types/order";
import type { FulfillmentStatus as PrismaFulfillmentStatus } from "@/lib/generated/prisma/enums";
import {
  TrackingShell,
  TrackingHeader,
  ShipmentStatusCard,
  ShippingTimeline,
  ShipmentUpdates,
  TrackingActions,
} from "@/components/orders";
import type { ShipmentUpdate } from "@/components/orders";
import { Card } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TrackingPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = await params;

  const result = await getOrderDetails(orderId);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;
  const latestShipment = order.latestShipment;
  const fulfillmentStatus = order.fulfillmentStatus as PrismaFulfillmentStatus;

  if (!latestShipment && fulfillmentStatus !== "SHIPPED" && fulfillmentStatus !== "DELIVERED") {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <TrackingShell>
            {/* Back Navigation */}
            <Link
              href={`/orders/${orderId}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-sans">Back to Order Details</span>
            </Link>

            <Card className="p-12 md:p-16 border border-border bg-card">
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 border-2 border-[#d4af37]/20 flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
                  Not Yet Shipped
                </h2>
                <p className="font-sans text-base text-muted-foreground leading-relaxed">
                  Your order has not been shipped yet. Tracking information will be available once your order is on its way.
                </p>
              </div>
            </Card>
          </TrackingShell>
        </main>
      </div>
    );
  }

  const shipmentStatus = deriveShipmentStatus(fulfillmentStatus, latestShipment);
  const currentStep = deriveShippingStep(fulfillmentStatus, latestShipment);
  const carrierUrl = getCarrierTrackingUrl(
    latestShipment?.carrier || "",
    latestShipment?.trackingNumber || null
  );

  const updates: ShipmentUpdate[] = [];

  if (latestShipment?.deliveredAt) {
    updates.push({
      id: "delivered",
      date: formatOrderDate(latestShipment.deliveredAt),
      message: "Package has been delivered",
      status: "completed" as const,
    });
  }

  if (latestShipment?.shippedAt) {
    updates.push({
      id: "shipped",
      date: formatOrderDate(latestShipment.shippedAt),
      message: `Package shipped via ${latestShipment.carrier}`,
      status: latestShipment.deliveredAt ? "completed" as const : "current" as const,
    });
  }

  updates.push({
    id: "order-placed",
    date: formatOrderDate(order.createdAt),
    message: "Order placed and confirmed",
    status: "completed" as const,
  });

  return (
    <div className="min-h-screen bg-background">
      <main>
        <TrackingShell>
          {/* Header Section */}
          <TrackingHeader
            orderId={orderId}
            orderNumber={order.orderNumber}
            carrier={latestShipment?.carrier || "Pending"}
            trackingNumber={latestShipment?.trackingNumber || "Not assigned"}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipment Status */}
              <ShipmentStatusCard
                status={shipmentStatus}
                estimatedDelivery={
                  latestShipment?.deliveredAt
                    ? formatOrderDate(latestShipment.deliveredAt)
                    : "Pending"
                }
                currentLocation={undefined}
              />

              {/* Shipping Timeline */}
              <ShippingTimeline currentStep={currentStep} />

              {/* Shipment Updates Feed */}
              <ShipmentUpdates updates={updates} />
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <TrackingActions
                trackingNumber={latestShipment?.trackingNumber || ""}
                carrierUrl={carrierUrl}
              />
            </div>
          </div>
        </TrackingShell>
      </main>
    </div>
  );
}
