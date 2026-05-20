import { getUserOrders } from "@/server/actions/orders";
import { mapPaymentStatus, mapFulfillmentStatus, formatOrderDate } from "@/types/order";
import { OrdersPageClient } from "./orders-page-client";

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const result = await getUserOrders({ page, limit: 10 });

  if (!result.success || !result.data) {
    return (
      <OrdersPageClient
        orders={[]}
        pagination={null}
        error={result.error || "Failed to load orders"}
      />
    );
  }

  const orders = result.data.orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    orderDate: formatOrderDate(order.createdAt),
    total: typeof order.total === "number" ? order.total : Number(order.total),
    paymentStatus: mapPaymentStatus(order.paymentStatus),
    fulfillmentStatus: mapFulfillmentStatus(order.fulfillmentStatus),
    itemCount: order.itemCount,
  }));

  return (
    <OrdersPageClient
      orders={orders}
      pagination={result.data.pagination}
    />
  );
}
