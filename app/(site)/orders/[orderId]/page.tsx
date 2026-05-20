import { notFound } from "next/navigation";
import { getOrderDetails } from "@/server/actions/orders";
import {
  mapPaymentStatus,
  mapFulfillmentStatus,
  formatOrderDate,
} from "@/types/order";
import { OrderDetailsClient } from "./order-details-client";
import type { PaymentStatus as PrismaPaymentStatus, FulfillmentStatus as PrismaFulfillmentStatus } from "@/lib/generated/prisma/enums";
import type { OrderItemData } from "@/components/orders/order-items-list";

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params;

  const result = await getOrderDetails(orderId);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;

  const paymentStatus = mapPaymentStatus(order.paymentStatus as PrismaPaymentStatus);
  const fulfillmentStatus = mapFulfillmentStatus(order.fulfillmentStatus as PrismaFulfillmentStatus);

  const orderSummary = {
    id: order.id,
    orderNumber: order.orderNumber,
    orderDate: formatOrderDate(order.createdAt),
    total: order.total,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    paymentStatus,
    fulfillmentStatus,
  };

  const items: OrderItemData[] = order.items.map((item) => ({
    id: item.id,
    productName: item.product.name,
    productImage: item.product.image?.url || "/img-1.png",
    size: item.variant.size,
    compression: item.variant.compressionLevel,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const shippingAddress = order.shippingAddress;

  return (
    <OrderDetailsClient
      order={orderSummary}
      items={items}
      shippingAddress={shippingAddress}
    />
  );
}
