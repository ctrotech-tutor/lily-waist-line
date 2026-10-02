"use client";

import { PackageX } from "lucide-react";

export function AdminShippingEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-border/50 border-dashed">
      <div className="flex h-16 w-16 items-center justify-center border border-secondary/30 bg-secondary/5 mb-4">
        <PackageX className="h-8 w-8 text-secondary/60" />
      </div>
      <h3 className="font-[family-name:var(--font-bodoni-moda)] text-lg font-medium text-foreground mb-1">
        No shipments available
      </h3>
      <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground max-w-xs">
        There are no orders requiring shipping at this time.
      </p>
    </div>
  );
}
