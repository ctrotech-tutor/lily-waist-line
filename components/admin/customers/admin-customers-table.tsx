"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Customer, CustomerStatus } from "./data";

interface AdminCustomersTableProps {
  customers: Customer[];
}

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  returning: { label: "Returning", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  vip: { label: "VIP", className: "bg-[#d4af37]/10 text-[#b8952e] border-[#d4af37]/20" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function AdminCustomersTable({ customers }: AdminCustomersTableProps) {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Customer
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Total Orders
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Total Spent
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Last Order
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="hover:bg-muted/30"
              onMouseEnter={() => setHoveredRow(customer.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                {customer.name}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {customer.email}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                {customer.totalOrders} {customer.totalOrders === 1 ? "order" : "orders"}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                {formatCurrency(customer.totalSpent)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${statusConfig[customer.status].className}`}
                >
                  {statusConfig[customer.status].label}
                </Badge>
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {customer.lastOrderDate}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  className="h-8 px-3 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View Profile
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
