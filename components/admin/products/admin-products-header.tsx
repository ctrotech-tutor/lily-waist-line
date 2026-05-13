"use client";

import { ShoppingBag } from "lucide-react";

export function AdminProductsHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/5">
          <ShoppingBag className="h-5 w-5 text-[#d4af37]" />
        </div>
        <h1 className="font-[family-name:var(--font-bodoni)] text-3xl font-semibold tracking-tight text-foreground">
          Products
        </h1>
      </div>
      <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
        Manage your waist trainer catalog, pricing, and availability.
      </p>
    </div>
  );
}
