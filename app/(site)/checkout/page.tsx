"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, MapPin, CreditCard, Shield, Truck, RotateCcw, Loader2, Check, DollarSign, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { CheckoutStep } from "@/components/checkout/checkout-step";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { AddressSelector, AddressCardData } from "@/components/checkout/address-selector";
import { PaymentMethodSelector, PaymentMethod } from "@/components/checkout/payment-method-selector";
import { PaymentInstructions } from "@/components/checkout/payment-instructions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { selectPaymentMethod } from "@/server/actions/payment";
import { toast } from "sonner";

// Mock data for summary preview - per Feature Spec 44
const mockItems = [
  {
    id: "1",
    name: "Elite Sculpt Waist Trainer",
    image: "/img-1.png",
    price: 120,
    quantity: 1,
    variant: "Size M / High Compression",
  },
  {
    id: "2",
    name: "Luxe Core Shaper",
    image: "/img-p-1.png",
    price: 85,
    quantity: 1,
    variant: "Size S / Medium Compression",
  },
  {
    id: "3",
    name: "Pro Waist Belt",
    image: "/auth-1.png",
    price: 65,
    quantity: 2,
    variant: "Size L / Light Compression",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isLoaded] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<AddressCardData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // Handle payment method selection with server action
  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    if (!orderId) {
      toast.error("Order must be created before selecting payment method");
      return;
    }

    setIsUpdatingPayment(true);
    setSelectedPayment(method); // Update UI immediately for better UX

    try {
      const result = await selectPaymentMethod({
        orderId: orderId,
        paymentMethod: method.toUpperCase() as 'CASH_APP' | 'PAYPAL'
      });

      if (result.success) {
        toast.success("Payment method selected successfully");
      } else {
        toast.error(result.error || "Failed to select payment method");
        // Revert selection on error
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error("Payment method selection error:", error);
      toast.error("An unexpected error occurred");
      setSelectedPayment(null);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Handle place order with loading simulation
  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    // Simulate order preparation
    setTimeout(() => {
      // Navigate to order confirmation page
      router.push("/order/confirmation");
    }, 2000);
  };

  // Mock calculations per Feature Spec 44
  // Subtotal = sum(mockCart), Shipping = fixed UI placeholder ($10), Total = subtotal + shipping
  const subtotal = mockItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10; // Fixed UI placeholder per spec
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
          <CheckoutSummary
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            items={mockItems}
            discount={0}
          />
        }
      >
        {/* Step 1: Address */}
        {currentStep === 1 && (
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
              onAddressSelect={setSelectedAddress}
              className="mb-6"
            />

            {/* Continue Button */}
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
        {currentStep === 2 && (
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
              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={selectedPayment}
                onSelect={handlePaymentMethodSelect}
                disabled={isUpdatingPayment}
              />

              {/* Payment Instructions Panel */}
              <PaymentInstructions method={selectedPayment} />

              {/* Navigation Buttons */}
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
        {currentStep === 3 && (
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
            <div className="space-y-6">
              {/* Order Summary Recap */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading text-base font-semibold text-foreground">
                      Order Summary
                    </h4>
                    <span className="font-sans text-sm text-muted-foreground">
                      {mockItems.length} {mockItems.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 mb-4">
                    {mockItems.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <div className="w-12 h-16 bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm font-medium text-foreground leading-tight">
                            {item.name}
                          </p>
                          {item.variant && (
                            <p className="font-sans text-xs text-muted-foreground">
                              {item.variant}
                            </p>
                          )}
                          <p className="font-sans text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-sans text-sm font-medium text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-sm text-muted-foreground">Subtotal</span>
                      <span className="font-sans text-sm text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-sm text-muted-foreground">Shipping</span>
                      <span className="font-sans text-sm text-foreground">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary/10 border border-secondary/20 -mx-5 mt-3">
                      <span className="font-heading text-base font-semibold text-foreground">Total</span>
                      <span className="font-heading text-xl font-semibold text-secondary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address Recap */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Shipping Address
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(1)}
                      className="h-8 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Change
                    </Button>
                  </div>

                  {selectedAddress ? (
                    <div className="space-y-1">
                      <p className="font-heading text-sm font-medium text-foreground">
                        {selectedAddress.firstName} {selectedAddress.lastName}
                      </p>
                      <p className="font-sans text-sm text-foreground">
                        {selectedAddress.addressLine1}
                      </p>
                      {selectedAddress.addressLine2 && (
                        <p className="font-sans text-sm text-foreground">
                          {selectedAddress.addressLine2}
                        </p>
                      )}
                      <p className="font-sans text-sm text-muted-foreground">
                        {[selectedAddress.city, selectedAddress.state, selectedAddress.country]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                      {selectedAddress.phone && (
                        <p className="font-sans text-sm text-muted-foreground">
                          {selectedAddress.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-muted-foreground">
                      No address selected
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method Recap */}
              <Card className="border-border">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      <h4 className="font-heading text-base font-semibold text-foreground">
                        Payment Method
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                      className="h-8 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Change
                    </Button>
                  </div>

                  {selectedPayment ? (
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 flex items-center justify-center border shrink-0",
                          "border-secondary bg-secondary/10"
                        )}
                      >
                        {selectedPayment === "cashapp" ? (
                          <DollarSign className="w-5 h-5 text-secondary" />
                        ) : (
                          <Globe className="w-5 h-5 text-secondary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-sm font-medium text-foreground">
                          {selectedPayment === "cashapp" ? "Cash App" : "PayPal"}
                        </p>
                        <p className="font-sans text-sm text-muted-foreground">
                          {selectedPayment === "cashapp"
                            ? "US Orders - Manual payment verification"
                            : "International Orders - Secure redirect"}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 bg-secondary/10 text-secondary font-sans text-[10px] uppercase tracking-wider"
                        >
                          {selectedPayment === "cashapp" ? "Recommended for US" : "Global Payments"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-muted-foreground">
                      No payment method selected
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Payment Routing Message */}
              <div className="p-4 bg-muted/30 border border-border/50">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm text-foreground">
                      {selectedPayment === "cashapp" && (
                        <>
                          <span className="font-medium">You will complete payment via Cash App</span>{" "}
                          <span className="text-muted-foreground">
                            after order confirmation. Payment instructions will be provided.
                          </span>
                        </>
                      )}
                      {selectedPayment === "paypal" && (
                        <>
                          <span className="font-medium">You will be redirected to PayPal</span>{" "}
                          <span className="text-muted-foreground">
                            to complete payment securely after placing your order.
                          </span>
                        </>
                      )}
                      {!selectedPayment && (
                        <span className="text-muted-foreground">
                          Please select a payment method to continue.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust & Assurance Section */}
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-secondary" />
                    <h4 className="font-heading text-sm font-semibold text-foreground">
                      Secure Checkout Guaranteed
                    </h4>
                  </div>
                  <p className="font-sans text-sm text-muted-foreground mb-4">
                    Your order is protected and will be processed securely after confirmation.
                    All payments are manually verified for your safety.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                        Secure
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Truck className="w-4 h-4 text-secondary" />
                      <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                        Fast Delivery
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <RotateCcw className="w-4 h-4 text-secondary" />
                      <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wide">
                        Easy Returns
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order CTA */}
              <div className="pt-4">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !selectedAddress || !selectedPayment}
                  className={cn(
                    "w-full h-14",
                    "font-sans text-sm font-semibold uppercase tracking-wider",
                    "bg-secondary text-secondary-foreground",
                    "hover:bg-secondary/90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200"
                  )}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Preparing your order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                <p className="text-center font-sans text-xs text-muted-foreground mt-3">
                  By placing your order, you agree to our terms and privacy policy
                </p>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className={cn(
                  "w-full h-12",
                  "font-sans text-sm font-medium",
                  "border-border text-foreground",
                  "hover:bg-muted",
                  "transition-colors duration-200"
                )}
              >
                Back to Payment
              </Button>
            </div>
          </CheckoutStep>
        )}
      </CheckoutShell>
    </div>
  );
}
