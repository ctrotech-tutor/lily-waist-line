import "server-only";

import prisma from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

const DEFAULT_EXPIRY_BATCH_SIZE = 50;

type InventoryTransaction = Prisma.TransactionClient;

interface ReservationSweepResult {
  releasedOrders: number;
  releasedUnits: number;
}

async function restoreOrderItems(
  tx: InventoryTransaction,
  orderIds: string[],
): Promise<number> {
  if (orderIds.length === 0) return 0;

  const quantitiesByVariant = await tx.orderItem.groupBy({
    by: ["variantId"],
    where: { orderId: { in: orderIds } },
    _sum: { quantity: true },
  });

  let releasedUnits = 0;
  for (const row of quantitiesByVariant) {
    const quantity = row._sum.quantity ?? 0;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Cannot release inventory for an order with invalid item quantities");
    }

    const updated = await tx.productVariant.updateMany({
      where: { id: row.variantId },
      data: { stockQuantity: { increment: quantity } },
    });

    if (updated.count !== 1) {
      throw new Error(`Could not restore inventory for variant ${row.variantId}`);
    }
    releasedUnits += quantity;
  }

  return releasedUnits;
}

/**
 * Release a single reserved order exactly once. Call inside the transaction that
 * changes the order's payment or fulfillment state.
 */
export async function releaseOrderInventory(
  tx: InventoryTransaction,
  orderId: string,
  releasedAt = new Date(),
): Promise<boolean> {
  const marked = await tx.order.updateMany({
    where: {
      id: orderId,
      inventoryReservedAt: { not: null },
      inventoryCommittedAt: null,
      inventoryReleasedAt: null,
    },
    data: {
      inventoryReleasedAt: releasedAt,
      reservationExpiresAt: null,
    },
  });

  if (marked.count !== 1) return false;
  await restoreOrderItems(tx, [orderId]);
  return true;
}

async function expireReservationInTransaction(
  tx: InventoryTransaction,
  orderId: string,
  now: Date,
): Promise<boolean> {
  const expired = await tx.order.updateMany({
    where: {
      id: orderId,
      paymentStatus: "PENDING",
      fulfillmentStatus: "PENDING",
      reservationExpiresAt: { lte: now },
      inventoryReservedAt: { not: null },
      inventoryCommittedAt: null,
      inventoryReleasedAt: null,
    },
    data: {
      fulfillmentStatus: "CANCELLED",
      reservationExpiresAt: null,
      inventoryReleasedAt: now,
    },
  });

  return expired.count === 1;
}

/**
 * Expire one order on demand. The conditional update is the concurrency gate:
 * payment-proof submission, approval, cancellation, and expiry cannot all win.
 */
export async function expireReservationForOrder(
  orderId: string,
  now = new Date(),
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const expired = await expireReservationInTransaction(tx, orderId, now);
    if (!expired) return false;
    await tx.paymentProof.updateMany({
      where: { orderId, status: "PENDING" },
      data: {
        status: "REJECTED",
        rejectionReason: "The 24-hour payment-proof deadline elapsed before review.",
      },
    });
    await restoreOrderItems(tx, [orderId]);
    return true;
  });
}

/**
 * Release a bounded batch of expired, unproved reservations. Safe to call from
 * both request paths and a scheduled job; conditional updates make retries
 * idempotent and ensure each order is restocked once.
 */
export async function releaseExpiredInventoryReservations(
  now = new Date(),
  batchSize = DEFAULT_EXPIRY_BATCH_SIZE,
): Promise<ReservationSweepResult> {
  const requestedBatchSize = Number.isFinite(batchSize)
    ? Math.floor(batchSize)
    : DEFAULT_EXPIRY_BATCH_SIZE;
  const safeBatchSize = Math.max(1, Math.min(requestedBatchSize, 250));

  return prisma.$transaction(async (tx) => {
    const candidates = await tx.order.findMany({
      where: {
        paymentStatus: "PENDING",
        fulfillmentStatus: "PENDING",
        reservationExpiresAt: { lte: now },
        inventoryReservedAt: { not: null },
        inventoryCommittedAt: null,
        inventoryReleasedAt: null,
      },
      select: { id: true },
      orderBy: { reservationExpiresAt: "asc" },
      take: safeBatchSize,
    });

    const releasedOrderIds: string[] = [];
    for (const candidate of candidates) {
      if (await expireReservationInTransaction(tx, candidate.id, now)) {
        releasedOrderIds.push(candidate.id);
      }
    }

    if (releasedOrderIds.length > 0) {
      await tx.paymentProof.updateMany({
        where: { orderId: { in: releasedOrderIds }, status: "PENDING" },
        data: {
          status: "REJECTED",
          rejectionReason: "The 24-hour payment-proof deadline elapsed before review.",
        },
      });
    }

    const releasedUnits = await restoreOrderItems(tx, releasedOrderIds);
    return {
      releasedOrders: releasedOrderIds.length,
      releasedUnits,
    };
  });
}
