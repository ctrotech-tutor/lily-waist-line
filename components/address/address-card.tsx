"use client";

import { MapPin, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AddressData {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: AddressData;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  className,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: AddressCardProps) {
  const fullName = `${address.firstName} ${address.lastName}`;
  const fullAddress = [
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      className={cn(
        "relative p-6 md:p-8 transition-all duration-300",
        "border border-border hover:border-primary/50",
        address.isDefault && "border-primary/30 bg-primary/5",
        className
      )}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute top-4 right-4">
          <Badge
            variant="secondary"
            className="bg-primary text-primary-foreground font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1"
          >
            <Star className="w-3 h-3 mr-1 fill-current" />
            Default
          </Badge>
        </div>
      )}

      {/* Address Content */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0">
          <div className="w-12 h-12 border border-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Address Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground mb-1">
            {fullName}
          </h3>

          {address.company && (
            <p className="text-muted-foreground text-sm mb-2">{address.company}</p>
          )}

          <p className="text-foreground text-sm md:text-base leading-relaxed mb-2">
            {fullAddress}
          </p>

          <p className="text-muted-foreground text-sm">{address.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit?.(address.id)}
          className="flex-1 text-xs font-button tracking-wide uppercase border-border hover:border-primary hover:text-primary transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>

        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault?.(address.id)}
            disabled={isSettingDefault}
            className="flex-1 text-xs font-button tracking-wide uppercase border-border hover:border-primary hover:text-primary transition-colors"
          >
            {isSettingDefault ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Setting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Set Default
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete?.(address.id)}
          disabled={isDeleting}
          className="flex-1 text-xs font-button tracking-wide uppercase border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
