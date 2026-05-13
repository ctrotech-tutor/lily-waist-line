"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

const filterGroups: FilterGroup[] = [
  {
    id: "size",
    title: "Size",
    options: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "XXL" },
    ],
  },
  {
    id: "compression",
    title: "Compression Level",
    options: [
      { value: "light", label: "Light Sculpt" },
      { value: "medium", label: "Medium Sculpt" },
      { value: "high", label: "High Sculpt" },
    ],
  },
  {
    id: "color",
    title: "Color",
    options: [
      { value: "black", label: "Black" },
      { value: "nude", label: "Nude" },
    ],
  },
  {
    id: "availability",
    title: "Availability",
    options: [
      { value: "in-stock", label: "In Stock" },
      { value: "sold-out", label: "Sold Out" },
    ],
  },
];

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 font-sans text-sm",
        "border transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-foreground border-border hover:border-[#d4af37]/50 hover:bg-card/50"
      )}
    >
      {selected && (
        <span className="absolute top-1 right-1 w-1 h-1 bg-[#d4af37]" />
      )}
      {label}
    </button>
  );
}

interface FilterSectionProps {
  group: FilterGroup;
  selectedValues: string[];
  onToggle: (groupId: string, value: string) => void;
}

function FilterSection({ group, selectedValues, onToggle }: FilterSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h3>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={selectedValues.includes(option.value)}
            onClick={() => onToggle(group.id, option.value)}
          />
        ))}
      </div>
    </div>
  );
}

export interface ShopFiltersProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  className?: string;
  searchParams?: ShopSearchParams;
}

export function ShopFilters({ onFiltersChange, className, searchParams }: ShopFiltersProps) {
  const { updateParams, clearFilters } = useShopURLSync();
  
  // Convert URL params to filter format
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    size: searchParams?.size ? [searchParams.size] : [],
    compression: searchParams?.compression ? [searchParams.compression] : [],
    color: [],
    availability: [],
  });
  
  // Use ref to track previous searchParams to avoid cascading renders
  const prevSearchParamsRef = useRef(searchParams);
  
  // Update local state when URL params change
  useEffect(() => {
    // Check if searchParams actually changed
    if (prevSearchParamsRef.current?.size === searchParams?.size &&
        prevSearchParamsRef.current?.compression === searchParams?.compression) {
      return;
    }
    prevSearchParamsRef.current = searchParams;
    
    // Use microtask to avoid synchronous setState in effect body
    queueMicrotask(() => {
      setSelectedFilters({
        size: searchParams?.size ? [searchParams.size] : [],
        compression: searchParams?.compression ? [searchParams.compression] : [],
        color: [],
        availability: [],
      });
    });
  }, [searchParams]);

  const handleToggle = (groupId: string, value: string) => {
    // For size and compression filters, update URL directly
    if (groupId === 'size') {
      const currentSize = selectedFilters.size?.[0];
      const newSize = currentSize === value ? undefined : value;
      updateParams({ size: newSize });
    } else if (groupId === 'compression') {
      const currentCompression = selectedFilters.compression?.[0];
      const newCompression = currentCompression === value ? undefined : value;
      updateParams({ compression: newCompression });
    } else {
      // For other filters, update local state (for future use)
      setSelectedFilters((prev) => {
        const current = prev[groupId] || [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];

        const newFilters = { ...prev, [groupId]: updated };
        onFiltersChange?.(newFilters);
        return newFilters;
      });
    }
  };

  const handleReset = () => {
    // Clear URL filters
    clearFilters();
    
    // Reset local state for non-URL filters
    const resetFilters = {
      size: [],
      compression: [],
      color: [],
      availability: [],
    };
    setSelectedFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (values) => values.length > 0
  );

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#d4af37]" />
          <span className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="font-sans text-xs text-[#d4af37] ml-1">
              ({activeFilterCount})
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-2"
          >
            Reset
          </button>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* Filter Groups */}
      <div className="space-y-6">
        {filterGroups.map((group, index) => (
          <div key={group.id}>
            <FilterSection
              group={group}
              selectedValues={selectedFilters[group.id] || []}
              onToggle={handleToggle}
            />
            {index < filterGroups.length - 1 && (
              <Separator className="mt-6 bg-border/30" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopFilters;
