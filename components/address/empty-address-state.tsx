"use client";

import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyAddressStateProps {
  className?: string;
  onAddAddress?: () => void;
}

export function EmptyAddressState({ className, onAddAddress }: EmptyAddressStateProps) {
  return (
    <Card className={cn("p-12 md:p-16 border-dashed border-2 border-border/50", className)}>
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        {/* Icon / Visual Element */}
        <div className="mb-8">
          <div className="w-20 h-20 border border-primary/30 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
          No saved addresses
        </h2>

        {/* Supporting Text */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-sm">
          Add a delivery address to streamline your checkout experience and receive your transformation essentials.
        </p>

        {/* Primary CTA */}
        <Button
          onClick={onAddAddress}
          size="lg"
          className="w-full sm:w-auto px-8 py-3 text-sm font-button tracking-wide uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Add Address
        </Button>
      </div>
    </Card>
  );
}
