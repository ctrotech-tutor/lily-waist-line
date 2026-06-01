"use client";

import { OrderCard, OrderData } from "./order-card";
import { cn } from "@/lib/utils";

export interface OrdersListProps {
  orders: OrderData[];
  className?: string;
  isLoaded?: boolean;
}

export function OrdersList({ orders, className, isLoaded = true }: OrdersListProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        "transition-all duration-1000 delay-200 ease-out",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}