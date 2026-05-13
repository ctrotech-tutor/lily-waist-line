import { AddressForm } from "@/components/address/address-form";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Address | Lily Waist Line",
  description: "Add a new delivery address to your account for seamless order fulfillment.",
};

export default function NewAddressPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
          <AddressForm mode="create" />
        </div>
      </main>
      <Footer />
    </>
  );
}
