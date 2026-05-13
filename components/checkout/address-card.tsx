"use client";

import { MapPin, Star, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface AddressCardData {
  id: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface CheckoutAddressCardProps {
  address: AddressCardData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  className?: string;
}

export function CheckoutAddressCard({
  address,
  isSelected,
  onSelect,
  className,
}: CheckoutAddressCardProps) {
  const fullName = `${address.firstName} ${address.lastName}`;
  const locationLine = [
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <Card
      onClick={() => onSelect(address.id)}
      className={cn(
        "relative p-5 md:p-6 cursor-pointer",
        "border transition-all duration-300",
        "hover:border-[#d4af37]/50",
        isSelected
          ? "border-[#d4af37] bg-[#d4af37]/5 ring-1 ring-[#d4af37]/30"
          : "border-border bg-card",
        className
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

      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute top-4 left-4">
          <Badge
            variant="secondary"
            className="bg-[#d4af37] text-black font-sans text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5"
          >
            <Star className="w-3 h-3 mr-1 fill-current" />
            Default
          </Badge>
        </div>
      )}

      {/* Address Content */}
      <div className="flex items-start gap-4 pt-8">
        {/* Icon */}
        <div className="shrink-0">
          <div
            className={cn(
              "w-10 h-10 flex items-center justify-center border transition-colors duration-300",
              isSelected
                ? "border-[#d4af37] bg-[#d4af37]/10"
                : "border-[#d4af37]/20"
            )}
          >
            <MapPin
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isSelected ? "text-[#d4af37]" : "text-[#d4af37]/70"
              )}
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-semibold text-foreground mb-1">
            {fullName}
          </h3>

          <p className="text-foreground text-sm leading-relaxed mb-1">
            {address.addressLine1}
          </p>

          {address.addressLine2 && (
            <p className="text-foreground text-sm leading-relaxed mb-1">
              {address.addressLine2}
            </p>
          )}

          <p className="text-muted-foreground text-sm mb-2">{locationLine}</p>

          {address.phone && (
            <p className="text-muted-foreground text-sm">{address.phone}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
