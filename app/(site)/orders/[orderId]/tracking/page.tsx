import {
  TrackingShell,
  TrackingHeader,
  ShipmentStatusCard,
  ShippingTimeline,
  ShipmentUpdates,
  TrackingActions,
  type ShipmentUpdate,
  type ShippingStep,
  type ShipmentStatus,
} from "@/components/orders";

// Mock shipment data - will be replaced with real data later
const mockShipment = {
  orderNumber: "LWL-2026-001",
  carrier: "USPS",
  trackingNumber: "9400111899562918000001",
  status: "in_transit" as ShipmentStatus,
  estimatedDelivery: "May 15, 2026",
  currentLocation: "Regional Distribution Center",
  currentStep: "in_transit" as ShippingStep,
};

const mockUpdates: ShipmentUpdate[] = [
  {
    id: "1",
    date: "May 13, 2026",
    time: "8:45 AM",
    message: "Arrived at destination hub",
    location: "New York, NY",
    status: "current",
  },
  {
    id: "2",
    date: "May 12, 2026",
    time: "11:23 PM",
    message: "Departed regional center",
    location: "Philadelphia, PA",
    status: "completed",
  },
  {
    id: "3",
    date: "May 11, 2026",
    time: "3:15 PM",
    message: "Package accepted at facility",
    location: "Washington, DC",
    status: "completed",
  },
];

interface TrackingPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { orderId } = await params;

  // In the future, this will fetch real tracking data
  console.log("Tracking Order ID:", orderId);

  return (
    <div className="min-h-screen bg-background">

      <main>
        <TrackingShell>
          {/* Header Section */}
          <TrackingHeader
            orderNumber={mockShipment.orderNumber}
            carrier={mockShipment.carrier}
            trackingNumber={mockShipment.trackingNumber}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipment Status */}
              <ShipmentStatusCard
                status={mockShipment.status}
                estimatedDelivery={mockShipment.estimatedDelivery}
                currentLocation={mockShipment.currentLocation}
              />

              {/* Shipping Timeline */}
              <ShippingTimeline currentStep={mockShipment.currentStep} />

              {/* Shipment Updates Feed */}
              <ShipmentUpdates updates={mockUpdates} />
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <TrackingActions
                trackingNumber={mockShipment.trackingNumber}
                carrierUrl="#"
              />
            </div>
          </div>
        </TrackingShell>
      </main>

    </div>
  );
}
