"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
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

interface MobileFilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function MobileFilterChip({ label, selected, onClick }: MobileFilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 font-sans text-sm",
        "border transition-all duration-200 ease-out",
        "active:scale-[0.98]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-foreground border-border hover:border-[#d4af37]/50"
      )}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#d4af37]" />
      )}
      {label}
    </button>
  );
}

interface MobileFilterSectionProps {
  group: FilterGroup;
  selectedValues: string[];
  onToggle: (groupId: string, value: string) => void;
}

function MobileFilterSection({ group, selectedValues, onToggle }: MobileFilterSectionProps) {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
        <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h3>
      </div>

      {/* Filter Chips - Larger for mobile touch */}
      <div className="flex flex-wrap gap-3">
        {group.options.map((option) => (
          <MobileFilterChip
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

export interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  searchParams?: ShopSearchParams;
}

export function MobileFilterDrawer({
  open,
  onOpenChange,
  onFiltersChange,
  searchParams,
}: MobileFilterDrawerProps) {
  const { updateParams, clearFilters } = useShopURLSync();
  
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
    setSelectedFilters((prev) => {
      const current = prev[groupId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [groupId]: updated };
    });
  };

  const handleApply = () => {
    // Apply filters to URL
    const sizeFilter = selectedFilters.size?.[0];
    const compressionFilter = selectedFilters.compression?.[0];
    
    updateParams({
      size: sizeFilter,
      compression: compressionFilter,
    });
    
    onFiltersChange?.(selectedFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = {
      size: [],
      compression: [],
      color: [],
      availability: [],
    };
    setSelectedFilters(resetFilters);
    clearFilters();
    onFiltersChange?.(resetFilters);
  };

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-sm flex flex-col">
        {/* Header */}
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#d4af37]/30 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div>
                <SheetTitle className="font-heading text-xl">
                  Filters
                </SheetTitle>
                {activeFilterCount > 0 && (
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {activeFilterCount} selected
                  </p>
                )}
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon-sm" className="shrink-0">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <Separator className="bg-border/50" />

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 px-4 -mx-4">
          <div className="space-y-6">
            {filterGroups.map((group, index) => (
              <div key={group.id}>
                <MobileFilterSection
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

        <Separator className="bg-border/50" />

        {/* Footer Actions */}
        <SheetFooter className="flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className={cn(
              "flex-1 font-sans text-sm font-semibold uppercase tracking-wider",
              "border-border hover:border-[#d4af37]/50"
            )}
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className={cn(
              "flex-1 font-sans text-sm font-semibold uppercase tracking-wider",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export interface MobileFilterTriggerProps {
  onClick: () => void;
  activeFilterCount?: number;
}

export function MobileFilterTrigger({ onClick, activeFilterCount = 0 }: MobileFilterTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3",
        "bg-foreground text-background",
        "font-sans text-sm font-semibold uppercase tracking-wider",
        "shadow-lg transition-all duration-200",
        "hover:bg-foreground/90 active:scale-[0.98]"
      )}
    >
      <span>Filters</span>
      {activeFilterCount > 0 ? (
        <span className="w-5 h-5 bg-[#d4af37] text-black text-xs font-semibold flex items-center justify-center">
          {activeFilterCount}
        </span>
      ) : (
        <div className="w-1.5 h-1.5 bg-[#d4af37]" />
      )}
    </button>
  );
}

export default MobileFilterDrawer;
