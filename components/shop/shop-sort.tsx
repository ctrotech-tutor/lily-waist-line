"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function ShopSort({ defaultValue = "featured", onSortChange, className, searchParams }: ShopSortProps) {
  const { updateParams } = useShopURLSync();
  const [selectedSort, setSelectedSort] = useState<SortOption>(() => {
    if (searchParams?.sort) {
      return urlToSortMap[searchParams.sort] || defaultValue;
    }
    return defaultValue;
  });
  const [open, setOpen] = useState(false);
  
  const prevSortRef = useRef(searchParams?.sort);
  
  // Update selected sort when URL params change
  useEffect(() => {
    // Check if sort actually changed
    if (prevSortRef.current === searchParams?.sort) return;
    prevSortRef.current = searchParams?.sort;
    
    // Use microtask to avoid synchronous setState in effect body
    queueMicrotask(() => {
      if (searchParams?.sort) {
        const sortValue = urlToSortMap[searchParams.sort];
        if (sortValue) {
          setSelectedSort(sortValue);
        }
      } else {
        setSelectedSort(defaultValue);
      }
    });
  }, [searchParams?.sort, defaultValue]);

  const handleChange = (value: string) => {
    const sortValue = value as SortOption;
    setSelectedSort(sortValue);
    
    // Update URL
    const urlSortValue = sortToUrlMap[sortValue];
    updateParams({ sort: urlSortValue });
    
    onSortChange?.(sortValue);
  };

  const currentLabel = sortOptions.find((opt) => opt.value === selectedSort)?.label || "Sort";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Label */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
        <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sort by
        </span>
      </div>

      {/* Custom Select Trigger */}
      <Select value={selectedSort} onValueChange={handleChange} open={open} onOpenChange={setOpen}>
        <SelectTrigger
          className={cn(
            "w-fit min-w-40 px-4 py-2",
            "bg-transparent border-border",
            "font-sans text-sm text-foreground",
            "focus:ring-2 focus:ring-ring focus:ring-offset-0",
            "hover:border-[#d4af37]/50 transition-colors duration-200",
            "data-[state=open]:border-[#d4af37]/50",
            "[&>svg]:text-[#d4af37]"
          )}
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by">
              <span className="font-sans text-sm">{currentLabel}</span>
            </SelectValue>
          </div>
        </SelectTrigger>

        {/* Premium Dropdown Content */}
        <SelectContent
          className={cn(
            "min-w-52 p-0",
            "bg-popover border-border",
            "shadow-lg"
          )}
          position="popper"
          align="end"
          sideOffset={4}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/50">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sort Options
            </span>
          </div>

          {/* Sort Options */}
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
                  "transition-colors duration-150",
                  "outline-none"
                )}
              >
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                  )}
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

// Alternative inline version for compact spaces
export interface ShopSortInlineProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function ShopSortInline({ value, onChange, className }: ShopSortInlineProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 font-sans text-xs",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-card"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ShopSort;
