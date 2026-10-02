"use client";

import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterStockStatus = "all" | "in-stock" | "low-stock" | "out-of-stock";

interface AdminProductsControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  stockFilter: FilterStockStatus;
  onStockFilterChange: (value: FilterStockStatus) => void;
}

export function AdminProductsControls({
  searchQuery,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
}: AdminProductsControlsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-[family-name:var(--font-montserrat)] border-border/50 focus:border-secondary"
          />
        </div>

        {/* Stock Filter */}
        <Select
          value={stockFilter}
          onValueChange={(value) => onStockFilterChange(value as FilterStockStatus)}
        >
          <SelectTrigger className="w-full sm:w-[180px] font-[family-name:var(--font-montserrat)] border-border/50 focus:ring-secondary">
            <SelectValue placeholder="Filter by Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-[family-name:var(--font-montserrat)]">
              All Products
            </SelectItem>
            <SelectItem value="in-stock" className="font-[family-name:var(--font-montserrat)]">
              In Stock
            </SelectItem>
            <SelectItem value="low-stock" className="font-[family-name:var(--font-montserrat)]">
              Low Stock
            </SelectItem>
            <SelectItem value="out-of-stock" className="font-[family-name:var(--font-montserrat)]">
              Out of Stock
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Product Button */}
      <Button
        onClick={() => router.push(ROUTES.ADMIN_PRODUCTS_NEW)}
        className="font-[family-name:var(--font-montserrat)] bg-secondary text-foreground hover:bg-secondary/90"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}
