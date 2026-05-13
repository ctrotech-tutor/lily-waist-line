"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutAddressCard, type AddressCardData } from "./address-card";

export type { AddressCardData };
import { cn } from "@/lib/utils";

// Mock addresses per Feature Spec 45
const mockAddresses: AddressCardData[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    addressLine1: "12 Luxury Street",
    city: "Lagos",
    country: "Nigeria",
    phone: "08012345678",
    isDefault: true,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
    addressLine1: "45 Elite Avenue",
    addressLine2: "Suite 12B",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    phone: "08098765432",
    isDefault: false,
  },
];

interface AddressSelectorProps {
  onAddressSelect?: (address: AddressCardData | null) => void;
  className?: string;
}

// Get default address for initial state
const defaultAddress = mockAddresses.find((addr) => addr.isDefault);

export function AddressSelector({
  onAddressSelect,
  className,
}: AddressSelectorProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(defaultAddress?.id || null);
  const [hasSelection, setHasSelection] = useState(!!defaultAddress);

  // Notify parent of initial selection
  useEffect(() => {
    if (defaultAddress && onAddressSelect) {
      onAddressSelect(defaultAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setHasSelection(true);
    const selected = mockAddresses.find((addr) => addr.id === id);
    onAddressSelect?.(selected || null);
  };

  const handleAddNew = () => {
    router.push("/address/new");
  };

  // If no addresses, show empty state
  if (mockAddresses.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Empty State */}
        <div className="text-center py-12 px-6 border border-border bg-muted/30">
          <div className="w-16 h-16 mx-auto mb-4 border border-[#d4af37]/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-[#d4af37]/50" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
            No Saved Addresses
          </h3>
          <p className="font-sans text-sm text-muted-foreground max-w-sm mx-auto mb-6">
            Add a shipping address to continue with your order
          </p>
          <Button
            onClick={handleAddNew}
            className={cn(
              "h-12 px-6",
              "font-sans text-sm font-semibold uppercase tracking-wider",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary/90",
              "transition-colors duration-200"
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Address List */}
      <div className="grid grid-cols-1 gap-4">
        {mockAddresses.map((address) => (
          <CheckoutAddressCard
            key={address.id}
            address={address}
            isSelected={selectedId === address.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Add New Address Button */}
      <Button
        onClick={handleAddNew}
        variant="outline"
        className={cn(
          "w-full h-14",
          "font-sans text-sm font-medium",
          "border-dashed border-border",
          "hover:border-[#d4af37] hover:bg-[#d4af37]/5",
          "transition-all duration-200"
        )}
      >
        <Plus className="w-4 h-4 mr-2 text-[#d4af37]" />
        Add New Address
      </Button>

      {/* Delivery Confirmation Message */}
      <div
        className={cn(
          "flex items-start gap-3 p-4 border",
          "transition-all duration-300",
          hasSelection
            ? "border-[#d4af37]/30 bg-[#d4af37]/5"
            : "border-border bg-muted/30 opacity-60"
        )}
      >
        <MapPin
          className={cn(
            "w-5 h-5 shrink-0 mt-0.5",
            hasSelection ? "text-[#d4af37]" : "text-muted-foreground"
          )}
        />
        <p className="font-sans text-sm text-foreground">
          {hasSelection ? (
            <>
              <span className="font-medium">
                This is where your order will be delivered.
              </span>{" "}
              <span className="text-muted-foreground">
                Please ensure the address is correct before continuing.
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">
              Select a shipping address to continue with your order
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
