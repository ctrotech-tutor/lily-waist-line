import type { Metadata } from "next";
import { Suspense } from "react";

import { ShopHeader } from "@/components/shop/shop-header";
import { ShopHeaderSkeleton } from "@/components/shop/shop-header-skeleton";
import { ShopLayout } from "@/components/shop/shop-layout";

import {
  parseShopSearchParams,
} from "@/lib/shop-url-sync-server";

import { ProductService } from "@/lib/services/product-service";

export const metadata: Metadata = {
  title: "Shop | Lily Waist Line",
  description:
    "Discover premium waist trainers designed for confidence, sculpting, and transformation.",
};

interface ShopPageProps {
  searchParams:
    | Promise<Record<string, string | string[]>>
    | Record<string, string | string[]>;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  // Handle both Promise and direct object cases
  const params =
    searchParams instanceof Promise
      ? await searchParams
      : searchParams;

  const shopParams = parseShopSearchParams(params);

  // Convert URL params to product service options
  const productOptions = {
    search: shopParams.q,
    size: shopParams.size,
    compression: shopParams.compression,
    sort:
      (shopParams.sort as
        | "FEATURED"
        | "NEWEST"
        | "PRICE_ASC"
        | "PRICE_DESC") || "FEATURED",
    limit: 12,
    offset: 0,
    inStock: true,
  };

  // Fetch products
  const productResult =
    await ProductService.getProducts(productOptions);

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Header */}
      <Suspense fallback={<ShopHeaderSkeleton />}>
        <ShopHeader
          eyebrow="Lily Collection"
          title="Shop Waist Trainers"
          subtitle="Premium waist trainers crafted for the woman who demands excellence. Sculpt your silhouette with confidence, discipline, and uncompromising luxury."
          productCount={productResult.total}
        />
      </Suspense>

      {/* Shop Layout */}
      <ShopLayout
        showFilters={true}
        showSort={true}
        searchParams={shopParams}
        initialProducts={productResult.products}
        initialTotalCount={productResult.total}
        initialHasMore={productResult.hasMore}
      />
    </div>
  );
}