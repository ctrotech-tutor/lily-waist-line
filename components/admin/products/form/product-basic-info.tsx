"use client";

import { Type, AlignLeft, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductBasicInfoProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | string[]) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export function ProductBasicInfo({ data, onChange, errors, disabled }: ProductBasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Basic Information
        </h2>
      </div>

      <div className="space-y-6">
        {/* Product Name */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <Type className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1" data-invalid={!!errors?.name || undefined}>
            <Label htmlFor="productName" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="productName"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. Classic Waist Trainer"
              aria-invalid={!!errors?.name || undefined}
              data-invalid={!!errors?.name || undefined}
              disabled={disabled}
              className="border-border focus-visible:border-secondary focus-visible:ring-0"
            />
            {errors?.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <AlignLeft className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label htmlFor="shortDescription" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Short Description
            </Label>
            <Input
              id="shortDescription"
              value={data.shortDescription}
              onChange={(e) => onChange("shortDescription", e.target.value)}
              placeholder="Brief tagline for product cards"
              disabled={disabled}
              className="border-border focus-visible:border-secondary focus-visible:ring-0"
            />
            <p className="text-xs text-muted-foreground mt-2">
              A short description that appears on product cards and listings.
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <Label htmlFor="fullDescription" className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground mb-2 block">
              Full Description
            </Label>
            <Textarea
              id="fullDescription"
              value={data.fullDescription}
              onChange={(e) => onChange("fullDescription", e.target.value)}
              placeholder="Detailed product description with benefits and features"
              rows={6}
              disabled={disabled}
              className="border-border focus-visible:border-secondary focus-visible:ring-0 resize-y min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Comprehensive description displayed on the product detail page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
