"use client";

import { Truck, ChevronLeft, Package, Hash, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface TrackingHeaderProps {
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  className?: string;
}

export function TrackingHeader({
  orderNumber,
  carrier,
  trackingNumber,
  className,
}: TrackingHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn("border-b border-border pb-8 mb-8", className)}>
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="px-0 py-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors rounded-lg"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-4 h-4 text-primary" />
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Shipment Tracking
        </span>
      </div>

      <div className="w-16 h-px bg-primary mb-6" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-foreground mb-4">
            Tracking
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span className="font-sans text-base">{orderNumber}</span>
            </div>
            <div className="hidden sm:block text-border">|</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-sans text-base">{carrier}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Tracking #
            </p>
            <div className="flex items-center gap-1">
              <Hash className="w-4 h-4 text-primary" />
              <span className="font-heading text-xl md:text-2xl font-semibold text-foreground">
                {trackingNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}