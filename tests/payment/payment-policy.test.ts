import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyPaymentSchema } from "../../lib/validators/admin/verify-payment";
import {
  getAvailablePaymentMethods,
  getPaymentDestination,
  isPaymentMethodAllowedForCountry,
  type PaymentMethodConfiguration,
} from "../../lib/services/payment-policy";

const cashApp: PaymentMethodConfiguration = {
  paymentMethod: "CASH_APP",
  enabled: true,
  cashAppHandle: "$LilyWaistLine",
};

const paypalHandle: PaymentMethodConfiguration = {
  paymentMethod: "PAYPAL",
  enabled: true,
  paypalHandle: "lilywaistline",
};

describe("payment method policy", () => {
  it("restricts Cash App to US addresses and PayPal to non-US addresses", () => {
    assert.equal(isPaymentMethodAllowedForCountry("United States", "CASH_APP"), true);
    assert.equal(isPaymentMethodAllowedForCountry(" U.S.A. ", "CASH_APP"), true);
    assert.equal(isPaymentMethodAllowedForCountry("Nigeria", "CASH_APP"), false);
    assert.equal(isPaymentMethodAllowedForCountry("United States", "PAYPAL"), false);
    assert.equal(isPaymentMethodAllowedForCountry("Nigeria", "PAYPAL"), true);
    assert.equal(isPaymentMethodAllowedForCountry("United States Minor Outlying Islands", "CASH_APP"), false);
  });

  it("offers only enabled methods with a configured recipient for the address region", () => {
    assert.deepEqual(getAvailablePaymentMethods("United States", [cashApp, paypalHandle]), ["CASH_APP"]);
    assert.deepEqual(getAvailablePaymentMethods("Nigeria", [cashApp, paypalHandle]), ["PAYPAL"]);
    assert.deepEqual(getAvailablePaymentMethods("Nigeria", [{ ...paypalHandle, enabled: false }]), []);
    assert.deepEqual(getAvailablePaymentMethods("United States", [{ ...cashApp, cashAppHandle: null }]), []);
  });

  it("creates stable, order-specific payment destination details", () => {
    assert.deepEqual(getPaymentDestination("CASH_APP", cashApp, 45.5), {
      recipient: "$LilyWaistLine",
      url: "https://cash.app/LilyWaistLine",
    });
    assert.deepEqual(getPaymentDestination("PAYPAL", paypalHandle, 45.5), {
      recipient: "lilywaistline",
      url: "https://www.paypal.me/lilywaistline/45.50",
    });
    assert.deepEqual(getPaymentDestination("PAYPAL", {
      paymentMethod: "PAYPAL",
      enabled: true,
      paypalEmail: "payments@example.com",
    }, 45.5), {
      recipient: "payments@example.com",
      url: null,
    });
  });

  it("rejects disabled, incomplete, or invalid destinations", () => {
    assert.equal(getPaymentDestination("CASH_APP", { ...cashApp, enabled: false }, 20), null);
    assert.equal(getPaymentDestination("CASH_APP", { ...cashApp, cashAppHandle: "https://evil.example" }, 20), null);
    assert.equal(getPaymentDestination("PAYPAL", { paymentMethod: "PAYPAL", enabled: true }, 20), null);
    assert.equal(getPaymentDestination("PAYPAL", {
      paymentMethod: "PAYPAL",
      enabled: true,
      paypalEmail: "not-an-email",
    }, 20), null);
    assert.equal(getPaymentDestination("PAYPAL", { ...paypalHandle, paymentMethod: "CASH_APP" }, 20), null);
    assert.equal(getPaymentDestination("PAYPAL", paypalHandle, Number.NaN), null);
  });
});

describe("payment rejection reason validation", () => {
  it("requires a clear reason for rejection but not for approval", () => {
    assert.equal(verifyPaymentSchema.safeParse({ orderId: "order-1", action: "APPROVE" }).success, true);
    assert.equal(verifyPaymentSchema.safeParse({ orderId: "order-1", action: "REJECT" }).success, false);
    assert.equal(verifyPaymentSchema.safeParse({ orderId: "order-1", action: "REJECT", reason: "   " }).success, false);
  });

  it("trims and bounds the persisted reason", () => {
    const parsed = verifyPaymentSchema.parse({ orderId: "order-1", action: "REJECT", reason: "  Amount does not match  " });
    assert.equal(parsed.reason, "Amount does not match");
    assert.equal(verifyPaymentSchema.safeParse({ orderId: "order-1", action: "REJECT", reason: "x".repeat(501) }).success, false);
  });
});
