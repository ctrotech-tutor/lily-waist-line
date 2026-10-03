import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createReservationExpiry,
  isReservationExpired,
  ORDER_PAYMENT_PROOF_WINDOW_MS,
} from "../../lib/services/reservation-policy";

describe("24-hour payment-proof reservation policy", () => {
  it("creates a deadline exactly 24 hours after order creation", () => {
    const createdAt = new Date("2026-10-03T12:00:00.000Z");
    const expiresAt = createReservationExpiry(createdAt);

    assert.equal(ORDER_PAYMENT_PROOF_WINDOW_MS, 24 * 60 * 60 * 1000);
    assert.equal(expiresAt.getTime() - createdAt.getTime(), ORDER_PAYMENT_PROOF_WINDOW_MS);
  });

  it("treats the exact deadline as expired", () => {
    const expiresAt = new Date("2026-10-04T12:00:00.000Z");

    assert.equal(isReservationExpired(null, expiresAt), false);
    assert.equal(isReservationExpired(expiresAt, new Date(expiresAt.getTime() - 1)), false);
    assert.equal(isReservationExpired(expiresAt, expiresAt), true);
    assert.equal(isReservationExpired(expiresAt, new Date(expiresAt.getTime() + 1)), true);
  });

  it("rejects an invalid order creation time", () => {
    assert.throws(() => createReservationExpiry(new Date(Number.NaN)), RangeError);
  });
});
