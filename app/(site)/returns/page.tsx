import type { Metadata } from "next";
import { Sparkles, RotateCcw, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Lily Waist Line",
  description:
    "Review Lily Waist Line's 30-day return and exchange policy for premium waist trainers and sculptwear. Conditions, process, and refund timeline.",
  alternates: {
    canonical: ROUTES.RETURNS,
  },
};

const highlights = [
  {
    icon: RotateCcw,
    title: "30-Day Window",
    description: "You may return unworn items within 30 days of delivery for a full refund or exchange.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene Standards",
    description: "For hygiene and safety, items must be unworn, unwashed, and in original packaging with all tags attached.",
  },
  {
    icon: RefreshCw,
    title: "Exchanges Welcome",
    description: "Exchanges for a different size or compression level are processed promptly upon receipt of your return.",
  },
  {
    icon: AlertCircle,
    title: "Non-Returnable Items",
    description: "Due to hygiene regulations, items without original packaging or showing signs of wear cannot be accepted.",
  },
];

export default function ReturnsPage() {
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
              Returns &amp; Exchanges
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              We want you to love your purchase. If something is not right, our
              team is here to make it right.
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 xl:px-20 md:py-12">
        {/* Highlights Grid */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map((item) => {
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
          {/* Return Window */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Return Window
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We accept returns within <strong className="text-foreground">30 calendar days</strong> of the delivery
                date. To be eligible, items must meet the following conditions:
              </p>

              <ul className="list-inside list-disc space-y-2 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Unworn and unwashed</li>
                <li>In original packaging with all tags attached</li>
                <li>Free of odors, stains, pet hair, or any signs of use</li>
                <li>All original accessories and inserts included</li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Returns that do not meet these conditions may be rejected or
                subject to a restocking fee. We reserve the right to determine
                the condition of returned items.
              </p>
            </div>
          </section>

          {/* Hygiene Notice */}
          <section className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <h3 className="mb-2 font-heading text-base font-semibold text-foreground">
                  Hygiene Notice
                </h3>

                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  For health and hygiene reasons, we cannot accept returns on
                  items that have been worn, washed, or have had packaging
                  removed. This policy is in place to protect all our customers
                  and follows industry-standard practices for intimate apparel
                  and shapewear.
                </p>
              </div>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              How to Initiate a Return
            </h2>

            <div className="space-y-4">
              <ol className="list-inside list-decimal space-y-3 font-sans text-base leading-relaxed text-muted-foreground">
                <li>
                  Email us at{" "}
                  <span className="text-primary">support@lilywaistline.com</span>{" "}
                  with your order number and reason for return.
                </li>

                <li>
                  Our team will respond within 24 hours with return instructions
                  and your return authorization.
                </li>

                <li>
                  Package the item securely in its original packaging with all
                  tags attached.
                </li>

                <li>
                  Ship the package to the address provided in your return
                  instructions. We recommend using a trackable shipping method.
                </li>
              </ol>

              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Return shipping costs are the responsibility of the customer,
                unless the return is due to a defect or error on our part. We
                recommend using a trackable shipping service — Lily Waist Line
                is not responsible for lost return packages.
              </p>
            </div>
          </section>

          {/* Refunds */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Refunds
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. If approved, the
                refund will be processed to your original payment method within
                5–10 business days.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Refunds are issued to the original payment method:
              </p>

              <ul className="list-inside list-disc space-y-2 font-sans text-base leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">Cash App (US orders):</strong>{" "}
                  Refunded via Cash App to the sending account
                </li>
                <li>
                  <strong className="text-foreground">PayPal (International orders):</strong>{" "}
                  Refunded to the original PayPal account
                </li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Original shipping costs are non-refundable. If you received free
                shipping and return a portion of your order, the actual shipping
                cost may be deducted from your refund.
              </p>
            </div>
          </section>

          {/* Exchanges */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Exchanges
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We gladly offer exchanges for a different size or compression
                level. Exchange requests are processed upon receipt and
                inspection of the returned item. We will ship the replacement
                item at no additional shipping cost within the United States.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                International exchange customers are responsible for return
                shipping to us and any additional shipping costs for the
                replacement item.
              </p>
            </div>
          </section>

          {/* Damaged/Defective */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Damaged or Defective Items
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If you receive a damaged or defective item, please contact us
                within 48 hours of delivery at{" "}
                <span className="text-primary">support@lilywaistline.com</span>{" "}
                with your order number, a description of the issue, and photos
                of the damage. We will resolve the issue promptly — whether
                through a replacement, refund, or other appropriate remedy.
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
                We reserve the right to update this returns policy at any time.
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
