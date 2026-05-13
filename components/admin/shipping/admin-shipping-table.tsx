"use client";

import { useState } from "react";
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
import { Plus, ChevronDown, Package, Truck, CheckCircle } from "lucide-react";
import type { ShippingOrder, ShippingStatus, Carrier } from "./data";

interface AdminShippingTableProps {
  orders: ShippingOrder[];
  onUpdateStatus: (orderId: string, status: ShippingStatus) => void;
  onAddTracking: (order: ShippingOrder) => void;
}

const statusConfig: Record<ShippingStatus, { label: string; className: string; icon: typeof Package }> = {
  processing: {
    label: "Processing",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
  },
};

const carrierLabels: Record<string, string> = {
  USPS: "USPS",
  DHL: "DHL",
  FedEx: "FedEx",
  UPS: "UPS",
};

export function AdminShippingTable({ orders, onUpdateStatus, onAddTracking }: AdminShippingTableProps) {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusUpdate = (orderId: string, status: ShippingStatus) => {
    setUpdatingOrderId(orderId);
    setTimeout(() => {
      onUpdateStatus(orderId, status);
      setUpdatingOrderId(null);
    }, 300);
  };

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
              Status
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Carrier
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Tracking Number
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
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
                    className={`font-[family-name:var(--font-montserrat)] text-xs flex items-center gap-1 w-fit ${statusConfig[order.status].className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                  {order.carrier ? (
                    <span className="font-medium">{carrierLabels[order.carrier]}</span>
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
                    {order.status === "processing" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddTracking(order)}
                        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Tracking
                      </Button>
                    )}

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
                          onClick={() => handleStatusUpdate(order.id, "processing")}
                          disabled={order.status === "processing"}
                          className="font-[family-name:var(--font-montserrat)] text-sm"
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "shipped")}
                          disabled={order.status === "shipped"}
                          className="font-[family-name:var(--font-montserrat)] text-sm"
                        >
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "delivered")}
                          disabled={order.status === "delivered"}
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
  );
}
