"use client";

import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export interface EmptyOrdersStateProps {
  className?: string;
  onStartShopping?: () => void;
}

export function EmptyOrdersState({ className, onStartShopping }: EmptyOrdersStateProps) {
  const router = useRouter();

  const handleShop = onStartShopping || (() => router.push(ROUTES.SHOP));

  return (
    <Card className={cn("p-12 md:p-16 border-border rounded-lg", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-20 h-20 border-2 border-primary/20 flex items-center justify-center rounded-lg">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
          You haven&apos;t placed any orders yet
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
          Your order history will appear here once you make a purchase.
        </p>
        <Button
          size="lg"
          onClick={handleShop}
          className="w-full sm:w-auto px-8 py-3 text-sm font-button tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
        >
          Start Shopping
        </Button>
      </div>
    </Card>
  );
}