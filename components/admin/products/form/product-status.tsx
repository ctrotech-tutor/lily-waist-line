"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Archive } from "lucide-react";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductStatusProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

const STATUS_OPTIONS = [
  {
    value: "draft",
    label: "Draft",
    description: "Product is not visible in the storefront",
    icon: EyeOff,
    color: "text-muted-foreground",
    borderColor: "border-muted-foreground/50",
    bgColor: "bg-muted",
  },
  {
    value: "active",
    label: "Active",
    description: "Product is visible and available for purchase",
    icon: Eye,
    color: "text-green-500",
    borderColor: "border-green-500/50",
    bgColor: "bg-green-500/10",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Product is hidden and not available for purchase",
    icon: Archive,
    color: "text-amber-500",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/10",
  },
];

export function ProductStatus({ data, onChange }: ProductStatusProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Product Status
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const Icon = status.icon;
          const isSelected = data.status === status.value;

          return (
            <label
              key={status.value}
              className={cn(
                "flex flex-col gap-3 p-4 border cursor-pointer transition-all duration-200",
                isSelected
                  ? `border-[#d4af37] ${status.bgColor}`
                  : "border-border hover:border-[#d4af37]/50 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center border",
                    isSelected
                      ? `border-[#d4af37] ${status.bgColor}`
                      : "border-border bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isSelected ? status.color : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="productStatus"
                      value={status.value}
                      checked={isSelected}
                      onChange={() => onChange("status", status.value)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "font-sans text-sm font-semibold",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {status.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 bg-[#d4af37]" />
                    )}
                  </div>
                </div>
              </div>
              <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                {status.description}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}
