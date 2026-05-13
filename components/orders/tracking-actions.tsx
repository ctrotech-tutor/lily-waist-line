"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";

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
  const [copied, setCopied] = useState(false);

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy tracking number:", err);
    }
  };

  return (
    <Card className={cn("p-6 border border-border bg-card sticky top-24", className)}>
      <h3 className="font-heading text-lg text-foreground mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        {/* Copy Tracking Number */}
        <Button
          variant="outline"
          className="w-full justify-between rounded-none border-border hover:border-[#d4af37] hover:text-[#d4af37]"
          onClick={handleCopyTracking}
        >
          <span className="font-sans">
            {copied ? "Copied!" : "Copy Tracking Number"}
          </span>
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>

        {/* Track on Carrier Site (Placeholder) */}
        <Button
          variant="outline"
          className="w-full justify-between rounded-none border-border hover:border-[#d4af37] hover:text-[#d4af37]"
          asChild
        >
          <Link href={carrierUrl} target="_blank" rel="noopener noreferrer">
            <span className="font-sans">Track On Carrier Site</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>

        <Separator className="my-4" />

        {/* Continue Shopping */}
        <Button
          className="w-full rounded-none bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
          asChild
        >
          <Link href="/shop">
            <ShoppingBag className="w-4 h-4 mr-2" />
            <span className="font-sans font-semibold">Continue Shopping</span>
          </Link>
        </Button>
      </div>

      {/* Trust Message */}
      <p className="font-sans text-xs text-muted-foreground text-center mt-4">
        Need help? Contact our support team
      </p>
    </Card>
  );
}
