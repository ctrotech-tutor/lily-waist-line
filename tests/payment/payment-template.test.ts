import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPaymentInstructionsTemplate } from "../../lib/email/templates/payment-instructions";
import { getPaymentRejectedTemplate } from "../../lib/email/templates/payment-rejected";

function createInstructionsTemplate(recipient: string, paymentLink: string | null) {
  return getPaymentInstructionsTemplate({
    appUrl: "https://shop.example",
    firstName: "Customer",
    email: "customer@example.com",
    orderNumber: "LWL-2026-0001",
    orderId: "order-id",
    paymentMethod: "PayPal",
    paymentLink,
    paymentLabel: recipient,
    amount: "$25.00",
    items: [{ name: "Waist trainer", quantity: 1 }],
  });
}

function createRejectedTemplate(reason: string) {
  return getPaymentRejectedTemplate({
    appUrl: "https://shop.example",
    firstName: "Customer",
    email: "customer@example.com",
    orderNumber: "LWL-2026-0001",
    orderId: "order-id",
    paymentMethod: "PayPal",
    amount: "$25.00",
    reason,
    items: [{ name: "Waist trainer", quantity: 1 }],
  });
}

describe("payment instruction email destination", () => {
  it("renders an email-only PayPal recipient without a fabricated link", () => {
    const template = createInstructionsTemplate("payments@example.com", null);
    assert.match(template.html, /payments@example\.com/);
    assert.match(template.html, /Open PayPal, choose Send/);
    assert.doesNotMatch(template.html, /paypal\.me/);
    assert.match(template.text, /payments@example\.com/);
    assert.doesNotMatch(template.text, /paypal\.me/);
  });

  it("escapes a recipient before inserting it into the HTML email", () => {
    const template = createInstructionsTemplate('<img src=x onerror="alert(1)">', null);
    assert.match(template.html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
    assert.doesNotMatch(template.html, /<img src=x/);
  });
});

describe("payment rejection email recovery instructions", () => {
  it("explains that the order is closed and directs paid customers to support", () => {
    const template = createRejectedTemplate("The transaction amount could not be verified.");
    assert.match(template.html, /order is now closed/);
    assert.match(template.html, /do not pay again/);
    assert.match(template.html, /Contact support/);
    assert.match(template.html, /View Order Status/);
    assert.doesNotMatch(template.html, /Upload New Proof/);
    assert.doesNotMatch(template.html, /order\/payment-proof/);
    assert.match(template.text, /do not pay again/);
  });

  it("escapes the admin-provided rejection reason", () => {
    const template = createRejectedTemplate('<img src=x onerror="alert(1)">');
    assert.match(template.html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
    assert.doesNotMatch(template.html, /<img src=x/);
  });
});
