"use client";

import { ProductCard } from "./product-card";

const mockProducts = [
  {
    id: "1",
    image: "/products/waist-trainer-classic.jpg",
    name: "Classic Hourglass Waist Trainer",
    subtitle: "Steel-boned shaping for everyday wear",
    price: 49.99,
    originalPrice: 69.99,
    badge: "Best Seller",
    stockState: "in-stock" as const,
    isWishlisted: false,
  },
  {
    id: "2",
    image: "/products/waist-trainer-latex.jpg",
    name: "Latex Performance Trainer",
    subtitle: "Maximum compression for workouts",
    price: 59.99,
    badge: "New Arrival",
    stockState: "in-stock" as const,
    isWishlisted: true,
  },
  {
    id: "3",
    image: "/products/waist-trainer-velcro.jpg",
    name: "Adjustable Velcro Trainer",
    subtitle: "Custom fit with velcro closure",
    price: 39.99,
    originalPrice: 54.99,
    stockState: "low-stock" as const,
    isWishlisted: false,
  },
  {
    id: "4",
    image: "/products/waist-trainer-luxe.jpg",
    name: "Luxe Gold Edition Trainer",
    subtitle: "Premium materials, signature gold accents",
    price: 89.99,
    badge: "Limited",
    stockState: "out-of-stock" as const,
    isWishlisted: false,
  },
  {
    id: "5",
    image: "/products/body-shaper-bodysuit.jpg",
    name: "Full Body Shaper Bodysuit",
    subtitle: "Seamless all-over smoothing",
    price: 74.99,
    originalPrice: 99.99,
    stockState: "in-stock" as const,
    isWishlisted: false,
  },
  {
    id: "6",
    image: "/products/thigh-trimmer.jpg",
    name: "Neoprene Thigh Trimmer",
    subtitle: "Targeted compression for thighs",
    price: 29.99,
    stockState: "in-stock" as const,
    isWishlisted: false,
  },
];

export function ProductCardDemo() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-360 mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Featured Products
          </h2>
          <p className="font-sans text-muted-foreground max-w-xl mx-auto">
            Discover our collection of premium waist trainers and shapewear designed for transformation
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCardDemo;
