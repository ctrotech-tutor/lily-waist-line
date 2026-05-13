"use client";

import { useState } from "react";
import { Truck, Package, CheckCircle, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { OrderDetails, FulfillmentStatus } from "./data";

interface AdminFulfillmentPanelProps {
  order: OrderDetails;
}

const fulfillmentStatusConfig = {
  processing: { label: "Processing", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  shipped: { label: "Shipped", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-500/20" },
};

export function AdminFulfillmentPanel({ order }: AdminFulfillmentPanelProps) {
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentStatus>(order.fulfillmentStatus);
  const [carrierName, setCarrierName] = useState(order.carrierName || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = (status: FulfillmentStatus) => {
    setIsUpdating(true);
    setTimeout(() => {
      setFulfillmentStatus(status);
      setIsUpdating(false);
    }, 300);
  };

  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-[#d4af37]" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Fulfillment
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current Status
          </p>
          <Badge
            variant="outline"
            className={`font-[family-name:var(--font-montserrat)] text-xs ${fulfillmentStatusConfig[fulfillmentStatus].className}`}
          >
            {fulfillmentStatusConfig[fulfillmentStatus].label}
          </Badge>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-3">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Update Status
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleStatusUpdate("processing")}
              disabled={isUpdating || fulfillmentStatus === "processing"}
              variant="outline"
              size="sm"
              className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-[#d4af37]/50 hover:text-[#d4af37] disabled:opacity-50"
            >
              <Package className="mr-1.5 h-3.5 w-3.5" />
              Mark as Processing
            </Button>
            <Button
              onClick={() => handleStatusUpdate("shipped")}
              disabled={isUpdating || fulfillmentStatus === "shipped"}
              variant="outline"
              size="sm"
              className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-[#d4af37]/50 hover:text-[#d4af37] disabled:opacity-50"
            >
              <Truck className="mr-1.5 h-3.5 w-3.5" />
              Mark as Shipped
            </Button>
            <Button
              onClick={() => handleStatusUpdate("delivered")}
              disabled={isUpdating || fulfillmentStatus === "delivered"}
              variant="outline"
              size="sm"
              className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-[#d4af37]/50 hover:text-[#d4af37] disabled:opacity-50"
            >
              <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
              Mark as Delivered
            </Button>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-3">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Carrier Information
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                Carrier Name
              </label>
              <Input
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="e.g., FedEx, UPS"
                className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm focus-visible:border-[#d4af37] focus-visible:ring-0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                Tracking Number
              </label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm focus-visible:border-[#d4af37] focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
