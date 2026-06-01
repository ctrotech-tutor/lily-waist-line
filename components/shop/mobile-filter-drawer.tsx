"use client";

import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";

/* ================= DATA ================= */

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
    id: "availability",
    title: "Availability",
    options: [
      { value: "in-stock", label: "In Stock" },
      { value: "low-stock", label: "Low Stock" },
      { value: "out-of-stock", label: "Out of Stock" },
    ],
  },
];

/* ================= CHIP ================= */

function MobileFilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-3",
        "rounded-full",
        "text-sm font-sans",
        "border transition-all duration-200",
        "active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent border-border hover:border-primary/50"
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
      {label}
    </button>
  );
}

/* ================= SECTION ================= */

function MobileFilterSection({
  group,
  selectedValues,
  onToggle,
}: {
  group: FilterGroup;
  selectedValues: string[];
  onToggle: (groupId: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.title}
        </h3>
      </div>

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

/* ================= MAIN ================= */

export interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  searchParams?: ShopSearchParams;
}

export const MobileFilterDrawer = memo(function MobileFilterDrawer({
  open,
  onOpenChange,
  onFiltersChange,
  searchParams,
}: MobileFilterDrawerProps) {
  const { updateParams, clearFilters } = useShopURLSync();

  // Temporary state for drawer (applied on "Apply" button)
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>({
    size: searchParams?.size ? [searchParams.size] : [],
    compression: searchParams?.compression ? [searchParams.compression] : [],
    availability: searchParams?.availability ? [searchParams.availability] : [],
  });

  // Reset temp filters when drawer opens
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => {
        setTempFilters({
          size: searchParams?.size ? [searchParams.size] : [],
          compression: searchParams?.compression ? [searchParams.compression] : [],
          availability: searchParams?.availability ? [searchParams.availability] : [],
        });
      }, 0);
      return () => clearTimeout(id);
    }
  }, [open, searchParams]);

  const handleToggle = (groupId: string, value: string) => {
    setTempFilters((prev: Record<string, string[]>) => {
      const current = prev[groupId] || [];
      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return { ...prev, [groupId]: updated };
    });
  };

  const handleApply = () => {
    updateParams({
      size: tempFilters.size?.[0],
      compression: tempFilters.compression?.[0],
      availability: tempFilters.availability?.[0],
    });

    onFiltersChange?.(tempFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const reset = {
      size: [],
      compression: [],
      availability: [],
    };

    setTempFilters(reset);
    clearFilters();
    onFiltersChange?.(reset);
  };

  const activeCount = Object.values(tempFilters).reduce(
    (a: number, b: string[]) => a + b.length,
    0
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-2xl">
        {/* REQUIRED TITLE (fixes Radix error) */}
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-primary/30 rounded-full flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>

            <div>
              <DrawerTitle className="text-xl font-semibold">
                Filters
              </DrawerTitle>

              {activeCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {activeCount} selected
                </p>
              )}
            </div>
          </div>

          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        {/* CONTENT */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[70vh]">
          {filterGroups.map((group) => (
            <MobileFilterSection
              key={group.id}
              group={group}
              selectedValues={tempFilters[group.id] || []}
              onToggle={handleToggle}
            />
          ))}
        </div>

        <Separator />

        {/* FOOTER */}
        <DrawerFooter className="flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 rounded-full uppercase tracking-wider"
          >
            Reset
          </Button>

          <Button
            onClick={handleApply}
            className="flex-1 rounded-full uppercase tracking-wider bg-primary"
          >
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

/* ================= TRIGGER ================= */

export function MobileFilterTrigger({
  onClick,
  activeFilterCount = 0,
}: {
  onClick: () => void;
  activeFilterCount?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3",
        "bg-foreground text-background",
        "rounded-full",
        "text-sm font-semibold uppercase tracking-wider",
        "hover:bg-foreground/90 active:scale-[0.98]"
      )}
    >
      Filters

      {activeFilterCount > 0 ? (
        <span className="w-5 h-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
          {activeFilterCount}
        </span>
      ) : (
        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </button>
  );
}

export default MobileFilterDrawer;