"use client";

import { useRouter } from "next/navigation";
import { OrdersHeader } from "@/components/orders/orders-header";
import { OrdersList } from "@/components/orders/orders-list";
import { EmptyOrdersState } from "@/components/orders/empty-orders-state";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import type { OrderData } from "@/components/orders/order-card";
import type { OrdersPagination } from "@/types/order";

interface OrdersPageClientProps {
  orders: OrderData[];
  pagination: OrdersPagination | null;
  error?: string;
}

export function OrdersPageClient({
  orders,
  pagination,
  error,
}: OrdersPageClientProps) {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push("/shop");
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) {
      params.set("page", String(newPage));
    }
    const query = params.toString();
    router.push(query ? `/orders?${query}` : "/orders");
  };

  const orderCount = pagination?.totalCount ?? orders.length;

  return (
    <div className="min-h-full">
      {/* Page Header Section */}
      <OrdersHeader orderCount={orderCount} isLoaded />

      {/* Orders Content Container */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-destructive/50 bg-destructive/10">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="font-sans text-sm text-destructive ml-2">{error}</p>
          </Alert>
        )}

        {orderCount === 0 && !error ? (
          <EmptyOrdersState onStartShopping={handleStartShopping} />
        ) : (
          <>
            <OrdersList orders={orders} isLoaded />

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="border-border text-foreground hover:bg-accent px-4"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="font-sans text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="border-border text-foreground hover:bg-accent px-4"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
