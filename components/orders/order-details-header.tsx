"use client";

import { Package, ChevronLeft, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export interface OrderDetailsHeaderProps {
  orderNumber: string;
  orderDate: string;
  total: number;
  className?: string;
}

export function OrderDetailsHeader({
  orderNumber,
  orderDate,
  total,
  className,
}: OrderDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn("border-b border-border pb-8 mb-8", className)}>
      <div className="mb-6">
        <Button
          onClick={() => router.push(ROUTES.ORDERS)}
          variant="ghost"
          className="px-0 py-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors rounded-lg"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Package className="w-4 h-4 text-primary" />
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Order Details
        </span>
      </div>

      <div className="w-16 h-px bg-primary mb-6" />

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-foreground mb-3">
            {orderNumber}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-sans text-base">{orderDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-1">
              Total
            </p>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}