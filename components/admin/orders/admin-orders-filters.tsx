"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterStatus = "all" | "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

interface AdminOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
}

export function AdminOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: AdminOrdersFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by Order ID or Customer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 font-[family-name:var(--font-montserrat)] border-border/50 focus:border-secondary"
        />
      </div>

      <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as FilterStatus)}>
        <SelectTrigger className="w-full sm:w-[200px] font-[family-name:var(--font-montserrat)] border-border/50 focus:ring-secondary">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-[family-name:var(--font-montserrat)]">
            All Orders
          </SelectItem>
          <SelectItem value="pending_payment" className="font-[family-name:var(--font-montserrat)]">
            Pending Payment
          </SelectItem>
          <SelectItem value="paid" className="font-[family-name:var(--font-montserrat)]">
            Paid
          </SelectItem>
          <SelectItem value="processing" className="font-[family-name:var(--font-montserrat)]">
            Processing
          </SelectItem>
          <SelectItem value="shipped" className="font-[family-name:var(--font-montserrat)]">
            Shipped
          </SelectItem>
          <SelectItem value="delivered" className="font-[family-name:var(--font-montserrat)]">
            Delivered
          </SelectItem>
          <SelectItem value="cancelled" className="font-[family-name:var(--font-montserrat)]">
            Cancelled
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
