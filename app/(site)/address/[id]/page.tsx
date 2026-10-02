import { AddressForm } from "@/components/address/address-form";
import { AddressData } from "@/components/address/address-card";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserAddresses } from "@/server/actions/address";

interface EditAddressPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditAddressPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const result = await getUserAddresses();
    if (result.success && result.data) {
      const address = result.data.find((addr) => addr.id === id);
      
      return {
        title: address
          ? `Edit Address | Lily Waist Line`
          : "Address Not Found | Lily Waist Line",
        description: address
          ? `Edit your delivery address for ${address.city}, ${address.state}`
          : "The requested address could not be found.",
      };
    }
  } catch (error) {
    console.error("Failed to fetch address for metadata:", error);
  }

  return {
    title: "Edit Address | Lily Waist Line",
    description: "Edit your delivery address",
  };
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id } = await params;

  // Fetch user addresses from backend
  const result = await getUserAddresses();
  
  if (!result.success || !result.data) {
    notFound();
  }

  // Find the specific address
  const address = result.data.find((addr) => addr.id === id);

  if (!address) {
    notFound();
  }

  // Transform backend data to match UI interface
  const initialData: Partial<AddressData> = {
    id: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company || undefined,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || undefined,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    phone: address.phone || "",
    isDefault: address.isDefault,
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <AddressForm mode="edit" initialData={initialData} />
        </div>
      </main>
    </>
  );
}
