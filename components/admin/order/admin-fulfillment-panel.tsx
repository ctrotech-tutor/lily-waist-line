"use client";

import { useState } from "react";
import { Truck, Package, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AdminOrderDetail } from "./data";

interface AdminFulfillmentPanelProps {
  order: AdminOrderDetail;
  onUpdateStatus: (orderId: string, newStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') => void;
  onSaveTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
  isUpdatingStatus?: boolean;
  isSavingTracking?: boolean;
}

const fulfillmentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20" },
  PROCESSING: { label: "Processing", className: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20" },
  SHIPPED: { label: "Shipped", className: "bg-info/10 text-info border-info/20" },
  DELIVERED: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function AdminFulfillmentPanel({ order, onUpdateStatus, onSaveTracking, isUpdatingStatus, isSavingTracking }: AdminFulfillmentPanelProps) {
  const [carrierName, setCarrierName] = useState(order.carrierName || "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const statusConfig = fulfillmentStatusConfig[order.fulfillmentStatus] || fulfillmentStatusConfig.PENDING;
  const allowedTransitions = ALLOWED_TRANSITIONS[order.fulfillmentStatus] || [];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-secondary" />
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
            className={`font-[family-name:var(--font-montserrat)] text-xs ${statusConfig.className}`}
          >
            {statusConfig.label}
          </Badge>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-3">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Update Status
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.includes('PROCESSING') && (
              <Button
                onClick={() => onUpdateStatus(order.id, 'PROCESSING')}
                disabled={isUpdatingStatus}
                variant="outline"
                size="sm"
                className="border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-secondary/50 hover:text-secondary"
              >
                <Package className="mr-1.5 h-3.5 w-3.5" />
                Mark as Processing
              </Button>
            )}
            {allowedTransitions.includes('SHIPPED') && (
              <Button
                onClick={() => onUpdateStatus(order.id, 'SHIPPED')}
                disabled={isUpdatingStatus}
                variant="outline"
                size="sm"
                className="border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-secondary/50 hover:text-secondary"
              >
                <Truck className="mr-1.5 h-3.5 w-3.5" />
                Mark as Shipped
              </Button>
            )}
            {allowedTransitions.includes('DELIVERED') && (
              <Button
                onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
                disabled={isUpdatingStatus}
                variant="outline"
                size="sm"
                className="border-border/50 font-[family-name:var(--font-montserrat)] text-xs hover:border-secondary/50 hover:text-secondary"
              >
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Mark as Delivered
              </Button>
            )}
            {allowedTransitions.includes('CANCELLED') && (
              <Button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                disabled={isUpdatingStatus}
                variant="outline"
                size="sm"
                className="border-destructive/50 font-[family-name:var(--font-montserrat)] text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-3">
          <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Carrier Information
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                Carrier Name
              </Label>
              <Input
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="e.g., FedEx, UPS"
                className="border-border/50 font-[family-name:var(--font-montserrat)] text-sm focus-visible:border-secondary focus-visible:ring-0"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                Tracking Number
              </Label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="border-border/50 font-[family-name:var(--font-montserrat)] text-sm focus-visible:border-secondary focus-visible:ring-0"
              />
            </div>
          </div>
          <Button
            onClick={() => onSaveTracking(order.id, carrierName, trackingNumber)}
            disabled={isSavingTracking || !carrierName || !trackingNumber}
            size="sm"
            className="bg-secondary font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-secondary/90"
          >
            {isSavingTracking ? "Saving..." : "Save Tracking Info"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}