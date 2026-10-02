"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, ShoppingBag, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

export interface TrackingActionsProps {
  trackingNumber: string;
  carrierUrl?: string;
  className?: string;
}

export function TrackingActions({
  trackingNumber,
  carrierUrl = "#",
  className,
}: TrackingActionsProps) {
  const router = useRouter();

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      toast.success("Tracking number copied");
    } catch {
      // silently fail
    }
  };

  return (
    <Card className={cn("p-6 border border-border bg-card sticky top-24 rounded-lg", className)}>
      <h3 className="font-heading text-lg text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-between border-border hover:border-primary hover:text-primary rounded-lg"
          onClick={handleCopyTracking}
        >
          <span className="font-sans">Copy Tracking Number</span>
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between border-border hover:border-primary hover:text-primary rounded-lg"
          onClick={() => window.open(carrierUrl, "_blank", "noopener,noreferrer")}
        >
          <span className="font-sans">Track On Carrier Site</span>
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Separator className="my-4" />
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
          onClick={() => router.push(ROUTES.SHOP)}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          <span className="font-sans font-semibold">Continue Shopping</span>
        </Button>
      </div>
      <p className="font-sans text-xs text-muted-foreground text-center mt-4">
        Need help? Contact our support team
      </p>
    </Card>
  );
}