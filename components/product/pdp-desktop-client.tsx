"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductStickyBar } from "@/components/product/product-sticky-bar";
import { useProductCartStatus } from "@/hooks/use-product-interactions";
import type { ProductWithDetails } from "@/lib/services";

interface PdpDesktopClientProps {
  product: ProductWithDetails;
}

export function PdpDesktopClient({ product }: PdpDesktopClientProps) {
  const firstInStock = product.variants.find(v => v.stockQuantity > 0)
  const [selectedSize, setSelectedSize] = useState<string | null>(firstInStock?.size ?? null);
  const [selectedCompression, setSelectedCompression] = useState<string | null>(firstInStock?.compressionLevel ?? null);

  const selectedVariant = selectedSize && selectedCompression
    ? product.variants.find(
        v => v.size === selectedSize && v.compressionLevel === selectedCompression
      )
    : null;

  const variantImage = selectedVariant?.images?.[0]?.url;
  const { inCart } = useProductCartStatus(selectedVariant?.id || "");

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;
  const displayPrice = selectedVariant?.price != null ? Number(selectedVariant.price) : Number(product.basePrice);

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            productName={product.name}
            variantImage={variantImage}
          />
        </div>

        <div className="hidden lg:block lg:col-span-5">
          <div className="rounded-3xl border border-border bg-card p-5 md:p-8 lg:sticky lg:top-24">
            <ProductPurchasePanel
              product={product}
              onVariantChange={(size, compression) => {
                setSelectedSize(size);
                setSelectedCompression(compression);
              }}
            />
          </div>
        </div>
      </div>

      <ProductStickyBar
        name={product.name}
        image={product.images[0]?.url}
        selectedSize={selectedSize}
        selectedCompression={selectedCompression}
        variantId={selectedVariant?.id || null}
        price={displayPrice}
        disabled={isOutOfStock}
        inCart={inCart}
      />
    </>
  );
}
