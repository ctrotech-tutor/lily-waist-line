import { HeroSection } from "@/components/home/hero-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedProductsSection />
      <WhyChooseSection />
      <NewsletterSection />
    </div>
  );
}
