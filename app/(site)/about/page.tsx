import type { Metadata } from "next";
import { Sparkles, Shield, Heart, Target } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "About | Lily Waist Line",
  description:
    "Discover the story behind Lily Waist Line — premium waist trainers and sculptwear crafted for women who embrace discipline, confidence, and transformation.",
  alternates: {
    canonical: ROUTES.ABOUT,
  },
};

const values = [
  {
    icon: Target,
    title: "Precision Craftsmanship",
    description:
      "Every waist trainer is engineered with meticulous attention to detail, using premium materials selected for durability, comfort, and sculpting performance.",
  },
  {
    icon: Heart,
    title: "Confidence Through Design",
    description:
      "We believe true transformation begins within. Our products are designed not just to shape your silhouette, but to empower your self-assurance.",
  },
  {
    icon: Shield,
    title: "Uncompromising Quality",
    description:
      "From material sourcing to final stitching, each piece undergoes rigorous quality inspection to ensure it meets our luxury standards.",
  },
];

export default function AboutPage() {
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
                Our Story
              </span>
            </div>

            {/* Gold Divider */}
            <div className="mb-8 h-px w-16 bg-primary" />

            {/* Heading */}
            <h1 className="mb-6 max-w-2xl font-heading text-3xl leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Sculpted by Discipline, Defined by Confidence
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              Lily Waist Line was born from a singular vision: to create premium
              sculptwear that honors the strength, dedication, and elegance of
              every woman.
            </p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 xl:px-20 md:py-12">
        {/* Mission Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-heading text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
              Our Mission
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                Lily Waist Line is a premium women&apos;s sculptwear brand built
                on the belief that transformation is both an art and a
                discipline. We craft waist trainers and shapewear for women who
                refuse to compromise between luxury and performance.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                Our name draws inspiration from the lily — a flower that blooms
                with grace and resilience — and the waistline, the focal point
                of feminine strength and silhouette. Together, they represent
                our commitment to helping every woman sculpt her best self.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                Every product in our collection is designed with the modern
                woman in mind: the athlete, the professional, the mother, the
                visionary. We combine anatomical precision with editorial
                elegance, ensuring that you feel as powerful as you look.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mb-16 h-px w-full bg-linear-to-r from-transparent via-border to-transparent md:mb-20 lg:mb-24" />

        {/* Values Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 font-heading text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
              What We Stand For
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/80"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    </div>

                    <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>

                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mb-16 h-px w-full bg-linear-to-r from-transparent via-border to-transparent md:mb-20 lg:mb-24" />

        {/* Craft Section */}
        <section className="mb-16 md:mb-20 lg:mb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-heading text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
              The Lily Difference
            </h2>

            <div className="space-y-4">
              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                Unlike mass-produced shapewear, every Lily Waist Line piece is
                thoughtfully developed with input from fitness professionals and
                wear-testers. Our fabrics are selected for four-way stretch,
                breathability, and compression consistency — because true
                sculpting requires both support and comfort.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                We maintain strict quality standards across every stage of
                production, from fabric sourcing to final inspection. Each
                garment is designed to hold its shape wear after wear,
                delivering reliable results you can depend on.
              </p>

              <p className="font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                This is more than apparel. It is a commitment to your
                transformation journey — crafted with care, backed by integrity,
                and delivered with the premium experience you deserve.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
