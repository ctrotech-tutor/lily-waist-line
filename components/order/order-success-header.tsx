import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderSuccessHeaderProps {
  className?: string;
}

export function OrderSuccessHeader({
  className,
}: OrderSuccessHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-primary/30 bg-primary/10 rounded-lg">
          <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
      </div>
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
        Order Received
      </h1>
      <p className="font-sans text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
        Your order has been created successfully. Complete payment to begin processing.
      </p>
    </div>
  );
}