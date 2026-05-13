"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "cashapp" | "paypal";

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "cashapp",
    label: "Cash App (US Orders)",
    description: "Pay securely via Cash App for US-based customers.",
    badge: "Recommended for US",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: "paypal",
    label: "PayPal (International Orders)",
    description: "Pay securely via PayPal for global customers.",
    badge: "Global Payments",
    icon: <Globe className="w-5 h-5" />,
  },
];

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  className,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {paymentOptions.map((option) => {
        const isSelected = selectedMethod === option.id;

        return (
          <Card
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            className={cn(
              "relative p-5 md:p-6",
              "border transition-all duration-300",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-[#d4af37]/50",
              isSelected
                ? "border-[#d4af37] bg-[#d4af37]/5 ring-1 ring-[#d4af37]/30"
                : "border-border bg-card"
            )}
          >
            {/* Selection Indicator */}
            <div
              className={cn(
                "absolute top-4 right-4 w-6 h-6 flex items-center justify-center",
                "border transition-all duration-300",
                isSelected
                  ? "bg-[#d4af37] border-[#d4af37]"
                  : "bg-transparent border-border"
              )}
            >
              {isSelected && <Check className="w-4 h-4 text-black" />}
            </div>

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className={cn(
                  "font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5",
                  isSelected
                    ? "bg-[#d4af37] text-black"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.badge}
              </Badge>
            </div>

            {/* Payment Method Content */}
            <div className="flex items-start gap-4 pt-10">
              {/* Icon */}
              <div
                className={cn(
                  "shrink-0 w-12 h-12 flex items-center justify-center border transition-all duration-300",
                  isSelected
                    ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                    : "border-[#d4af37]/20 text-[#d4af37]/70"
                )}
              >
                {option.icon}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-base font-semibold text-foreground mb-1">
                  {option.label}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
