"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";

export type SortOption =
  | "featured"
  | "best-selling"
  | "new-arrivals"
  | "price-low"
  | "price-high";

interface SortConfig {
  value: SortOption;
  label: string;
}

const sortOptions: SortConfig[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

// Map URL sort values to component sort options
const urlToSortMap: Record<string, SortOption> = {
  featured: "featured",
  newest: "new-arrivals",
  price_asc: "price-low",
  price_desc: "price-high",
};

const sortToUrlMap: Record<SortOption, string> = {
  featured: "featured",
  "new-arrivals": "newest",
  "price-low": "price_asc",
  "price-high": "price_desc",
  "best-selling": "best-selling",
};

export interface ShopSortProps {
  defaultValue?: SortOption;
  onSortChange?: (value: SortOption) => void;
  className?: string;
  searchParams?: ShopSearchParams;
}

export const ShopSort = memo(function ShopSort({
  defaultValue = "featured",
  onSortChange,
  className,
  searchParams,
}: ShopSortProps) {
  const { updateParams } = useShopURLSync();

  // Derive selected sort directly from URL params
  const selectedSort: SortOption = searchParams?.sort
    ? urlToSortMap[searchParams.sort] || defaultValue
    : defaultValue;

  const handleChange = (value: string) => {
    const sortValue = value as SortOption;
    const urlSortValue = sortToUrlMap[sortValue];
    updateParams({ sort: urlSortValue });
    onSortChange?.(sortValue);
  };

  const currentLabel =
    sortOptions.find((opt) => opt.value === selectedSort)?.label || "Sort";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Label */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort by
        </span>
      </div>

      {/* Select */}
      <Select
        value={selectedSort}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className={cn(
            "w-fit min-w-40 px-4 py-2",
            "bg-transparent border border-border",
            "font-sans text-sm text-foreground",
            "hover:border-primary/50 transition-colors duration-200",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",
            "data-[state=open]:border-primary/50",
            "[&>svg]:text-primary",
            "rounded-full"
          )}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by">
              <span className="font-sans text-sm">{currentLabel}</span>
            </SelectValue>
          </div>
        </SelectTrigger>

        {/* Dropdown */}
        <SelectContent
          className={cn(
            "min-w-52 p-0",
            "bg-popover border border-border",
            "shadow-lg",
            "rounded-2xl overflow-hidden"
          )}
          position="popper"
          align="end"
          sideOffset={6}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sort Options
            </span>
          </div>

          {/* Items */}
          <div className="py-1">
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={cn(
                  "px-4 py-3 font-sans text-sm",
                  "cursor-pointer",
                  "focus:bg-accent focus:text-accent-foreground",
                  "data-[state=checked]:bg-primary/5",
                  "transition-all duration-150",
                  "outline-none",
                  "rounded-md mx-1"
                )}
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
});

/* ================= INLINE VERSION ================= */

export interface ShopSortInlineProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function ShopSortInline({
  value,
  onChange,
  className,
}: ShopSortInlineProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant={value === option.value ? "default" : "ghost"}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 h-auto text-xs font-sans",
            "rounded-full transition-all duration-200",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export default ShopSort;