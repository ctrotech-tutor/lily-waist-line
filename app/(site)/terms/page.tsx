import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Terms & Conditions | Lily Waist Line",
  description:
    "Review Lily Waist Line's terms and conditions governing the use of our website and purchase of premium sculptwear products.",
  alternates: {
    canonical: ROUTES.TERMS,
  },
};

export default function TermsPage() {
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
                Legal
              </span>
            </div>

            {/* Gold Divider */}
            <div className="mb-8 h-px w-16 bg-primary" />

            {/* Heading */}
            <h1 className="mb-6 max-w-2xl font-heading text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Terms &amp; Conditions
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Please read these terms carefully before using our website or
              making a purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 xl:px-20 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Introduction */}
          <section className="mb-12">
            <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
              Welcome to Lily Waist Line. By accessing our website or making a
              purchase, you agree to be bound by the following terms and
              conditions. If you do not agree with any part of these terms, you
              should not use our website or services.
            </p>
          </section>

          {/* Acceptance */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              1. Acceptance of Terms
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                By accessing, browsing, or purchasing from the Lily Waist Line
                website, you acknowledge that you have read, understood, and
                agree to be bound by these Terms &amp; Conditions and our Privacy
                Policy. These terms apply to all visitors, users, and customers.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We reserve the right to update, modify, or replace these terms
                at any time. Changes will be effective immediately upon posting.
                Your continued use of the website following any changes
                constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Account */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              2. Account Registration
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                To access certain features such as wishlists, order history, and
                checkout, you may be required to create an account. You are
                responsible for:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Providing accurate, current, and complete information</li>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We reserve the right to suspend or terminate accounts that
                violate these terms or provide false information.
              </p>
            </div>
          </section>

          {/* Products */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              3. Products &amp; Pricing
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                All product descriptions, images, pricing, and availability are
                subject to change without notice. We strive to display accurate
                information but do not warrant that product descriptions or
                pricing are error-free, complete, or current.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We reserve the right to modify or discontinue any product at any
                time without prior notice. Prices are listed in US Dollars (USD)
                and do not include applicable taxes or shipping fees, which will
                be added at checkout.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                In the event of a pricing error, we reserve the right to cancel
                or refuse any orders placed at the incorrect price.
              </p>
            </div>
          </section>

          {/* Payments */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              4. Payment Terms
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We accept the following payment methods:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">Cash App</strong> — Available
                  for US-based customers. Payment is made after order
                  confirmation using the Cash App handle provided in your
                  payment instructions.
                </li>
                <li>
                  <strong className="text-foreground">PayPal</strong> — Available
                  for international customers. Payment is processed securely
                  through PayPal&apos;s platform.
                </li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Orders are created with a &quot;Pending Payment&quot; status. Payment
                verification is performed manually by our team after you
                complete payment. Orders will not be processed until payment is
                confirmed.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If payment is not received within 7 days of order placement, we
                reserve the right to cancel the order.
              </p>
            </div>
          </section>

          {/* Shipping */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              5. Shipping &amp; Delivery
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Shipping and delivery terms are outlined in our separate Shipping
                Policy, which is incorporated into these terms by reference.
                By placing an order, you agree to the shipping terms applicable
                at the time of purchase.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Risk of loss and title for products pass to you upon delivery
                to the carrier. We are not responsible for delays caused by
                carriers or customs.
              </p>
            </div>
          </section>

          {/* Returns */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              6. Returns &amp; Refunds
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Our Returns &amp; Exchanges Policy, which is incorporated into
                these terms by reference, governs all returns and refunds. By
                making a purchase, you agree to the terms of that policy.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              7. Intellectual Property
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                All content on this website — including text, images, graphics,
                logos, product designs, and software — is the property of Lily
                Waist Line or its licensors and is protected by applicable
                intellectual property laws.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                You may not reproduce, distribute, modify, create derivative
                works from, or exploit any content from this website without our
                prior written consent.
              </p>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              8. Prohibited Uses
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                You agree not to use our website or services for any unlawful
                purpose or in violation of these terms. Prohibited activities
                include:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Attempting to interfere with website security or functionality</li>
                <li>Using automated systems (bots, scrapers) without permission</li>
                <li>Providing false or misleading information</li>
                <li>Engaging in fraudulent transactions</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              9. Limitation of Liability
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                To the fullest extent permitted by applicable law, Lily Waist
                Line shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to
                your use of our website or products.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Our total liability for any claim arising from your purchase
                shall not exceed the amount paid by you for the product giving
                rise to the claim.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              10. Governing Law
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                These terms shall be governed by and construed in accordance
                with the laws of the United States. Any disputes arising from
                these terms or your use of our website shall be resolved in the
                courts of the United States.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We make no representation that our products or services are
                appropriate or available for use in locations outside the United
                States. Those who access our website from other jurisdictions do
                so at their own risk and are responsible for compliance with
                local laws.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              11. Contact Information
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                For questions about these Terms &amp; Conditions, please contact us:
              </p>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="font-sans text-sm text-foreground">
                  Email: <span className="text-primary">support@lilywaistline.com</span>
                </p>
                <p className="mt-1 font-sans text-sm text-muted-foreground">
                  Lily Waist Line
                </p>
                <p className="font-sans text-sm text-muted-foreground">
                  United States
                </p>
              </div>
            </div>

            <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
              Last updated: May 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
