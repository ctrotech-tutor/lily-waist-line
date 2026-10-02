"use client";
export const dynamic = "force-dynamic"
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { CartHeaderSkeleton } from "@/components/cart/cart-header-skeleton";
import { CartItemSkeleton } from "@/components/cart/cart-item-skeleton";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useUpdateQuantity } from "@/hooks/use-cart-mutations";
import { useRemoveFromCart } from "@/hooks/use-cart-mutations";
import { useAddToWishlist } from "@/hooks/use-wishlist-mutations";
import { ROUTES } from "@/lib/constants/routes";

export default function CartPage() {
  const router = useRouter();
  const { data: cartData, isLoading } = useCart();
  const updateQuantity = useUpdateQuantity();
  const removeFromCart = useRemoveFromCart();
  const addToWishlist = useAddToWishlist();

  // Handle quantity changes with backend
  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    updateQuantity.mutate({ cartItemId, quantity: newQuantity });
  };

  // Handle item removal with backend
  const handleRemoveItem = async (cartItemId: string) => {
    removeFromCart.mutate({ cartItemId });
  };

  // Handle save for later (move to wishlist)
  const handleSaveForLater = async (productId: string, cartItemId: string) => {
    addToWishlist.mutate(productId, {
      onSuccess: () => {
        // Remove from cart after adding to wishlist
        removeFromCart.mutate({ cartItemId });
      }
    });
  };

  // Handle checkout
  const handleCheckout = () => {
    router.push(ROUTES.CHECKOUT);
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push(ROUTES.SHOP);
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
                      !isLoading ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
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
                      !isLoading ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
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
                      !isLoading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
                      !isLoading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                  >
                    Review your selected pieces and begin your transformation journey
                  </p>

                  {/* Item Count */}
                  <div
                    className={cn(
                      "flex items-center gap-3",
                      "transition-all duration-1000 delay-400 ease-out",
                      !isLoading ? "opacity-100" : "opacity-0"
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
                      onSaveForLater={(productId) => handleSaveForLater(productId, item.id)}
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
