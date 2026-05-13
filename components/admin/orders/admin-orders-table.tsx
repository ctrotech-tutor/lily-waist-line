"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, ChevronDown } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MockOrder } from "@/lib/mock/admin-data";
import type { PaymentStatus, FulfillmentStatus } from "./data";
import { simulateAdminAction, withPermissionCheck, hasPermission } from "@/lib/admin-actions";

interface AdminOrdersTableProps {
  orders: MockOrder[];
  onUpdateStatus: (orderId: string, paymentStatus: PaymentStatus, fulfillmentStatus: FulfillmentStatus) => void;
}

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  pending_payment: { label: "Pending Payment", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  paid: { label: "Paid", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

const fulfillmentStatusConfig: Record<FulfillmentStatus, { label: string; className: string }> = {
  processing: { label: "Processing", className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
  shipped: { label: "Shipped", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminOrdersTable({ orders, onUpdateStatus }: AdminOrdersTableProps) {
  const router = useRouter();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusUpdate = withPermissionCheck(
    "canEditOrders",
    async (
      orderId: string,
      paymentStatus: PaymentStatus,
      fulfillmentStatus: FulfillmentStatus
    ) => {
      setUpdatingOrderId(orderId);
      await simulateAdminAction(
        async () => {
          onUpdateStatus(orderId, paymentStatus, fulfillmentStatus);
          return true;
        },
        {
          loadingMessage: "Updating order status...",
          successMessage: "Order status updated successfully",
          duration: 800,
        }
      );
      setUpdatingOrderId(null);
    }
  );

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-border/50">
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
          {orders.map((order) => (
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
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${paymentStatusConfig[order.paymentStatus].className}`}
                >
                  {paymentStatusConfig[order.paymentStatus].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${fulfillmentStatusConfig[order.fulfillmentStatus].className}`}
                >
                  {fulfillmentStatusConfig[order.fulfillmentStatus].label}
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
                    className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    View
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingOrderId === order.id}
                        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-[#d4af37]/50 hover:text-[#d4af37] rounded-none"
                      >
                        Update Status
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, "paid", order.fulfillmentStatus)}
                        disabled={order.paymentStatus === "paid"}
                        className="font-[family-name:var(--font-montserrat)] text-sm"
                      >
                        Mark as Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, order.paymentStatus, "processing")}
                        disabled={order.fulfillmentStatus === "processing"}
                        className="font-[family-name:var(--font-montserrat)] text-sm"
                      >
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, order.paymentStatus, "shipped")}
                        disabled={order.fulfillmentStatus === "shipped"}
                        className="font-[family-name:var(--font-montserrat)] text-sm"
                      >
                        Mark as Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, order.paymentStatus, "delivered")}
                        disabled={order.fulfillmentStatus === "delivered"}
                        className="font-[family-name:var(--font-montserrat)] text-sm"
                      >
                        Mark as Delivered
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
