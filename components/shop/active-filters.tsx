"use client";

import { memo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";

interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
}

function ActiveFilterChip({ label, onRemove }: ActiveFilterChipProps) {
  return (
    <button
      onClick={onRemove}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5",
        "rounded-full",
        "text-xs font-medium",
        "bg-primary/10 text-primary",
        "border border-primary/20",
        "hover:bg-primary/20",
        "transition-colors"
      )}
    >
      {label}
      <X className="w-3 h-3" />
    </button>
  );
}

export interface ActiveFiltersProps {
  searchParams?: ShopSearchParams;
  className?: string;
}

export const ActiveFilters = memo(function ActiveFilters({
  searchParams,
  className,
}: ActiveFiltersProps) {
  const { updateParams, clearFilters } = useShopURLSync();

  const activeFilters: Array<{ key: string; label: string; value: string }> = [];

  // Search filter
  if (searchParams?.q) {
    activeFilters.push({
      key: "q",
      label: `Search: "${searchParams.q}"`,
      value: searchParams.q,
    });
  }

  // Size filter
  if (searchParams?.size) {
    const sizeLabels: Record<string, string> = {
      xs: "XS",
      s: "S",
      m: "M",
      l: "L",
      xl: "XL",
      xxl: "XXL",
    };
    activeFilters.push({
      key: "size",
      label: `Size: ${sizeLabels[searchParams.size] || searchParams.size}`,
      value: searchParams.size,
    });
  }

  // Compression filter
  if (searchParams?.compression) {
    const compressionLabels: Record<string, string> = {
      light: "Light",
      medium: "Medium",
      high: "High",
    };
    activeFilters.push({
      key: "compression",
      label: `Compression: ${compressionLabels[searchParams.compression] || searchParams.compression}`,
      value: searchParams.compression,
    });
  }

  // Availability filter
  if (searchParams?.availability) {
    const availabilityLabels: Record<string, string> = {
      "in-stock": "In Stock",
      "low-stock": "Low Stock",
      "out-of-stock": "Out of Stock",
    };
    activeFilters.push({
      key: "availability",
      label: `Stock: ${availabilityLabels[searchParams.availability] || searchParams.availability}`,
      value: searchParams.availability,
    });
  }

  // Sort filter
  if (searchParams?.sort) {
    const sortLabels: Record<string, string> = {
      featured: "Featured",
      newest: "Newest",
      price_asc: "Price: Low to High",
      price_desc: "Price: High to Low",
    };
    activeFilters.push({
      key: "sort",
      label: `Sort: ${sortLabels[searchParams.sort] || searchParams.sort}`,
      value: searchParams.sort,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (key: string) => {
    if (key === "q") {
      updateParams({ q: undefined });
    } else if (key === "size") {
      updateParams({ size: undefined });
    } else if (key === "compression") {
      updateParams({ compression: undefined });
    } else if (key === "availability") {
      updateParams({ availability: undefined });
    } else if (key === "sort") {
      updateParams({ sort: undefined });
    }
  };

  const handleClearAll = () => {
    clearFilters();
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeFilters.map((filter) => (
        <ActiveFilterChip
          key={filter.key}
          label={filter.label}
          onRemove={() => handleRemoveFilter(filter.key)}
        />
      ))}
      <button
        onClick={handleClearAll}
        className={cn(
          "text-xs font-medium text-muted-foreground hover:text-foreground",
          "transition-colors"
        )}
      >
        Clear all
      </button>
    </div>
  );
});

export default ActiveFilters;