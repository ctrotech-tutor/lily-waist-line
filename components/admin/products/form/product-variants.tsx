"use client";

import { cn } from "@/lib/utils";
import { Layers, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductVariantsProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string[]) => void;
  errors?: Record<string, string>;
}

const SIZE_OPTIONS = [
  { value: "XS", label: "XS", description: "Extra Small" },
  { value: "S", label: "S", description: "Small" },
  { value: "M", label: "M", description: "Medium" },
  { value: "L", label: "L", description: "Large" },
  { value: "XL", label: "XL", description: "Extra Large" },
];

const COMPRESSION_OPTIONS = [
  { value: "light", label: "Light", description: "Gentle support for everyday wear" },
  { value: "medium", label: "Medium", description: "Moderate compression for workouts" },
  { value: "high", label: "High", description: "Maximum sculpting and support" },
];

export function ProductVariants({ data, onChange, errors }: ProductVariantsProps) {
  const toggleSize = (size: string) => {
    const currentSizes = data.sizes;
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onChange("sizes", newSizes);
  };

  const toggleCompression = (level: string) => {
    const currentLevels = data.compressionLevels;
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level];
    onChange("compressionLevels", newLevels);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Variants
        </h2>
      </div>

      {/* Size Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-sans text-sm font-medium text-foreground">
            Size Options
            <span className="text-destructive ml-1">*</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SIZE_OPTIONS.map((size) => (
            <label
              key={size.value}
              className={cn(
                "flex flex-col items-center gap-2 p-4 border cursor-pointer transition-all duration-200",
                data.sizes.includes(size.value)
                  ? "border-[#d4af37] bg-[#d4af37]/5"
                  : "border-border hover:border-[#d4af37]/50 hover:bg-muted/50"
              )}
            >
              <Checkbox
                checked={data.sizes.includes(size.value)}
                onCheckedChange={() => toggleSize(size.value)}
                className="sr-only"
              />
              <span className="font-sans text-lg font-semibold text-foreground">
                {size.label}
              </span>
              <span className="font-sans text-xs text-muted-foreground">
                {size.description}
              </span>
            </label>
          ))}
        </div>

        {errors?.sizes && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {errors.sizes}
          </div>
        )}
      </div>

      {/* Compression Level Options */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-sans text-sm font-medium text-foreground">
            Compression Level
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COMPRESSION_OPTIONS.map((level) => (
            <label
              key={level.value}
              className={cn(
                "flex flex-col gap-2 p-4 border cursor-pointer transition-all duration-200",
                data.compressionLevels.includes(level.value)
                  ? "border-[#d4af37] bg-[#d4af37]/5"
                  : "border-border hover:border-[#d4af37]/50 hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={data.compressionLevels.includes(level.value)}
                  onCheckedChange={() => toggleCompression(level.value)}
                  className={cn(
                    "border-border data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37] data-[state=checked]:text-black"
                  )}
                />
                <span className="font-sans text-sm font-semibold text-foreground">
                  {level.label}
                </span>
              </div>
              <span className="font-sans text-xs text-muted-foreground pl-7">
                {level.description}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
