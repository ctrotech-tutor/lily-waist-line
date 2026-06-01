"use client";

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
import type { AdminCustomerRow, CustomerStatus } from "./data";

interface AdminCustomersTableProps {
  customers: AdminCustomerRow[];
}

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-info/10 text-info border-info/20" },
  RETURNING: { label: "Returning", className: "bg-success/10 text-success border-success/20" },
  VIP: { label: "VIP", className: "bg-secondary/10 text-primary/80 border-secondary/20" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: Date | null): string {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return "N/A"
  }
}

export function AdminCustomersTable({ customers }: AdminCustomersTableProps) {
  const router = useRouter();

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-border/50 rounded-lg">
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
            <TableRow key={customer.id} className="hover:bg-muted/30">
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                {customer.fullName}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {customer.email}
              </TableCell>
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                {customer.orderCount} {customer.orderCount === 1 ? "order" : "orders"}
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
                {formatDate(customer.lastOrderDate)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  className="h-8 px-3 font-[family-name:var(--font-montserrat)] text-xs hover:text-secondary"
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