import Link from "next/link";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyWishlistProps {
  className?: string;
}

export function EmptyWishlistState({ className }: EmptyWishlistProps) {
  return (
    <Card className={cn("p-12 md:p-16", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon / Visual Element */}
        <div className="mb-8">
          <div className="w-20 h-20 border-2 border-[#d4af37]/20 flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#d4af37]" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          Your wishlist is empty
        </h2>

        {/* Supporting Text */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
          Your saved favorites will appear here.
        </p>

        {/* Primary CTA */}
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-sm font-button tracking-wide uppercase bg-[#d4af37] text-black hover:bg-[#d4af37]/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </Card>
  );
}
