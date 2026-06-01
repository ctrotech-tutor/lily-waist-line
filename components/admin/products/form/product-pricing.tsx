"use client";

import { cn } from "@/lib/utils";
import { DollarSign, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductPricingProps {
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
  prefix?: string;
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
  prefix,
}: FloatingFieldProps) {
  return (
    <div className="relative w-full group">
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-0 text-muted-foreground text-sm">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          name={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || " "}
          className={cn(
            "peer w-full border-0 border-b border-border bg-transparent py-3 rounded-none h-auto",
            prefix ? "pl-6" : "px-0",
            "text-sm",
            "focus-visible:border-secondary focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder-transparent transition-colors",
            "text-foreground",
            error && "border-destructive focus-visible:border-destructive"
          )}
        />
      </div>
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-0 top-3 -translate-y-6 text-xs text-muted-foreground uppercase tracking-widest transition-all",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/70",
          "peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-widest",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          prefix && "peer-placeholder-shown:left-6 peer-focus:left-0",
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

export function ProductPricing({ data, onChange, errors }: ProductPricingProps) {
  const hasComparePrice = data.compareAtPrice && parseFloat(data.compareAtPrice) > 0;
  const discount = hasComparePrice
    ? Math.round(
        (1 - parseFloat(data.price) / parseFloat(data.compareAtPrice)) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Pricing
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Price */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <FloatingField
              id="price"
              label="Price"
              type="number"
              required
              value={data.price}
              onChange={(value) => onChange("price", value)}
              error={errors?.price}
              prefix="$"
            />
          </div>
        </div>

        {/* Compare At Price */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <FloatingField
              id="compareAtPrice"
              label="Compare At Price (Optional)"
              type="number"
              value={data.compareAtPrice}
              onChange={(value) => onChange("compareAtPrice", value)}
              prefix="$"
            />
          </div>
        </div>
      </div>

      {/* Discount Preview */}
      {hasComparePrice && discount > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Customer saves:</span>
          <span className="text-secondary font-semibold">{discount}% off</span>
        </div>
      )}
    </div>
  );
}
