import { AddressForm } from "@/components/address/address-form";
import { AddressData } from "@/components/address/address-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Mock data for testing edit mode
// In production, this would be fetched from the database
const mockAddresses: Record<string, AddressData> = {
  "1": {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    company: "Lily Waist Line HQ",
    addressLine1: "123 Transformation Blvd",
    addressLine2: "Suite 100",
    city: "Dallas",
    state: "Texas",
    postalCode: "75201",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  "2": {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    addressLine1: "789 Elegance Avenue",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90210",
    country: "United States",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
};

interface EditAddressPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EditAddressPageProps): Promise<Metadata> {
  const { id } = await params;
  const address = mockAddresses[id];

  return {
    title: address
      ? `Edit Address | Lily Waist Line`
      : "Address Not Found | Lily Waist Line",
    description: address
      ? `Edit your delivery address for ${address.city}, ${address.state}`
      : "The requested address could not be found.",
  };
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id } = await params;

  // In production, fetch the address from the database
  // For now, use mock data
  const address = mockAddresses[id];

  // If address not found in mock data, show 404
  // In production, this would check the database
  if (!address && process.env.NODE_ENV === "production") {
    notFound();
  }

  // Use mock data for development, or empty data if ID not found
  const initialData = address || mockAddresses["1"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <AddressForm mode="edit" initialData={initialData} />
        </div>
      </main>
      <Footer />
    </>
  );
}
