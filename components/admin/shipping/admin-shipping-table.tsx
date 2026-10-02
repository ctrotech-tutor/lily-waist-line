"use client";

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
import { Plus, ChevronDown, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import type { AdminShippingRow } from "./data";

interface AdminShippingTableProps {
  orders: AdminShippingRow[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  onAddTracking: (order: AdminShippingRow) => void;
  isUpdating: boolean;
}

const statusConfig: Record<string, { label: string; className: string; icon: typeof Package }> = {
  PROCESSING: {
    label: "Processing",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-info/10 text-info border-info/20",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-success/10 text-success border-success/20",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: XCircle,
  },
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function AdminShippingTable({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateStatus,
  onAddTracking,
  isUpdating,
}: AdminShippingTableProps) {
  if (orders.length === 0) return null;

  return (
    <div className="border border-border/50 rounded-lg">
      <div className="overflow-x-auto">
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
                Status
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Carrier
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                Tracking
              </TableHead>
              <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const config = statusConfig[order.fulfillmentStatus] || statusConfig.PROCESSING;
              const StatusIcon = config.icon;
              const allowed = ALLOWED_TRANSITIONS[order.fulfillmentStatus] || [];

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
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-[family-name:var(--font-montserrat)] text-xs flex items-center gap-1 w-fit ${config.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                    {order.carrier ? (
                      <span className="font-medium">{order.carrier}</span>
                    ) : (
                      <span className="text-muted-foreground italic">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                    {order.trackingNumber ? (
                      <code className="bg-muted px-1.5 py-0.5 text-xs">{order.trackingNumber}</code>
                    ) : (
                      <span className="text-muted-foreground italic">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.fulfillmentStatus === "PROCESSING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddTracking(order)}
                          className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-secondary"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Tracking
                        </Button>
                      )}

                      {allowed.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating}
                              className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-secondary/50 hover:text-secondary"
                            >
                              Update
                              <ChevronDown className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {allowed.map((status) => {
                              const transitionConfig = statusConfig[status];
                              if (!transitionConfig) return null;
                              const TransitionIcon = transitionConfig.icon;
                              return (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => onUpdateStatus(order.id, status)}
                                  className="font-[family-name:var(--font-montserrat)] text-sm"
                                >
                                  <TransitionIcon className="mr-2 h-3.5 w-3.5" />
                                  Mark as {transitionConfig.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
          <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-8 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-secondary/50 hover:text-secondary"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-8 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-secondary/50 hover:text-secondary"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}