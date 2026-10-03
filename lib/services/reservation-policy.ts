export const ORDER_PAYMENT_PROOF_WINDOW_MS = 24 * 60 * 60 * 1000;

export function createReservationExpiry(createdAt: Date): Date {
  const createdAtMs = createdAt.getTime();
  if (!Number.isFinite(createdAtMs)) {
    throw new RangeError("Order creation time must be a valid date")
  }
  return new Date(createdAtMs + ORDER_PAYMENT_PROOF_WINDOW_MS)
}

export function isReservationExpired(
  expiresAt: Date | null | undefined,
  now: Date,
): boolean {
  if (!expiresAt) return false;
  return expiresAt.getTime() <= now.getTime();
}
