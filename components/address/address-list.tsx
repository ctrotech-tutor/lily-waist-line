"use client";

import { AddressCard, AddressData } from "./address-card";
import { cn } from "@/lib/utils";

interface AddressListProps {
  addresses: AddressData[];
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export function AddressList({
  addresses,
  className,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressListProps) {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        className
      )}
    >
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
