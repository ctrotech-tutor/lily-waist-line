import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Privacy Policy | Lily Waist Line",
  description:
    "Lily Waist Line's privacy policy — how we collect, use, and protect your personal information when you shop our premium sculptwear collection.",
  alternates: {
    canonical: ROUTES.PRIVACY,
  },
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your privacy is important to us. This policy outlines how Lily
              Waist Line collects, uses, and safeguards your personal
              information.
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
              Lily Waist Line (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
              protecting the privacy of our customers. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or make a purchase.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Information We Collect
            </h2>

            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Personal Information
              </h3>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                When you create an account, place an order, or contact us, we
                may collect:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Full name</li>
                <li>Email address</li>
                <li>Billing and shipping address</li>
                <li>Phone number</li>
                <li>Payment information (processed securely through Cash App or PayPal — we do not store full payment credentials)</li>
                <li>Account credentials (email and password)</li>
              </ul>

              <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                Automatically Collected Information
              </h3>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                When you browse our website, we may automatically collect:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website or source</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </section>

          {/* How We Use */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              How We Use Your Information
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We use the information we collect to:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send order confirmations, shipping updates, and payment reminders</li>
                <li>Improve our website, products, and services</li>
                <li>Detect and prevent fraud or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We will not use your personal information for purposes other than
                those for which it was collected without obtaining your prior
                consent.
              </p>
            </div>
          </section>

          {/* Third-Party Sharing */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Third-Party Sharing
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We do not sell your personal information. We may share your data
                with trusted third-party service providers who assist in
                operating our business, including:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>
                  <strong className="text-foreground">Payment processors:</strong>{" "}
                  Cash App (Square) and PayPal for transaction processing
                </li>
                <li>
                  <strong className="text-foreground">Shipping carriers:</strong>{" "}
                  USPS and other carriers for order delivery
                </li>
                <li>
                  <strong className="text-foreground">Database and hosting providers:</strong>{" "}
                  Supabase for secure data storage
                </li>
                <li>
                  <strong className="text-foreground">Email service providers:</strong>{" "}
                  For transactional emails (order confirmations, shipping updates)
                </li>
                <li>
                  <strong className="text-foreground">Analytics providers:</strong>{" "}
                  To understand website traffic and improve user experience
                </li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                These providers are contractually bound to protect your
                information and may only use it to perform services on our
                behalf.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Cookies &amp; Tracking Technologies
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Our website uses cookies and similar tracking technologies to
                enhance your browsing experience, analyze site traffic, and
                support our marketing efforts. Cookies are small text files
                stored on your device by your web browser.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                You can control cookie preferences through your browser settings.
                Please note that disabling certain cookies may affect the
                functionality of our website.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Data Security
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These include encrypted connections (SSL/TLS) for data
                transmission, secure database storage through Supabase, and
                restricted access to personal data on a need-to-know basis.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to protect
                your data, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Data Retention
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We retain your personal information for as long as your account
                is active or as needed to provide you with our services. We will
                retain and use your information as necessary to comply with our
                legal obligations, resolve disputes, and enforce our agreements.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If you delete your account, your personal data will be removed
                from our active systems within a reasonable timeframe, subject
                to legal retention requirements.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Your Rights &amp; Choices
            </h2>

            <div className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                California Residents (CCPA)
              </h3>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If you are a California resident, you have the right to:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Request disclosure of the personal information we have collected about you</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of the sale of your personal information (we do not sell personal information)</li>
                <li>Non-discrimination for exercising your privacy rights</li>
              </ul>

              <h3 className="mt-6 font-heading text-lg font-semibold text-foreground">
                European Residents (GDPR)
              </h3>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If you are located in the European Economic Area, you have the
                right to:
              </p>

              <ul className="list-inside list-disc space-y-1 font-sans text-base leading-relaxed text-muted-foreground">
                <li>Access your personal data held by us</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request erasure of your data (right to be forgotten)</li>
                <li>Restrict or object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                To exercise any of these rights, please contact us at{" "}
                <span className="text-primary">support@lilywaistline.com</span>.
                We will respond to your request within the timeframe required by
                applicable law.
              </p>
            </div>
          </section>

          {/* Children */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Children&apos;s Privacy
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                Our website and services are not intended for individuals under
                the age of 18. We do not knowingly collect personal information
                from minors. If we become aware that we have collected personal
                information from a minor, we will take steps to delete that
                information promptly.
              </p>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Changes to This Policy
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated effective date. We
                encourage you to review this policy periodically for any
                changes.
              </p>

              <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                Last updated: May 2026
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Contact Us
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please reach out to us:
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
          </section>
        </div>
      </div>
    </div>
  );
}
