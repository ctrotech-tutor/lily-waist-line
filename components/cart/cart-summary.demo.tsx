"use client";

import { CartSummary } from "./cart-summary";

export function CartSummaryDemo() {
  // Demo scenarios
  const scenarios = [
    {
      title: "Empty Cart",
      props: {
        subtotal: 0,
        deliveryFee: null,
        discount: 0,
        itemCount: 0,
      },
    },
    {
      title: "Cart with Items",
      props: {
        subtotal: 129.99,
        deliveryFee: null,
        discount: 0,
        itemCount: 2,
      },
    },
    {
      title: "Cart with Free Shipping",
      props: {
        subtotal: 199.99,
        deliveryFee: 0,
        discount: 0,
        itemCount: 3,
      },
    },
    {
      title: "Cart with Discount",
      props: {
        subtotal: 299.99,
        deliveryFee: 15,
        discount: 30,
        itemCount: 4,
      },
    },
  ];

  return (
    <div className="p-8 space-y-12">
      <h1 className="font-heading text-3xl font-semibold mb-8">
        CartSummary Component Demo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {scenarios.map((scenario) => (
          <div key={scenario.title} className="space-y-4">
            <h2 className="font-sans text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {scenario.title}
            </h2>
            <CartSummary
              subtotal={scenario.props.subtotal}
              deliveryFee={scenario.props.deliveryFee}
              discount={scenario.props.discount}
              itemCount={scenario.props.itemCount}
              onCheckout={() => console.log(`Checkout: ${scenario.title}`)}
              onContinueShopping={() => console.log(`Continue Shopping: ${scenario.title}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
