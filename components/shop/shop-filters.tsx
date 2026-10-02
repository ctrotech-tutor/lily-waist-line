"use client";

import { memo } from "react";
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
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
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

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function FilterChip({
  label,
  selected,
  onClick,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2.5",
        "text-sm font-medium",
        "transition-all duration-300",
        "border",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? [
              "bg-primary text-primary-foreground border-primary",
              "shadow-sm",
            ]
          : [
              "bg-card/40 text-foreground border-border/50",
              "hover:border-primary/40",
              "hover:bg-card/80",
            ]
      )}
    >
      {label}
    </button>
  );
}

interface FilterSectionProps {
  group: FilterGroup;
  selectedValues: string[];
  onToggle: (groupId: string, value: string) => void;
}

function FilterSection({
  group,
  selectedValues,
  onToggle,
}: FilterSectionProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <h3 className="text-sm font-semibold tracking-wide text-foreground">
        {group.title}
      </h3>

      {/* Options */}
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
  onFiltersChange?: (
    filters: Record<string, string[]>
  ) => void;
  className?: string;
  searchParams?: ShopSearchParams;
}

export const ShopFilters = memo(function ShopFilters({
  onFiltersChange,
  className,
  searchParams,
}: ShopFiltersProps) {
  const { updateParams, clearFilters } = useShopURLSync();

  // Derive selected filters directly from URL params
  const selectedFilters = {
    size: searchParams?.size ? [searchParams.size] : [],
    compression: searchParams?.compression ? [searchParams.compression] : [],
    availability: searchParams?.availability ? [searchParams.availability] : [],
  };

  const handleToggle = (
    groupId: string,
    value: string
  ) => {
    if (groupId === "size") {
      const current = selectedFilters.size?.[0];
      updateParams({
        size: current === value ? undefined : value,
      });
      return;
    }

    if (groupId === "compression") {
      const current = selectedFilters.compression?.[0];
      updateParams({
        compression: current === value ? undefined : value,
      });
      return;
    }

    if (groupId === "availability") {
      const current = selectedFilters.availability?.[0];
      updateParams({
        availability: current === value ? undefined : value,
      });
      return;
    }
  };

  const handleReset = () => {
    clearFilters();
    onFiltersChange?.({
      size: [],
      compression: [],
      availability: [],
    });
  };

  const activeFilterCount =
    Object.values(selectedFilters).flat().length;

  const hasActiveFilters =
    activeFilterCount > 0;

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/40",
        "bg-card/30 backdrop-blur-xl",
        "p-6 md:p-7",
        "space-y-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            Filters
          </span>

          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {activeFilterCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className={cn(
              "text-xs font-medium",
              "text-muted-foreground",
              "hover:text-foreground",
              "transition-colors"
            )}
          >
            Reset
          </button>
        )}
      </div>

      <Separator />

      {/* Groups */}
      <div className="space-y-6">
        {filterGroups.map(
          (group, index) => (
            <div key={group.id}>
              <FilterSection
                group={group}
                selectedValues={
                  (selectedFilters as Record<string, string[]>)[group.id] || []
                }
                onToggle={
                  handleToggle
                }
              />

              {index <
                filterGroups.length -
                  1 && (
                <Separator className="mt-6 opacity-40" />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
});

