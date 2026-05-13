"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddressHeader } from "@/components/address/address-header";
import { AddressList } from "@/components/address/address-list";
import { EmptyAddressState } from "@/components/address/empty-address-state";
import { AddressData } from "@/components/address/address-card";

// Mock addresses for testing the "saved addresses" state
// const mockAddresses: AddressData[] = [
//   {
//     id: "1",
//     firstName: "Sarah",
//     lastName: "Johnson",
//     company: "Lily Waist Line",
//     addressLine1: "123 Elegance Boulevard",
//     addressLine2: "Suite 456",
//     city: "New York",
//     state: "NY",
//     postalCode: "10001",
//     country: "United States",
//     phone: "+1 (555) 123-4567",
//     isDefault: true,
//   },
//   {
//     id: "2",
//     firstName: "Sarah",
//     lastName: "Johnson",
//     addressLine1: "789 Transformation Ave",
//     city: "Los Angeles",
//     state: "CA",
//     postalCode: "90210",
//     country: "United States",
//     phone: "+1 (555) 987-6543",
//     isDefault: false,
//   },
// ];

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoaded] = useState(true);

  const handleAddAddress = () => {
    router.push("/address/new");
  };

  const handleEditAddress = (id: string) => {
    router.push(`/address/${id}`);
  };

  const handleDeleteAddress = (id: string) => {
    // Local state only - no backend
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    // Local state only - no backend
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <AddressHeader
          addressCount={addresses.length}
          isLoaded={isLoaded}
          onAddAddress={handleAddAddress}
        />

        {/* Address Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {addresses.length === 0 ? (
            <EmptyAddressState onAddAddress={handleAddAddress} />
          ) : (
            <AddressList
              addresses={addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          )}
        </div>
      </main>
    </>
  );
}
