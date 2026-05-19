"use client";

import { useState, useEffect } from "react";
import { ProductCard, ProductCardProps } from "@/components/store/product-card";
import { ProductCardSkeleton } from "@/components/shared/product-card-skeleton";
import { EmptyProductsState } from "./empty-products-state";
import { LoadMoreProducts } from "./load-more-products";
import { cn } from "@/lib/utils";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";
import { ProductWithDetails } from "@/lib/services";
import { getProducts, loadMoreProducts } from "@/server/actions/products";

// Filtering utilities
function filterProducts(products: ProductCardProps[], searchParams: ShopSearchParams): ProductCardProps[] {
  let filtered = [...products];

  // Search filter (q)
  if (searchParams.q) {
    const query = searchParams.q.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.subtitle.toLowerCase().includes(query)
    );
  }

  // Size filter
  if (searchParams.size) {
    // For demo purposes, we'll simulate size filtering
    // In a real app, products would have size attributes
    filtered = filtered.filter(product => {
      // Simulate some products having different sizes
      const productSizes: Record<string, string[]> = {
        "1": ["xs", "s", "m", "l", "xl"],
        "2": ["s", "m", "l"],
        "3": ["m", "l", "xl"],
        "4": ["xs", "s", "m"],
        "5": ["s", "m", "l", "xl"],
        "6": ["m", "l"],
        "7": ["xs", "s", "m", "l"],
        "8": ["l", "xl"],
      };
      return productSizes[product.id]?.includes(searchParams.size!) ?? false;
    });
  }

  // Compression filter
  if (searchParams.compression) {
    // Map compression levels to products
    const compressionMap: Record<string, string[]> = {
      light: ["2", "5"],
      medium: ["1", "4", "7"],
      high: ["3", "6", "8"],
    };
    const compressionProducts = compressionMap[searchParams.compression] || [];
    filtered = filtered.filter(product => compressionProducts.includes(product.id));
  }

  // Sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Simulate newest by ID (higher ID = newer)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "featured":
      default:
        // Keep original order (featured)
        break;
    }
  }

  return filtered;
}

export interface ProductGridProps {
  className?: string;
  initialDisplayCount?: number;
  loadMoreCount?: number;
  searchParams?: ShopSearchParams;
  initialProducts?: ProductWithDetails[];
  initialTotalCount?: number;
  initialHasMore?: boolean;
}

export function ProductGrid({
  className,
  initialDisplayCount = 8,
  loadMoreCount = 4,
  searchParams,
  initialProducts,
  initialTotalCount,
  initialHasMore,
}: ProductGridProps) {
  const { clearFilters } = useShopURLSync();
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts || []);
  const [totalCount, setTotalCount] = useState(initialTotalCount || 0);
  const [hasMore, setHasMore] = useState(initialHasMore !== undefined ? initialHasMore : true);
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  // Transform database products to ProductCardProps
  const transformProducts = (dbProducts: ProductWithDetails[]): ProductCardProps[] => {
    return dbProducts.map((product) => {
      // Calculate stock state consistently with wishlist page
      let stockState: "in-stock" | "low-stock" | "out-of-stock" = "in-stock";
      if (!product.inStock) {
        stockState = "out-of-stock";
      } else if (product.variants.some(v => v.stockQuantity > 0 && v.stockQuantity <= 5)) {
        stockState = "low-stock";
      }

      return {
        id: product.id,
        variantId: product.variants[0]?.id || product.id, // Use first variant ID or fallback to product ID
        slug: product.slug,
        image: product.images[0]?.url || "/placeholder-product.jpg",
        name: product.name,
        subtitle: product.shortDescription,
        price: parseFloat(product.minPrice.toString()),
        originalPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.toString()) : undefined,
        badge: product.totalStock > 10 ? undefined : "Limited",
        stockState,
        isWishlisted: false, // This would come from user-specific data
      };
    });
  };

  // Load products from server if not provided initially
  useEffect(() => {
    if (!initialProducts) {
      const loadProducts = async () => {
        setIsLoading(true);
        try {
          const options = {
            search: searchParams?.q,
            size: searchParams?.size,
            compression: searchParams?.compression,
            sort: searchParams?.sort as 'FEATURED' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' || 'FEATURED',
            limit: initialDisplayCount,
            offset: 0,
            inStock: true
          };
          
          const result = await getProducts(options);
          setProducts(result.products);
          setTotalCount(result.total);
          setHasMore(result.hasMore);
        } catch (error) {
          console.error('Failed to load products:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProducts();
    }
  }, [searchParams, initialProducts, initialDisplayCount]);

  // Handle load more
  const handleLoadMore = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const options = {
        search: searchParams?.q,
        size: searchParams?.size,
        compression: searchParams?.compression,
        sort: searchParams?.sort as 'FEATURED' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' || 'FEATURED',
        limit: loadMoreCount,
        offset: products.length,
        inStock: true
      };
      
      const result = await loadMoreProducts(options);
      setProducts(prev => [...prev, ...result.products]);
      setTotalCount(result.total);
      setHasMore(result.hasMore);
      setDisplayCount(prev => prev + loadMoreCount);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformedProducts = transformProducts(products);
  const displayedProducts = transformedProducts.slice(0, displayCount);

  // Loading state with skeletons
  if (isLoading && products.length === 0) {
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
          {Array.from({ length: initialDisplayCount }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0 && !isLoading) {
    return (
      <div className={cn("flex flex-col gap-8", className)}>
        <EmptyProductsState
          onReset={() => {
            // Clear all URL filters
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
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <LoadMoreProducts
          onLoadMore={handleLoadMore}
          remainingCount={totalCount - products.length}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
