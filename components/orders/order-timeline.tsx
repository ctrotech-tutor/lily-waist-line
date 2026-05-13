"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Circle,
  Clock,
  Package,
  Truck,
  CreditCard,
  FileText,
} from "lucide-react";
import { PaymentStatus, FulfillmentStatus } from "./order-card";

export interface OrderTimelineProps {
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  className?: string;
}

type TimelineStep = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const timelineSteps: TimelineStep[] = [
  {
    id: "order-created",
    label: "Order Created",
    description: "Your order has been placed",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "payment-verified",
    label: "Payment Verified",
    description: "Payment has been confirmed",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: "processing",
    label: "Processing",
    description: "Order is being prepared",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "shipped",
    label: "Shipped",
    description: "Order is on its way",
    icon: <Truck className="w-4 h-4" />,
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "Order has arrived",
    icon: <Package className="w-4 h-4" />,
  },
];

export function OrderTimeline({
  paymentStatus,
  fulfillmentStatus,
  className,
}: OrderTimelineProps) {
  // Determine current step index based on status
  const getCurrentStepIndex = (): number => {
    // If cancelled, show up to processing step
    if (fulfillmentStatus === "cancelled") {
      return 2;
    }

    // Payment not verified yet
    if (paymentStatus === "pending") {
      return 0;
    }
    if (paymentStatus === "failed") {
      return 0;
    }

    // Payment verified but processing
    if (fulfillmentStatus === "processing") {
      return 2;
    }

    // Shipped
    if (fulfillmentStatus === "shipped") {
      return 3;
    }

    // Delivered
    if (fulfillmentStatus === "delivered") {
      return 4;
    }

    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (index: number): "completed" | "current" | "pending" => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "pending";
  };

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-8">
        Order Progress
      </h2>

      <div className="relative">
        {/* Vertical Timeline Line (Mobile) / Horizontal Line (Desktop) */}
        <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-border" />
        <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2">
          {timelineSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isPending = status === "pending";

            return (
              <div
                key={step.id}
                className={cn(
                  "relative flex md:flex-col items-start md:items-center gap-4 md:gap-4",
                  isPending && "opacity-50"
                )}
              >
                {/* Step Icon */}
                <div
                  className={cn(
                    "relative z-10 w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-300",
                    isCompleted && "bg-[#d4af37] text-black",
                    isCurrent && "bg-[#d4af37]/20 text-[#d4af37] border-2 border-[#d4af37]",
                    isPending && "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 md:text-center pt-1 md:pt-0">
                  <h3
                    className={cn(
                      "font-sans text-sm font-semibold transition-colors duration-300",
                      isCompleted && "text-[#d4af37]",
                      isCurrent && "text-foreground",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </h3>
                  <p
                    className={cn(
                      "font-sans text-xs mt-1 transition-colors duration-300",
                      isCurrent ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
