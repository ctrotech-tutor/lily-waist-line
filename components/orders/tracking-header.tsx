"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, Package, Truck } from "lucide-react";
import Link from "next/link";

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
  return (
    <div className={cn("space-y-6", className)}>
      {/* Back Navigation */}
      <Link
        href={`/orders/${orderNumber}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-sans">Back to Order Details</span>
      </Link>

      {/* Main Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl text-foreground">
              Track Shipment
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              Monitor your package delivery
            </p>
          </div>
        </div>

        {/* Order & Tracking Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          {/* Order Number */}
          <div className="space-y-1">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Order Number
            </p>
            <p className="font-sans text-sm font-medium text-foreground">
              {orderNumber}
            </p>
          </div>

          {/* Carrier */}
          <div className="space-y-1">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Carrier
            </p>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#d4af37]" />
              <p className="font-sans text-sm font-medium text-foreground">
                {carrier}
              </p>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="space-y-1">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
              Tracking Number
            </p>
            <p className="font-sans text-sm font-medium text-foreground tracking-wider">
              {trackingNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
