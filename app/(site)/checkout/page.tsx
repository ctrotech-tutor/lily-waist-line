"use client";
export const dynamic = "force-dynamic"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { CheckoutStep } from "@/components/checkout/checkout-step";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutSummarySkeleton } from "@/components/checkout/checkout-summary-skeleton";
import { CheckoutStepSkeleton } from "@/components/checkout/checkout-step-skeleton";
import { AddressSelector } from "@/components/checkout/address-selector";
import type { AddressCardData } from "@/types/address";
import { PaymentMethodSelector, PaymentMethod } from "@/components/checkout/payment-method-selector";
import { PaymentInstructions } from "@/components/checkout/payment-instructions";
import { OrderReview } from "@/components/checkout/order-review";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAddresses } from "@/hooks/use-addresses";
import { createOrder } from "@/server/actions/order";
import { validateCheckoutAccess } from "@/server/actions/checkout/validate-checkout-access";
import { toast } from "sonner";

interface CheckoutCartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoaded] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<AddressCardData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Validate checkout access
  const validationQuery = useQuery({
    queryKey: ['checkout-access'],
    queryFn: async () => {
      const result = await validateCheckoutAccess();
      return result;
    },
    retry: false,
  });

  useEffect(() => {
    if (validationQuery.data && !validationQuery.data.success) {
      toast.error(validationQuery.data.error || "Cannot access checkout");
      if (validationQuery.data.redirect) {
        router.push(validationQuery.data.redirect);
      }
    }
  }, [validationQuery.data, router]);

  // Fetch cart
  const { data: cartData, isLoading: isCartLoading } = useCart();

  // Fetch addresses
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();

  const isLoading = isCartLoading || isAddressesLoading || validationQuery.isLoading;

  // Map cart items
  const cartItems: CheckoutCartItem[] = (cartData?.items ?? []).map((item) => ({
    id: item.id,
    name: item.product.name,
    image: item.product.image?.url || "/logo.svg",
    price: item.unitPrice,
    quantity: item.quantity,
    variant: `${item.variant.size} / ${item.variant.compressionLevel}`
  }));

  // Map addresses to AddressCardData
  const addressCardData: AddressCardData[] = (addresses ?? []).map((addr) => ({
    id: addr.id,
    firstName: addr.firstName,
    lastName: addr.lastName,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2 ?? undefined,
    city: addr.city,
    state: addr.state ?? undefined,
    postalCode: addr.postalCode ?? undefined,
    country: addr.country,
    phone: addr.phone ?? undefined,
    isDefault: addr.isDefault,
  }));

  // Handle payment method selection
  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      toast.error("Please complete all steps before placing order");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const result = await createOrder({
        addressId: selectedAddress.id,
        paymentMethod: selectedPayment === 'cashapp' ? 'CASH_APP' : 'PAYPAL'
      });

      if (result.success && result.data) {
        toast.success("Order placed successfully!");
        router.push(`/order/confirmation/${result.data.orderId}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-full">
      {/* Page Header - Minimal for Checkout Focus */}
      <div className="border-b border-border">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="py-8 md:py-12">
            {/* Secure Checkout Badge */}
            <div
              className={cn(
                "flex items-center gap-2 mb-4",
                "transition-all duration-700 ease-out",
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
            >
              <Lock className="w-4 h-4 text-secondary" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Secure Checkout
              </span>
            </div>

            {/* Gold Divider */}
            <div
              className={cn(
                "w-16 h-px bg-secondary mb-6",
                "transition-all duration-700 delay-100 ease-out",
                isLoaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
              )}
              style={{ transformOrigin: "left" }}
            />

            {/* Main Heading */}
            <h1
              className={cn(
                "font-heading text-2xl sm:text-3xl md:text-4xl",
                "leading-[1.1] tracking-tight text-foreground",
                "transition-all duration-1000 delay-200 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Checkout
            </h1>

            {/* Supporting Copy */}
            <p
              className={cn(
                "font-sans text-base",
                "text-muted-foreground leading-relaxed",
                "max-w-xl mt-4",
                "transition-all duration-1000 delay-300 ease-out",
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              Complete your order in just a few steps
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Progress Bar */}
      <div className="border-b border-border/50">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="py-6 md:py-8">
            <CheckoutProgress
              currentStep={currentStep}
              className={cn(
                "max-w-md mx-auto",
                "transition-all duration-1000 delay-400 ease-out",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>
      </div>

      {/* Main Checkout Layout */}
      <CheckoutShell
        summary={
          isLoading ? (
            <CheckoutSummarySkeleton />
          ) : (
            <CheckoutSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              items={cartItems}
              discount={0}
            />
          )
        }
      >
        {/* Loading State */}
        {isLoading && (
          <CheckoutStepSkeleton />
        )}

        {/* Step 1: Address */}
        {!isLoading && currentStep === 1 && (
          <CheckoutStep
            title="Shipping Address"
            subtitle="Select where your order will be delivered"
            stepNumber={1}
            isActive={true}
            className={cn(
              "transition-all duration-700 delay-500 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <AddressSelector
              addresses={addressCardData}
              onAddressSelect={setSelectedAddress}
              className="mb-6"
            />

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedAddress}
              className={cn(
                "w-full h-12",
                "font-sans text-sm font-semibold uppercase tracking-wider",
                "bg-secondary text-secondary-foreground",
                "hover:bg-secondary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-colors duration-200"
              )}
            >
              Continue to Payment
            </Button>
          </CheckoutStep>
        )}

        {/* Step 2: Payment */}
        {!isLoading && currentStep === 2 && (
          <CheckoutStep
            title="Payment Method"
            subtitle="Choose how you would like to pay"
            stepNumber={2}
            isActive={true}
            className={cn(
              "transition-all duration-700 delay-500 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="space-y-6">
              <PaymentMethodSelector
                selectedMethod={selectedPayment}
                onSelect={handlePaymentMethodSelect}
              />

              <PaymentInstructions method={selectedPayment} />

              <div className="flex gap-4 pt-2">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className={cn(
                    "flex-1 h-12",
                    "font-sans text-sm font-medium",
                    "border-border text-foreground",
                    "hover:bg-muted",
                    "transition-colors duration-200"
                  )}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedPayment}
                  className={cn(
                    "flex-1 h-12",
                    "font-sans text-sm font-semibold uppercase tracking-wider",
                    "bg-secondary text-secondary-foreground",
                    "hover:bg-secondary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-colors duration-200"
                  )}
                >
                  Review Order
                </Button>
              </div>
            </div>
          </CheckoutStep>
        )}

        {/* Step 3: Review */}
        {!isLoading && currentStep === 3 && (
          <CheckoutStep
            title="Review Your Order"
            subtitle="Confirm your details before placing order"
            stepNumber={3}
            isActive={true}
            className={cn(
              "transition-all duration-700 delay-500 ease-out",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <OrderReview
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              selectedAddress={selectedAddress}
              selectedPayment={selectedPayment}
              onEditAddress={() => setCurrentStep(1)}
              onEditPayment={() => setCurrentStep(2)}
              onPlaceOrder={handlePlaceOrder}
              isLoading={isPlacingOrder}
            />
          </CheckoutStep>
        )}
      </CheckoutShell>
    </div>
  );
}
