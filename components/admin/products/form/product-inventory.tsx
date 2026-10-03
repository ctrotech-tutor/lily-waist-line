"use client";

import { cn } from "@/lib/utils";
import { Package, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductInventoryProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

function StockStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { icon: typeof CheckCircle2; label: string; className: string }> = {
    in_stock: {
      icon: CheckCircle2,
      label: "In Stock",
      className: "text-success bg-success/10 border-success/30",
    },
    low_stock: {
      icon: AlertCircle,
      label: "Low Stock",
      className: "text-warning bg-warning/10 border-warning/30",
    },
    out_of_stock: {
      icon: XCircle,
      label: "Out of Stock",
      className: "text-destructive bg-destructive/10 border-destructive/30",
    },
  };

  const config = configs[status] || configs.in_stock;
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 border text-xs font-medium",
      config.className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}

export function ProductInventory({ data, onChange, disabled }: ProductInventoryProps) {
  const quantity = parseInt(data.stockQuantity) || 0;

  const computedStatus = quantity === 0
    ? "out_of_stock"
    : quantity <= 5
      ? "low_stock"
      : "in_stock";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Inventory
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Stock Quantity */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label htmlFor="stockQuantity" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Total Available Units
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              value={data.stockQuantity}
              onChange={(e) => onChange("stockQuantity", e.target.value)}
              placeholder="0"
              disabled={disabled}
              className="border-border focus-visible:border-secondary focus-visible:ring-0"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Total available units across the product’s size and compression variants. A changed total is distributed evenly.
            </p>
          </div>
        </div>

        {/* Computed Stock Status */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label className="block text-xs font-semibold uppercase tracking-widest text-foreground mb-3">
              Stock Status <span className="text-muted-foreground font-normal normal-case tracking-normal">(Computed)</span>
            </Label>
            <StockStatusBadge status={computedStatus} />
            <p className="text-xs text-muted-foreground mt-2">
              Status updates automatically based on quantity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
