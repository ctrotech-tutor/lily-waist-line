import type { Metadata } from "next";
import { Sparkles, Truck, Globe, Clock, Package } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Shipping Policy | Lily Waist Line",
  description:
    "Review Lily Waist Line's shipping policy — domestic and international delivery information, processing times, and tracking details for your premium sculptwear orders.",
  alternates: {
    canonical: ROUTES.SHIPPING,
  },
};

const shippingHighlights = [
  {
    icon: Package,
    title: "Processing Time",
    description: "All orders are processed within 2–3 business days after payment verification.",
  },
  {
    icon: Truck,
    title: "US Delivery",
    description: "Standard delivery takes 2–4 business days after processing. $10 flat rate or free on orders over $100.",
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Available via PayPal. Delivery times and rates vary by destination.",
  },
  {
    icon: Clock,
    title: "Tracking",
    description: "Tracking information is emailed once your order ships. Allow 24 hours for carrier updates.",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="py-12 md:py-16 lg:py-20">
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Policy
              </span>
            </div>

            {/* Gold Divider */}
            <div className="mb-8 h-px w-16 bg-primary" />

            {/* Heading */}
            <h1 className="mb-6 max-w-2xl font-heading text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Shipping Policy
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              We are committed to delivering your order with care and efficiency.
              Please review our shipping terms below.
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 xl:px-20 md:py-12">
        {/* Highlights Grid */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {shippingHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="mb-16 h-px w-full bg-linear-to-r from-transparent via-border to-transparent md:mb-20 lg:mb-24" />

        {/* Detailed Sections */}
        <div className="mx-auto max-w-3xl">
          {/* Processing */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Order Processing
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Once your payment is verified, orders are processed within
                2–3 business days. Processing time begins after payment
                confirmation — not at the time of order placement. Orders placed
                on weekends or public holidays will begin processing on the next
                business day.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                During high-volume periods or promotional events, processing
                times may be extended by 1–2 business days. You will be notified
                of any significant delays via email.
              </p>
            </div>
          </section>

          {/* US Shipping */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Domestic Shipping (United States)
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We ship all domestic orders via trusted carriers. Delivery
                typically arrives within 2–4 business days after processing.
              </p>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-sans text-sm font-medium text-foreground">
                      Orders Under $100
                    </span>
                    <span className="font-sans text-sm text-muted-foreground">
                      $10.00 Flat Rate
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-medium text-foreground">
                      Orders Over $100
                    </span>
                    <span className="font-sans text-sm font-semibold text-primary">
                      Free Shipping
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Shipping fees are non-refundable. If you refuse a delivery or
                the package is returned as undeliverable, the original shipping
                cost will not be refunded.
              </p>
            </div>
          </section>

          {/* International */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              International Shipping
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                International shipping is available for customers paying via
                PayPal. Delivery times, rates, and available carriers vary by
                destination and are calculated at checkout.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Please note that international orders may be subject to customs
                fees, import duties, and taxes imposed by the destination
                country. These charges are the responsibility of the customer
                and are not included in the purchase price or shipping cost.
                Customs policies vary widely — we recommend contacting your
                local customs office for more information.
              </p>
            </div>
          </section>

          {/* Tracking */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Tracking Your Order
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Once your order ships, you will receive an email containing your
                tracking number and carrier information. Please allow up to 24
                hours for the tracking status to update after receiving your
                confirmation.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If your tracking information has not updated within 48 hours, or
                if you have any concerns about your delivery, please contact our
                support team at{" "}
                <span className="text-primary">support@lilywaistline.com</span>.
              </p>
            </div>
          </section>

          {/* Lost/Stolen */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Lost or Stolen Packages
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Lily Waist Line is not responsible for lost or stolen packages
                after delivery confirmation by the carrier. If your tracking
                information shows delivered but you have not received your
                package, please contact the carrier directly to file a claim.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If your package is marked as delivered but you believe it was
                stolen, we recommend filing a police report and contacting your
                local carrier office. We are happy to assist with any
                documentation needed for claims.
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Policy Updates
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We reserve the right to update this shipping policy at any time.
                Changes will be posted on this page with the effective date.
                Please review this policy periodically for any updates.
              </p>

              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Last updated: May 2026
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
