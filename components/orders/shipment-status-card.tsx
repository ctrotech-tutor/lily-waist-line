"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import type { ShipmentStatus } from "@/types/order";

export type { ShipmentStatus };

export interface ShipmentStatusCardProps {
  status: ShipmentStatus;
  estimatedDelivery: string;
  currentLocation?: string;
  className?: string;
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string; bgColor: string }> = {
  label_created: { label: "Label Created", color: "text-muted-foreground", bgColor: "bg-muted" },
  in_transit: { label: "In Transit", color: "text-primary", bgColor: "bg-primary/10" },
  out_for_delivery: { label: "Out For Delivery", color: "text-success", bgColor: "bg-success/10" },
  delivered: { label: "Delivered", color: "text-success", bgColor: "bg-success/10" },
  exception: { label: "Exception", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export function ShipmentStatusCard({
  status,
  estimatedDelivery,
  currentLocation,
  className,
}: ShipmentStatusCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Current Status</p>
          <Badge variant="secondary" className={cn("px-4 py-2 text-sm font-sans font-semibold rounded-lg", config.bgColor, config.color)}>
            {config.label}
          </Badge>
        </div>
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Estimated Delivery</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-sans text-lg font-medium text-foreground">{estimatedDelivery}</span>
          </div>
        </div>
        {currentLocation && (
          <div className="space-y-3">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">Current Location</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-sans text-sm text-foreground">{currentLocation}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}