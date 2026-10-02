"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVerifyPayment, useUpdateFulfillmentStatus } from "@/hooks/admin/use-admin-orders";
import type { AdminOrderRow } from "./data";

interface AdminOrdersTableProps {
  orders: AdminOrderRow[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const paymentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  PAID: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
  REJECTED: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const fulfillmentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-muted/50 text-muted-foreground border-border/50" },
  PROCESSING: { label: "Processing", className: "bg-muted/50 text-muted-foreground border-border/50" },
  SHIPPED: { label: "Shipped", className: "bg-info/10 text-info border-info/20" },
  DELIVERED: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function AdminOrdersTable({ orders, currentPage, totalPages, onPageChange }: AdminOrdersTableProps) {
  const router = useRouter();
  const verifyPayment = useVerifyPayment();
  const updateStatus = useUpdateFulfillmentStatus();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  if (orders.length === 0) return null;

  const handleMarkPaid = (orderId: string) => {
    setUpdatingOrderId(orderId);
    verifyPayment.mutate(
      { orderId, action: 'APPROVE' },
      { onSettled: () => setUpdatingOrderId(null) }
    );
  };

  const handleStatusChange = (orderId: string, newStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED') => {
    setUpdatingOrderId(orderId);
    updateStatus.mutate(
      { orderId, newStatus },
      { onSettled: () => setUpdatingOrderId(null) }
    );
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-border/50 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Order ID
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Customer
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Amount
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Payment Status
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Fulfillment Status
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const paymentBadge = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING;
              const fulfillmentBadge = fulfillmentStatusConfig[order.fulfillmentStatus] || fulfillmentStatusConfig.PENDING;
              const isUpdatingThis = updatingOrderId === order.id;

              return (
                <TableRow key={order.id} className="hover:bg-muted/30">
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                        {order.customerName}
                      </span>
                      <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                        {order.customerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-[family-name:var(--font-montserrat)] text-xs ${paymentBadge.className}`}
                    >
                      {paymentBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-[family-name:var(--font-montserrat)] text-xs ${fulfillmentBadge.className}`}
                    >
                      {fulfillmentBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-secondary"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdatingThis}
                            className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-secondary/50 hover:text-secondary"
                          >
                            Update Status
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleMarkPaid(order.id)}
                            disabled={order.paymentStatus === 'PAID' || isUpdatingThis}
                            className="font-[family-name:var(--font-montserrat)] text-sm"
                          >
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                            disabled={order.fulfillmentStatus === 'PROCESSING' || isUpdatingThis}
                            className="font-[family-name:var(--font-montserrat)] text-sm"
                          >
                            Mark as Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                            disabled={order.fulfillmentStatus === 'SHIPPED' || isUpdatingThis}
                            className="font-[family-name:var(--font-montserrat)] text-sm"
                          >
                            Mark as Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                            disabled={order.fulfillmentStatus === 'DELIVERED' || isUpdatingThis}
                            className="font-[family-name:var(--font-montserrat)] text-sm"
                          >
                            Mark as Delivered
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 pt-4">
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="border-border/50 font-[family-name:var(--font-montserrat)] text-xs"
            >
              <ChevronLeft className="mr-1 h-3.5 w-3.5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="border-border/50 font-[family-name:var(--font-montserrat)] text-xs"
            >
              Next
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}