"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddressHeader } from "@/components/address/address-header";
import { AddressList } from "@/components/address/address-list";
import { EmptyAddressState } from "@/components/address/empty-address-state";
import { AddressData } from "@/components/address/address-card";
import { AddressHeaderSkeleton } from "@/components/address/address-header-skeleton";
import { AddressListSkeleton } from "@/components/address/address-list-skeleton";
import { getUserAddresses, deleteAddress, setDefaultAddress } from "@/server/actions/address";
import { ROUTES } from "@/lib/constants/routes";

export default function AddressPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);

  // Transform backend data to match UI interface
  const transformAddressData = (backendAddress: {
    id: string;
    firstName: string;
    lastName: string;
    company: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
    isDefault: boolean;
  }): AddressData => ({
    id: backendAddress.id,
    firstName: backendAddress.firstName,
    lastName: backendAddress.lastName,
    company: backendAddress.company || undefined,
    addressLine1: backendAddress.addressLine1,
    addressLine2: backendAddress.addressLine2 || undefined,
    city: backendAddress.city,
    state: backendAddress.state,
    postalCode: backendAddress.postalCode,
    country: backendAddress.country,
    phone: backendAddress.phone || "",
    isDefault: backendAddress.isDefault,
  });

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const result = await getUserAddresses();
        if (result.success && result.data) {
          const transformedAddresses = result.data.map(transformAddressData);
          setAddresses(transformedAddresses);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddAddress = () => {
    router.push(ROUTES.ADDRESS_NEW);
  };

  const handleEditAddress = (id: string) => {
    router.push(`/address/${id}`);
  };

  const handleDeleteAddress = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteAddress(id);
      if (result.success) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        toast.success("Address deleted");
      } else {
        toast.error(result.error || "Failed to delete address");
      }
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsSettingDefault(id);
    try {
      const result = await setDefaultAddress(id);
      if (result.success) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          }))
        );
        toast.success("Default address updated");
      } else {
        toast.error(result.error || "Failed to set default address");
      }
    } catch {
      toast.error("Failed to set default address");
    } finally {
      setIsSettingDefault(null);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        {isLoading ? (
          <AddressHeaderSkeleton />
        ) : (
          <AddressHeader
            addressCount={addresses.length}
            isLoaded={!isLoading}
            onAddAddress={handleAddAddress}
          />
        )}

        {/* Address Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {isLoading ? (
            <AddressListSkeleton count={4} />
          ) : addresses.length === 0 ? (
            <EmptyAddressState onAddAddress={handleAddAddress} />
          ) : (
            <AddressList
              addresses={addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
              isDeleting={isDeleting}
              isSettingDefault={isSettingDefault}
            />
          )}
        </div>
      </main>
    </>
  );
}
