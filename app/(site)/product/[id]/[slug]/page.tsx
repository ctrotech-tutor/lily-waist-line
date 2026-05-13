import type { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductTrustBenefitsSection } from "@/components/product/product-trust-benefits-section";
import { ProductRelatedProducts } from "@/components/product/product-related-products";
import { Footer } from "@/components/layout/footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";

// Mock product data — to be replaced with real data fetching
const mockProduct = {
  id: "1",
  name: "Elite Sculpt Waist Trainer",
  subtitle: "Maximum Compression • Black",
  price: 89.99,
  originalPrice: 119.99,
  stockState: "in-stock" as const,
  description:
    "The Elite Sculpt Waist Trainer represents the pinnacle of waist training technology. Crafted from premium latex with reinforced steel bones, this trainer delivers maximum compression for dramatic waist reduction while maintaining comfort during extended wear.",
  images: [
    "/img-1.png",
    "/img-p-1.png",
    "/img-p-2.png",
    "/img-p-3.png",
  ],
  features: [
    "9 reinforced steel bones for structural support",
    "Triple-layer construction: cotton, latex, cotton",
    "3-hook closure system for progressive tightening",
    "Breathable inner lining for all-day comfort",
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${productName} | Lily Waist Line`,
    description: "Premium waist trainers designed for sculpting and transformation",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  return (
    <>
    <div className="min-h-screen bg-background">

      {/* Main Product Section — Desktop: 2-column, Mobile: Stacked */}
      <section className="mx-auto max-w-360">
        <div className="grid lg:grid-cols-2 lg:gap-0">
          {/* Left Column — Product Media */}
          <div className="relative">
            {/* Main Image Gallery */}
            <div className="relative aspect-square lg:aspect-4/5 bg-card">
              <Image
                src={mockProduct.images[0]}
                alt={mockProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Navigation Arrows (Visual Only) */}
              <button
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2",
                  "flex h-10 w-10 items-center justify-center",
                  "bg-black/60 backdrop-blur-sm text-white",
                  "transition-colors hover:bg-[#d4af37] hover:text-black"
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2",
                  "flex h-10 w-10 items-center justify-center",
                  "bg-black/60 backdrop-blur-sm text-white",
                  "transition-colors hover:bg-[#d4af37] hover:text-black"
                )}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="bg-black/60 backdrop-blur-sm px-3 py-1.5 font-sans text-xs text-white">
                  1 / {mockProduct.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 p-4 lg:p-6">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative aspect-square w-20 overflow-hidden",
                    "border-2 transition-colors",
                    index === 0
                      ? "border-[#d4af37]"
                      : "border-transparent hover:border-[#d4af37]/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column — Product Purchase Panel */}
          <div className="flex flex-col lg:border-l lg:border-border">
            <div className="flex-1 px-5 py-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:px-12 lg:py-12">
              <ProductPurchasePanel
                product={{
                  name: mockProduct.name,
                  tagline: "Maximum Compression for Ultimate Transformation",
                  price: mockProduct.price,
                  originalPrice: mockProduct.originalPrice,
                  stockStatus: mockProduct.stockState,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Sections Below */}
      <div className="mx-auto max-w-360 px-5 lg:px-12">
        <Separator className="my-0 lg:my-0" />

        {/* Product Trust & Benefits Section */}
        <ProductTrustBenefitsSection />

        <Separator />

        {/* Related Products Section */}
        <ProductRelatedProducts />
      </div>
    </div>
    </>
  );
}
