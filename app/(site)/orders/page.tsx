"use client";

import { OrdersHeader } from "@/components/orders/orders-header";
import { OrdersList } from "@/components/orders/orders-list";
import { OrdersShell } from "@/components/orders/orders-shell";
import { EmptyOrdersState } from "@/components/orders/empty-orders-state";
import { useOrders } from "@/hooks/use-orders";

function OrdersListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card overflow-hidden animate-pulse">
          <div className="h-40 bg-muted" />
          <div className="p-4 md:p-5 space-y-3">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-8 w-full bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const { data, isLoading, error } = useOrders();

  const orders = data?.orders ?? [];
  const orderCount = orders.length;

  return (
    <div className="min-h-full">
      <OrdersHeader orderCount={orderCount} isLoaded={!isLoading} />
      <OrdersShell>
        {isLoading ? (
          <OrdersListSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error instanceof Error ? error.message : "Failed to load orders"}</p>
          </div>
        ) : orderCount === 0 ? (
          <EmptyOrdersState />
        ) : (
          <OrdersList orders={orders} isLoaded={true} />
        )}
      </OrdersShell>
    </div>
  );
}