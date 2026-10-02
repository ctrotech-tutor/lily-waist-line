import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

interface EmptyCartProps {
  className?: string;
}

export function EmptyCart({ className }: EmptyCartProps) {
  const router = useRouter();

  return (
    <Card className={cn("p-12 md:p-16", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon / Visual Element */}
        <div className="mb-8">
          <div className="w-20 h-20 border-2 border-primary/20 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          Your cart is empty
        </h2>

        {/* Supporting Text */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
          Discover premium waist trainers designed for confidence and transformation.
        </p>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={() => router.push(ROUTES.SHOP)}
          className="w-full sm:w-auto px-8 text-sm font-button tracking-wide uppercase"
        >
          Start Shopping
        </Button>

        {/* Secondary Action */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(ROUTES.SHOP)}
          className="w-full sm:w-auto px-8 text-sm font-button tracking-wide uppercase mt-4"
        >
          Browse Collections
        </Button>
      </div>
    </Card>
  );
}
