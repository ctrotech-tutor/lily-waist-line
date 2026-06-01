"use client";

import { cn } from "@/lib/utils";
import { MapPin, CreditCard, CheckCircle } from "lucide-react";

export interface CheckoutProgressProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const steps = [
  {
    number: 1,
    label: "Address",
    icon: MapPin,
  },
  {
    number: 2,
    label: "Payment",
    icon: CreditCard,
  },
  {
    number: 3,
    label: "Review",
    icon: CheckCircle,
  },
];

export function CheckoutProgress({
  currentStep,
  className,
}: CheckoutProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress Container */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Indicator */}
              <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-lg",
                    "transition-all duration-300",
                    isCompleted && "bg-secondary text-secondary-foreground",
                    isCurrent && "bg-secondary text-secondary-foreground ring-2 ring-secondary/30",
                    isPending && "bg-muted text-muted-foreground border border-border"
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    "font-sans text-xs font-medium mt-2",
                    "transition-colors duration-300",
                    (isCompleted || isCurrent) && "text-foreground",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-4",
                    "transition-colors duration-300",
                    isCompleted ? "bg-secondary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
