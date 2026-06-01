export const dynamic = "force-dynamic"
import { AddressForm } from "@/components/address/address-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add New Address | Lily Waist Line",
  description: "Add a new delivery address to your account for seamless order fulfillment.",
};

function NewAddressContent({ redirect }: { redirect?: string }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <AddressForm mode="create" redirectTo={redirect} />
      </div>
    </main>
  );
}

export default async function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewAddressContent redirect={resolvedSearchParams.redirect} />
    </Suspense>
  );
}