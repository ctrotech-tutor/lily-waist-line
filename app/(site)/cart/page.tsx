"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { CartHeaderSkeleton } from "@/components/cart/cart-header-skeleton";
import { CartItemSkeleton } from "@/components/cart/cart-item-skeleton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCart } from "@/server/actions/cart";
import type { CartData } from "@/lib/services/cart-service";

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const result = await getCart();
        if (result.success && result.data) {
          setCartData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity changes with backend
  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    try {
      const { updateCartQuantity } = await import("@/server/actions/cart");
      const result = await updateCartQuantity({ cartItemId, quantity: newQuantity });
      
      if (result.success) {
        // Refresh cart data
        const cartResult = await getCart();
        if (cartResult.success && cartResult.data) {
          setCartData(cartResult.data);
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  // Handle item removal with backend
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      const { removeFromCart } = await import("@/server/actions/cart");
      const result = await removeFromCart({ cartItemId });
      
      if (result.success) {
        // Refresh cart data
        const cartResult = await getCart();
        if (cartResult.success && cartResult.data) {
          setCartData(cartResult.data);
        }
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Handle save for later (move to wishlist)
  const handleSaveForLater = async (productId: string) => {
    try {
      const { addToWishlist } = await import("@/server/actions/wishlist");
      const result = await addToWishlist(productId);
      
      if (result.success) {
        // Remove from cart after adding to wishlist
        // Find the cart item with this product
        const cartItem = cartData?.items.find(item => item.product.id === productId);
        if (cartItem) {
          await handleRemoveItem(cartItem.id);
        }
      }
    } catch (error) {
      console.error("Failed to save for later:", error);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/shop");
  };

  const itemCount = cartData?.summary.totalItems || 0;
  const subtotal = cartData?.summary.subtotal || 0;
  const deliveryFee = cartData?.summary.shippingFee || 0;
  const discount = 0;
  const total = cartData?.summary.total || 0;

  return (
    <>
      <div className="min-h-full bg-background">
        {/* Page Header Section - ShopHeader Style */}
        <div className="border-b border-border">
          <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
            <div className="py-12 md:py-16 lg:py-20">
              {isLoading ? (
                <CartHeaderSkeleton />
              ) : (
                <>
                  {/* Eyebrow Label */}
                  <div
                    className={cn(
                      "flex items-center gap-2 mb-6",
                      "transition-all duration-700 ease-out",
                      isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Shopping Cart
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className={cn(
                      "w-16 h-px bg-primary mb-8",
                      "transition-all duration-700 delay-100 ease-out",
                      isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Main Heading */}
                  <h1
                    className={cn(
                      "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                      "leading-[1.1] tracking-tight text-foreground",
                      "mb-6 max-w-2xl",
                      "transition-all duration-1000 delay-200 ease-out",
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                  >
                    Your Cart
                  </h1>

                  {/* Supporting Copy */}
                  <p
                    className={cn(
                      "font-sans text-base sm:text-lg",
                      "text-muted-foreground leading-relaxed",
                      "max-w-xl mb-8",
                      "transition-all duration-1000 delay-300 ease-out",
                      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                  >
                    Review your selected pieces and begin your transformation journey
                  </p>

                  {/* Item Count */}
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      "transition-all duration-1000 delay-400 ease-out",
                      isLoaded ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="w-2 h-2 bg-primary" />
                    <span className="font-sans text-sm text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cart Layout Container */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Desktop Layout - Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Cart Items Area */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="space-y-4">
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </div>
              ) : itemCount === 0 ? (
                <EmptyCart />
              ) : (
                <div className="space-y-4">
                  {cartData?.items.map((item) => (
                    <CartItem
                      key={item.id}
                      cartItem={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Cart Summary Area */}
            <div className="lg:col-span-1">
              {itemCount > 0 && (
                <div className="lg:sticky lg:top-8">
                  <CartSummary
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    discount={discount}
                    itemCount={itemCount}
                    total={total}
                    onCheckout={handleCheckout}
                    onContinueShopping={handleContinueShopping}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
