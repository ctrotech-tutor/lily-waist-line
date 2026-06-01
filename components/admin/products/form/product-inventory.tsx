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
}

// Form field with floating label pattern
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
}

function FloatingField({
  id,
  label,
  type = "text",
  required = false,
  value,
  placeholder,
  onChange,
  error,
}: FloatingFieldProps) {
  return (
    <div className="relative w-full group">
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || " "}
        className={cn(
          "peer w-full border-0 border-b border-border bg-transparent py-3 px-0 rounded-none h-auto text-sm",
          "focus-visible:border-secondary focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder-transparent transition-colors",
          "text-foreground",
          error && "border-destructive focus-visible:border-destructive"
        )}
      />
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-0 top-3 -translate-y-6 text-xs text-muted-foreground uppercase tracking-widest transition-all",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/70",
          "peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-widest",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          "cursor-text font-sans font-semibold pointer-events-none"
        )}
      >
        {label}
      </Label>
      {/* Bottom border highlight on focus */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 peer-focus:w-full" />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

// Stock status badge component
function StockStatusBadge({ status }: { status: string }) {
  const configs = {
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

  const config = configs[status as keyof typeof configs] || configs.in_stock;
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

export function ProductInventory({ data, onChange }: ProductInventoryProps) {
  const quantity = parseInt(data.stockQuantity) || 0;

  // Compute stock status based on quantity
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
            <FloatingField
              id="stockQuantity"
              label="Stock Quantity"
              type="number"
              value={data.stockQuantity}
              onChange={(value) => onChange("stockQuantity", value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Computed Stock Status */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label className="block text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
              Stock Status (Computed)
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
