"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WishlistHeader } from "@/components/wishlist/wishlist-header";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import { EmptyWishlistState } from "@/components/wishlist/empty-wishlist-state";
import { cn } from "@/lib/utils";

// Mock wishlist item data - realistic structure for future Supabase integration
interface WishlistItemData {
  id: string;
  name: string;
  tagline?: string;
  image: string;
  price: number;
  originalPrice?: number;
  stockState: "in-stock" | "low-stock" | "out-of-stock";
}

// Mock data for wishlist items - TEMPORARY only
// Set to empty array [] to test empty state, or populate to test with items
const initialWishlistItems: WishlistItemData[] = [
  {
    id: "1",
    name: "Classic Waist Trainer",
    tagline: "Sculpted confidence for every day",
    image: "/img-p-1.png",
    price: 89.99,
    originalPrice: 119.99,
    stockState: "in-stock",
  },
  {
    id: "2",
    name: "Luxe Compression Wrap",
    tagline: "Maximum support, luxurious feel",
    image: "/img-p-2.png",
    price: 124.99,
    stockState: "low-stock",
  },
  {
    id: "3",
    name: "Everyday Shapewear",
    tagline: "Seamless comfort under any outfit",
    image: "/img-p-3.png",
    price: 69.99,
    originalPrice: 89.99,
    stockState: "in-stock",
  },
  {
    id: "4",
    name: "Premium Waist Cincher",
    tagline: "Hourglass definition redefined",
    image: "/img-1.png",
    price: 149.99,
    stockState: "out-of-stock",
  },
];

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemData[]>(initialWishlistItems);
  const [isLoaded] = useState(true);

  // Handle remove item - local state only (no backend)
  const handleRemoveItem = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  // Handle add to cart - placeholder for future implementation
  const handleAddToCart = (id: string) => {
    // Cart integration not connected yet
    console.log(`Add to cart clicked for item: ${id}`);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/shop");
  };

  const itemCount = wishlistItems.length;

  return (
    <>
      <div className="min-h-full">
        {/* Page Header Section */}
        <WishlistHeader
          itemCount={itemCount}
          isLoaded={isLoaded}
          onContinueShopping={handleContinueShopping}
        />

        {/* Wishlist Content Container */}
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
          {itemCount === 0 ? (
            <EmptyWishlistState onContinueShopping={handleContinueShopping} />
          ) : (
            <div
              className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
                "transition-all duration-1000 delay-200 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {wishlistItems.map((item) => (
                <WishlistItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  tagline={item.tagline}
                  image={item.image}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  stockState={item.stockState}
                  onAddToCart={handleAddToCart}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
