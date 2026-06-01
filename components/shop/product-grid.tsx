"use client";

import { ProductCard } from "@/components/store/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { EmptyProductsState } from "./empty-products-state";
import { LoadMoreProducts } from "./load-more-products";
import { cn } from "@/lib/utils";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";
import { useProductsInfinite } from "@/hooks/use-products-infinite";
import { transformProductsToCardProps } from "@/lib/utils/product-transformers";

export interface ProductGridProps {
  className?: string;
  searchParams?: ShopSearchParams;
}

export function ProductGrid({
  className,
  searchParams,
}: ProductGridProps) {
  const { clearFilters } = useShopURLSync();

  const queryOptions = {
    search: searchParams?.q,
    size: searchParams?.size,
    compression: searchParams?.compression,
    availability: searchParams?.availability as 'in-stock' | 'low-stock' | 'out-of-stock' | undefined,
    sort: searchParams?.sort as 'FEATURED' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' || 'FEATURED',
    limit: 12,
  };

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProductsInfinite(queryOptions);

  // Flatten all pages into single product array
  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const totalCount = data?.pages[0]?.total || 0;
  const hasMore = hasNextPage || false;

  // Transform products using shared utility
  const transformedProducts = transformProductsToCardProps(allProducts);

  // Handle load more
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Loading state with skeletons
  if (isLoading && allProducts.length === 0) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        <div
          className={cn(
            "grid grid-cols-2 gap-4",
            "sm:gap-6",
            "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            "lg:gap-8"
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (allProducts.length === 0 && !isLoading) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        <EmptyProductsState
          onReset={() => {
            clearFilters();
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Product Grid */}
      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          "sm:gap-6",
          "md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
          "lg:gap-8"
        )}
      >
        {transformedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <LoadMoreProducts
          onLoadMore={handleLoadMore}
          remainingCount={totalCount - allProducts.length}
          isLoading={isFetchingNextPage}
        />
      )}
    </div>
  );
}
