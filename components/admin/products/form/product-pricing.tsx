"use client";

import { cn } from "@/lib/utils";
import { DollarSign, Tag } from "lucide-react";
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
          <span className="absolute left-0 text-muted-foreground text-[14px] md:text-[15px]">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || " "}
          className={cn(
            "peer w-full border-0 border-b border-border bg-transparent py-3 rounded-none",
            prefix ? "pl-6" : "px-0",
            "text-[14px] md:text-[15px]",
            "focus:border-[#d4af37] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none",
            "placeholder-transparent transition-colors",
            "text-foreground",
            error && "border-destructive focus:border-destructive"
          )}
        />
      </div>
      <label
        htmlFor={id}
        className={cn(
          "absolute left-0 top-3 -translate-y-6 text-[10px] md:text-[11px] text-muted-foreground uppercase tracking-[0.15em] transition-all",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[14px] md:peer-placeholder-shown:text-[15px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/70",
          "peer-focus:-translate-y-6 peer-focus:text-[10px] md:peer-focus:text-[11px] peer-focus:text-[#d4af37] peer-focus:uppercase peer-focus:tracking-[0.15em]",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          prefix && "peer-placeholder-shown:left-6 peer-focus:left-0",
          "cursor-text font-sans font-semibold pointer-events-none"
        )}
      >
        {label}
      </label>
      {/* Bottom border highlight on focus */}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37] transition-all duration-300 peer-focus:w-full" />
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
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
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
          <span className="text-[#d4af37] font-semibold">{discount}% off</span>
        </div>
      )}
    </div>
  );
}
