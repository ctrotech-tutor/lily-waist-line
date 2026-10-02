"use client";

import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { ROUTES } from "@/lib/constants/routes";
import { useAddToCart } from "@/hooks/use-cart-mutations";
import { cn } from "@/lib/utils";

interface ProductStickyBarProps {
  name: string;
  image: string;
  selectedSize: string | null;
  selectedCompression: string | null;
  variantId: string | null;
  price: number;
  disabled: boolean;
  inCart: boolean;
}

export function ProductStickyBar({
  name,
  image,
  selectedSize,
  selectedCompression,
  variantId,
  price,
  disabled,
  inCart,
}: ProductStickyBarProps) {
  const router = useRouter();
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!variantId || disabled) return;
    if (inCart) {
      router.push(ROUTES.CART);
      return;
    }
    addToCartMutation.mutate(
      { variantId, quantity: 1 },
      {
        onError: (error) => {
          toast.error(error.message || "Failed to add to cart");
        },
      },
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-border bg-background/95 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-16 max-w-360 items-center gap-4 px-5 md:px-12 lg:px-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-card">
            <OptimizedImage
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedSize && selectedCompression
                ? `${selectedSize} / ${selectedCompression}`
                : "Select options"}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="font-heading text-lg text-foreground whitespace-nowrap">
            ${Number(price).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={disabled || addToCartMutation.isPending}
            className={cn(
              "gap-2 whitespace-nowrap",
              inCart && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {addToCartMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
            {disabled ? "Out of Stock" : inCart ? "In Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
