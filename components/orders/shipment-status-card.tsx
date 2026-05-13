"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

export type ShipmentStatus =
  | "label_created"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception";

export interface ShipmentStatusCardProps {
  status: ShipmentStatus;
  estimatedDelivery: string;
  currentLocation?: string;
  className?: string;
}

const statusConfig: Record<
  ShipmentStatus,
  { label: string; color: string; bgColor: string }
> = {
  label_created: {
    label: "Label Created",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  in_transit: {
    label: "In Transit",
    color: "text-[#d4af37]",
    bgColor: "bg-[#d4af37]/10",
  },
  out_for_delivery: {
    label: "Out For Delivery",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  exception: {
    label: "Exception",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

export function ShipmentStatusCard({
  status,
  estimatedDelivery,
  currentLocation,
  className,
}: ShipmentStatusCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Current Status */}
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Current Status
          </p>
          <Badge
            variant="secondary"
            className={cn(
              "px-4 py-2 text-sm font-sans font-semibold rounded-none",
              config.bgColor,
              config.color
            )}
          >
            {config.label}
          </Badge>
        </div>

        {/* Estimated Delivery */}
        <div className="space-y-3">
          <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            Estimated Delivery
          </p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span className="font-sans text-lg font-medium text-foreground">
              {estimatedDelivery}
            </span>
          </div>
        </div>

        {/* Current Location (if available) */}
        {currentLocation && (
          <div className="space-y-3">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Current Location
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span className="font-sans text-sm text-foreground">
                {currentLocation}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
