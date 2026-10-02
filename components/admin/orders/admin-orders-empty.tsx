"use client";

import { PackageX } from "lucide-react";

interface AdminOrdersEmptyProps {
  searchQuery?: string;
}

export function AdminOrdersEmpty({ searchQuery }: AdminOrdersEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-border/50 bg-muted/10">
      <div className="flex h-16 w-16 items-center justify-center border border-secondary/20 bg-secondary/5 mb-4">
        <PackageX className="h-8 w-8 text-secondary/60" />
      </div>
      <h3 className="font-[family-name:var(--font-bodoni-moda)] text-xl font-semibold text-foreground mb-2">
        No orders found
      </h3>
      <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground text-center max-w-sm">
        {searchQuery
          ? `No orders matching "${searchQuery}". Try adjusting your search or filters.`
          : "There are no orders to display at this time."}
      </p>
    </div>
  );
}
