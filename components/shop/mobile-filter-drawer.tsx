"use client";

import { useState, useRef, useEffect } from "react";
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
          : "bg-transparent border-border hover:border-[#d4af37]/50"
      )}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
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
        <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
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

export function MobileFilterDrawer({
  open,
  onOpenChange,
  onFiltersChange,
  searchParams,
}: MobileFilterDrawerProps) {
  const { updateParams, clearFilters } = useShopURLSync();

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    size: searchParams?.size ? [searchParams.size] : [],
    compression: searchParams?.compression ? [searchParams.compression] : [],
    color: [],
    availability: [],
  });

  const prevRef = useRef(searchParams);

  useEffect(() => {
    if (
      prevRef.current?.size === searchParams?.size &&
      prevRef.current?.compression === searchParams?.compression
    ) return;

    prevRef.current = searchParams;

    queueMicrotask(() => {
      setSelectedFilters({
        size: searchParams?.size ? [searchParams.size] : [],
        compression: searchParams?.compression
          ? [searchParams.compression]
          : [],
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
    updateParams({
      size: selectedFilters.size?.[0],
      compression: selectedFilters.compression?.[0],
    });

    onFiltersChange?.(selectedFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const reset = {
      size: [],
      compression: [],
      color: [],
      availability: [],
    };

    setSelectedFilters(reset);
    clearFilters();
    onFiltersChange?.(reset);
  };

  const activeCount = Object.values(selectedFilters).reduce(
    (a, b) => a + b.length,
    0
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-2xl">
        {/* REQUIRED TITLE (fixes Radix error) */}
        <DrawerHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-[#d4af37]/30 rounded-full flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
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
              selectedValues={selectedFilters[group.id] || []}
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
}

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
        <span className="w-5 h-5 bg-[#d4af37] text-black text-xs flex items-center justify-center rounded-full">
          {activeFilterCount}
        </span>
      ) : (
        <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
      )}
    </button>
  );
}

export default MobileFilterDrawer;