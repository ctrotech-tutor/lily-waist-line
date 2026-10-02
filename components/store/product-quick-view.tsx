"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { ROUTES, ROUTE_BUILDERS } from "@/lib/constants/routes";
import { useAddToCart } from "@/hooks/use-cart-mutations";

interface QuickViewProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  basePrice: number;
  compareAtPrice: number | null;
  images: { url: string; altText: string | null }[];
  variants: {
    id: string;
    size: string;
    compressionLevel: string;
    price: number | null;
    stockQuantity: number;
    images: { url: string }[];
  }[];
}

interface ProductQuickViewDialogProps {
  product: QuickViewProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const compressionLabels: Record<string, string> = {
  LIGHT: "Light Sculpt",
  MEDIUM: "Medium Sculpt",
  HIGH: "Maximum Sculpt",
};

export function ProductQuickViewDialog({
  product,
  open,
  onOpenChange,
}: ProductQuickViewDialogProps) {
  const router = useRouter();
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const compressions = Array.from(
    new Set(product.variants.map((v) => v.compressionLevel)),
  );

  const firstInStock = product.variants.find((v) => v.stockQuantity > 0);
  const [selectedSize, setSelectedSize] = useState(
    firstInStock?.size || sizes[0] || "M",
  );
  const [selectedCompression, setSelectedCompression] = useState(
    firstInStock?.compressionLevel || compressions[0] || "MEDIUM",
  );

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.compressionLevel === selectedCompression,
  );

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity === 0;
  const price = selectedVariant?.price ?? product.basePrice;
  const imageUrl =
    selectedVariant?.images?.[0]?.url || product.images[0]?.url;

  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addToCartMutation.mutate(
      { variantId: selectedVariant.id, quantity: 1 },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add to cart");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick view - {product.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-4/5 w-full sm:w-2/5 shrink-0 overflow-hidden rounded-lg bg-card">
            <OptimizedImage
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <button
                type="button"
                className="font-heading text-lg font-semibold text-foreground hover:text-primary transition-colors text-left"
                onClick={() => {
                  onOpenChange(false);
                  router.push(ROUTE_BUILDERS.product(product.id, product.slug));
                }}
              >
                {product.name}
              </button>
              {product.shortDescription && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl text-foreground">
                ${Number(price).toFixed(2)}
              </span>
              {product.compareAtPrice && Number(product.compareAtPrice) > Number(price) && (
                <span className="text-sm text-muted-foreground line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Size
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-8 min-w-8 px-2 text-xs font-semibold border transition-colors ${
                        selectedSize === size
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Compression
                </label>
                <div className="mt-1 flex gap-1.5">
                  {compressions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedCompression(level)}
                      className={`flex-1 h-8 px-2 text-[11px] font-semibold uppercase tracking-wide border transition-colors ${
                        selectedCompression === level
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {compressionLabels[level] || level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCartMutation.isPending}
              className="mt-auto w-full gap-2"
            >
              {addToCartMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
