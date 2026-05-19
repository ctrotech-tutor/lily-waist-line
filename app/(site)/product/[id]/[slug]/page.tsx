import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Separator } from "@/components/ui/separator";

import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductTrustBenefitsSection } from "@/components/product/product-trust-benefits-section";
import { ProductRelatedProducts } from "@/components/product/product-related-products";

import { getProductBySlug } from "@/server/actions/products";
import type { ProductWithDetails } from "@/lib/services";

import { ProductGallery } from "@/components/product/product-gallery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product | Lily Waist Line",
    };
  }

  return {
    title: `${product.name} | Lily Waist Line`,
    description:
      product.shortDescription ||
      "Luxury waist trainers",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { slug } = await params;

  let product: ProductWithDetails | null;

  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Purchase */}
          <div className="lg:col-span-5">

            <div
              className="
                rounded-3xl
                border border-border
                bg-card
                p-5 md:p-8
                lg:sticky lg:top-24
              "
            >
              <ProductPurchasePanel
                product={product}
              />
            </div>

          </div>

        </div>

      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">

        <Separator className="my-12" />

        <ProductTrustBenefitsSection />

        <Separator className="my-12" />

        <ProductRelatedProducts />

      </div>

    </div>
  );
}