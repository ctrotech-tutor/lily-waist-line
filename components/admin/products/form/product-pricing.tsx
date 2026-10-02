"use client";

import { DollarSign, Tag, Ruler } from "lucide-react";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductPricingProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | Record<string, string>) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export function ProductPricing({ data, onChange, errors, disabled }: ProductPricingProps) {
  const hasComparePrice = data.compareAtPrice && parseFloat(data.compareAtPrice) > 0;
  const discount = hasComparePrice
    ? Math.round(
        (1 - parseFloat(data.price) / parseFloat(data.compareAtPrice)) * 100
      )
    : 0;

  const handleVariantPriceChange = (size: string, value: string) => {
    const newPrices = { ...data.variantPrices, [size]: value };
    if (!value || value === data.price) {
      delete newPrices[size];
    }
    onChange("variantPrices", newPrices);
  };

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
          <div className="flex-1" data-invalid={!!errors?.price || undefined}>
            <Label htmlFor="price" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Base Price <span className="text-destructive">*</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                id="price"
                type="number"
                value={data.price}
                onChange={(e) => onChange("price", e.target.value)}
                placeholder="0.00"
                aria-invalid={!!errors?.price || undefined}
                data-invalid={!!errors?.price || undefined}
                disabled={disabled}
                className="border-border focus-visible:border-secondary focus-visible:ring-0"
              />
            </InputGroup>
            {errors?.price && (
              <p className="text-xs text-destructive mt-1">{errors.price}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Default price for all sizes. Override per size below.
            </p>
          </div>
        </div>

        {/* Compare At Price */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label htmlFor="compareAtPrice" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Compare At Price <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <InputGroup>
              <InputGroupInput
                id="compareAtPrice"
                type="number"
                value={data.compareAtPrice}
                onChange={(e) => onChange("compareAtPrice", e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="border-border focus-visible:border-secondary focus-visible:ring-0"
              />
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Per-Size Pricing */}
      {data.sizes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-sans text-sm font-medium text-foreground">
              Per-Size Pricing <span className="text-muted-foreground font-normal normal-case">(Optional)</span>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Set different prices per size. Leave blank to use the base price.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.sizes.map((size) => (
              <div key={size} className="flex items-center gap-2">
                <span className="font-sans text-sm font-semibold text-foreground min-w-8">
                  {size}
                </span>
                <InputGroup>
                  <InputGroupInput
                    id={`price-${size}`}
                    type="number"
                    value={data.variantPrices[size] || ""}
                    onChange={(e) => handleVariantPriceChange(size, e.target.value)}
                    placeholder={data.price || "0.00"}
                    disabled={disabled}
                    className={cn(
                      "border-border focus-visible:border-secondary focus-visible:ring-0",
                      data.variantPrices[size] && "border-secondary/50"
)}
                  />
                </InputGroup>
              </div>
            ))}
          </div>
        </div>
      )}

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
