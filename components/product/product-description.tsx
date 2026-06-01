import { cn } from "@/lib/utils";

interface ProductDescriptionProps {
  description: string;
  productName: string;
}

const qualityHighlights = [
  {
    label: "Premium Material",
    description: "Luxury-grade fabric engineered for durability and comfort",
  },
  {
    label: "Precision Fit",
    description: "Tailored compression zones for targeted sculpting",
  },
  {
    label: "Breathable Wear",
    description: "Moisture-wicking design for all-day comfort",
  },
];

export function ProductDescription({
  description,
  productName,
}: ProductDescriptionProps) {
  if (!description) return null;

  return (
    <section className="relative py-16 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
        {/* Left: Description */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow */}
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
            Product Details
          </span>

          {/* Heading */}
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-foreground leading-tight">
            About the {productName}
          </h2>

          {/* Gold accent line */}
          <div className="w-12 h-px bg-secondary/60" />

          {/* Description text */}
          <div className="space-y-4">
            {description.split("\n").filter(Boolean).map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right: Highlights */}
        <div className="lg:col-span-5">
          <div className={cn(
            "lg:sticky lg:top-24",
            "border border-border/50 bg-card/30",
            "p-8 md:p-10 rounded-2xl relative"
          )}>
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-secondary/40 to-transparent" />

            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="font-heading text-xl text-foreground">
                  Quality Highlights
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  What makes {productName} exceptional
                </p>
              </div>

              {/* Highlights list */}
              <div className="space-y-6">
                {qualityHighlights.map((item, index) => (
                  <div key={item.label} className="group space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 border border-secondary/30 text-secondary font-sans text-xs font-bold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-sans text-sm font-semibold text-foreground uppercase tracking-wider">
                        {item.label}
                      </h4>
                    </div>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed pl-9">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}