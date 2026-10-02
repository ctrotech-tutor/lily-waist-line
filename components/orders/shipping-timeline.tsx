"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CheckCircle, FileText, Package, Truck, Home, MapPin } from "lucide-react";
import type { ShippingStep } from "@/types/order";

export type { ShippingStep };

export interface ShippingTimelineProps {
  currentStep: ShippingStep;
  className?: string;
}

type TimelineStepData = {
  id: ShippingStep;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const timelineSteps: TimelineStepData[] = [
  { id: "label_created", label: "Label Created", description: "Shipping label generated", icon: <FileText className="w-4 h-4" /> },
  { id: "package_received", label: "Package Received", description: "Carrier accepted package", icon: <Package className="w-4 h-4" /> },
  { id: "in_transit", label: "In Transit", description: "Package is on the move", icon: <Truck className="w-4 h-4" /> },
  { id: "out_for_delivery", label: "Out For Delivery", description: "Arriving today", icon: <MapPin className="w-4 h-4" /> },
  { id: "delivered", label: "Delivered", description: "Package has arrived", icon: <Home className="w-4 h-4" /> },
];

export function ShippingTimeline({ currentStep, className }: ShippingTimelineProps) {
  const currentStepIndex = timelineSteps.findIndex((step) => step.id === currentStep);
  const getStepStatus = (index: number): "completed" | "current" | "pending" => {
    if (index < currentStepIndex) return "completed";
    if (index === currentStepIndex) return "current";
    return "pending";
  };

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-8">Shipping Progress</h2>
      <div className="relative">
        <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-border" />
        <div className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
          {timelineSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isPending = status === "pending";
            return (
              <div key={step.id} className={cn("relative flex md:flex-col items-start md:items-center gap-4 md:gap-4", isPending && "opacity-50")}>
                <div className={cn(
                  "relative z-10 w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-300 rounded-lg",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary/20 text-primary border-2 border-primary",
                  isPending && "bg-muted text-muted-foreground border border-border"
                )}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <div className="flex-1 md:text-center pt-1 md:pt-0">
                  <h3 className={cn("font-sans text-sm font-semibold transition-colors duration-300", isCompleted && "text-primary", isCurrent && "text-foreground", isPending && "text-muted-foreground")}>{step.label}</h3>
                  <p className={cn("font-sans text-xs mt-1 transition-colors duration-300", isCurrent ? "text-muted-foreground" : "text-muted-foreground/60")}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}