"use client";

import { Users } from "lucide-react";

export function AdminCustomersEmpty() {
  return (
    <div className="flex flex-col items-center justify-center border border-border/50 py-16 px-4">
      <div className="flex h-16 w-16 items-center justify-center border border-border/50 bg-muted/30 mb-4">
        <Users className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="font-[family-name:var(--font-bodoni-moda)] text-xl font-semibold text-foreground">
        No customers found yet
      </h3>
      <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground mt-2 text-center max-w-sm">
        Customer data will appear here once orders start coming in.
      </p>
    </div>
  );
}
