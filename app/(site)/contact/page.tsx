import type { Metadata } from "next";
import { Sparkles, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { SITE_EMAIL, SITE_SOCIAL_LINKS } from "@/lib/constants/socials";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/shared/social-icons";

export const metadata: Metadata = {
  title: "Contact | Lily Waist Line",
  description:
    "Get in touch with the Lily Waist Line team. We're here to help with orders, sizing questions, and product inquiries.",
  alternates: {
    canonical: ROUTES.CONTACT,
  },
};

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description:
      "Send us a message anytime and we'll respond within 24 hours.",
    detail: SITE_EMAIL,
    href: `mailto:${SITE_EMAIL}`,
  },
  {
    icon: FacebookIcon,
    title: "Facebook",
    description:
      "Follow us on Facebook for updates, launches, and community stories.",
    detail: "Lily Waist Line",
    href: SITE_SOCIAL_LINKS.facebook,
  },
  {
    icon: InstagramIcon,
    title: "Instagram",
    description:
      "Follow our journey on Instagram for styling inspiration and exclusive previews.",
    detail: "@lily.waistline",
    href: SITE_SOCIAL_LINKS.instagram,
  },
  {
    icon: TikTokIcon,
    title: "TikTok",
    description:
      "Join us on TikTok for fitness tips, behind-the-scenes, and transformation stories.",
    detail: "@lilywaistline",
    href: SITE_SOCIAL_LINKS.tiktok,
  },
];

const faqs = [
  {
    question: "How do I find my correct size?",
    answer:
      "Refer to our size guide available on each product page. For personalized assistance, email us with your measurements and we'll recommend the best fit.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 2-3 business days. US delivery takes 2-4 business days after processing. International delivery varies by destination.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery for unworn, unwashed items in original packaging with tags attached. See our Returns Policy for full details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship internationally via PayPal. International delivery times and rates vary by destination and are calculated at checkout.",
  },
];

export default function ContactPage() {
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
                Get In Touch
              </span>
            </div>

            {/* Gold Divider */}
            <div className="mb-8 h-px w-16 bg-primary" />

            {/* Heading */}
            <h1 className="mb-6 max-w-2xl font-heading text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              We&apos;re Here to Help
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you need sizing guidance, order assistance, or simply want
              to learn more about our collection — our team is ready to support
              your transformation journey.
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 xl:px-20 md:py-12">
        {/* Contact Channels */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {supportChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <Link
                    key={channel.title}
                    href={channel.href}
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={cn(
                      "group rounded-2xl border border-border bg-card p-6 transition-all duration-300",
                      "hover:border-primary/30 hover:bg-card/80"
                    )}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    </div>

                    <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
                      {channel.title}
                    </h2>

                    <p className="mb-3 font-sans text-sm leading-relaxed text-muted-foreground">
                      {channel.description}
                    </p>

                    <span className="font-sans text-sm font-medium text-primary">
                      {channel.detail} →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                <Clock className="h-4 w-4 text-primary" strokeWidth={1.5} />
              </div>

              <div>
                <h2 className="mb-2 font-heading text-xl font-semibold text-foreground">
                  Business Hours
                </h2>

                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  Our team is available Monday through Friday, 9:00 AM – 6:00 PM EST.
                  Email inquiries are typically answered within 24 hours during
                  business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mb-16 h-px w-full bg-linear-to-r from-transparent via-border to-transparent md:mb-20 lg:mb-24" />

        {/* FAQ Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 font-heading text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
              Quick Answers
            </h2>

            <div className="grid gap-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30"
                >
                  <h3 className="mb-3 font-heading text-base font-semibold text-foreground md:text-lg">
                    {faq.question}
                  </h3>

                  <p className="font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
