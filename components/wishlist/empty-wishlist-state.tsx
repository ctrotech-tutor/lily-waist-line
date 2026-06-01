import Link from "next/link";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface EmptyWishlistProps {
  className?: string;
}

export function EmptyWishlistState({ className }: EmptyWishlistProps) {
  return (
    <Card className={cn("p-12 md:p-16", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon / Visual Element */}
        <div className="mb-8">
          <div className="w-20 h-20 border-2 border-primary/20 flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
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
        <Button asChild size="lg" className="px-8 text-sm font-button tracking-wide uppercase">
          <Link href={ROUTES.SHOP}>
            Continue Shopping
          </Link>
        </Button>
      </div>
    </Card>
  );
}
