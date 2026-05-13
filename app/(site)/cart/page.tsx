"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Mock cart item data - realistic structure for future Supabase integration
interface CartItemData {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  compression?: string;
  quantity: number;
}

// Mock data for cart items - TEMPORARY only
const initialCartItems: CartItemData[] = [
  {
    id: "1",
    name: "Classic Waist Trainer",
    image: "/img-p-1.png",
    price: 89.99,
    size: "M",
    compression: "Medium",
    quantity: 1,
  },
  {
    id: "2",
    name: "Luxe Compression Wrap",
    image: "/img-p-2.png",
    price: 124.99,
    size: "L",
    compression: "High",
    quantity: 2,
  },
  {
    id: "3",
    name: "Everyday Shapewear",
    image: "/img-p-3.png",
    price: 69.99,
    size: "S",
    quantity: 1,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>(initialCartItems);
  const [isLoaded] = useState(true);

  // Calculate totals from cart items
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 150 ? 0 : 12.99;
  const discount = 0;

  // Handle quantity changes - local state only (no backend)
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Handle item removal - local state only (no backend)
  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Handle checkout - placeholder for future implementation
  const handleCheckout = () => {
    // Checkout flow not connected yet
    console.log("Proceed to checkout clicked");
  };

  // Handle continue shopping
  const handleContinueShopping = () => {
    router.push("/shop");
  };

  return (
    <>
      <div className="min-h-full">
        {/* Page Header Section - ShopHeader Style */}
        <div className="border-b border-border">
          <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
            <div className="py-12 md:py-16 lg:py-20">
              {/* Eyebrow Label */}
              <div
                className={cn(
                  "flex items-center gap-2 mb-6",
                  "transition-all duration-700 ease-out",
                  isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                )}
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                  Shopping Cart
                </span>
              </div>

              {/* Gold Divider */}
              <div
                className={cn(
                  "w-16 h-px bg-[#d4af37] mb-8",
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
                <div className="w-2 h-2 bg-[#d4af37]" />
                <span className="font-sans text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Layout Container */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Desktop Layout - Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Cart Items Area */}
            <div className="lg:col-span-2">
              {itemCount === 0 ? (
                <EmptyCart />
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      price={item.price}
                      size={item.size}
                      compression={item.compression}
                      quantity={item.quantity}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
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
