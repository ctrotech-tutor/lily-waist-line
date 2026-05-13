import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyOrdersStateProps {
  className?: string;
  onStartShopping?: () => void;
}

export function EmptyOrdersState({ className, onStartShopping }: EmptyOrdersStateProps) {
  return (
    <Card className={cn("p-12 md:p-16", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon / Visual Element */}
        <div className="mb-8">
          <div className="w-20 h-20 border-2 border-[#d4af37]/20 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-[#d4af37]" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          You haven&apos;t placed any orders yet
        </h2>

        {/* Supporting Text */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
          Your order history will appear here once you make a purchase.
        </p>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={onStartShopping}
          className="w-full sm:w-auto px-8 py-3 text-sm font-button tracking-wide uppercase bg-[#d4af37] text-black hover:bg-[#d4af37]/90 transition-colors"
        >
          Start Shopping
        </Button>
      </div>
    </Card>
  );
}
