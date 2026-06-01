import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductDescription } from "@/components/product/product-description";
import { ProductRelatedProducts } from "@/components/product/product-related-products";
import { ProductGallery } from "@/components/product/product-gallery";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { productSchema } from "@/components/seo/structured-data";

import { getProductBySlug } from "@/server/actions/products";
import type { ProductWithDetails } from "@/lib/services";
import { getAppUrl } from "@/lib/utils/app-url";
import { ROUTES } from "@/lib/constants/routes";

const baseUrl = getAppUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;

  const productResult = await getProductBySlug(slug);
  const product = productResult.success ? productResult.data : null;

  if (!product) {
    return {
      title: "Product | Lily Waist Line",
    };
  }

  const productUrl = `${baseUrl}/product/${id}/${slug}`;
  const imageUrl = product.images?.[0]?.url;

  return {
    title: `${product.name} | Lily Waist Line`,
    description:
      product.description ||
      product.shortDescription ||
      "Luxury waist trainers",
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | Lily Waist Line`,
      description:
        product.description ||
        product.shortDescription ||
        "Luxury waist trainers",
      url: productUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 1200,
              alt: product.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Lily Waist Line`,
      description:
        product.description ||
        product.shortDescription ||
        "Luxury waist trainers",
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { slug } = await params;

  let product: ProductWithDetails | null;

  try {
    const productResult = await getProductBySlug(slug);
    product = productResult.success ? productResult.data : null;
  } catch {
    notFound();
  }

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Breadcrumb */}
      <section className="mx-auto max-w-7xl px-4 pt-4 md:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Shop", href: ROUTES.SHOP },
            { label: product.name },
          ]}
        />
      </section>

      {/* JSON-LD Product Schema */}
      <JsonLd
        data={productSchema({
          name: product.name,
          description: product.description || product.shortDescription || "",
          url: `${baseUrl}/product/${product.id}/${slug}`,
          imageUrl: product.images?.[0]?.url || `${baseUrl}/og-img.jpg`,
          price: product.basePrice,
          sku: product.variants?.[0]?.sku,
          availability: product.inStock ? "InStock" : "OutOfStock",
        })}
      />

      {/* Gallery + Purchase Panel */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card p-5 md:p-8 lg:sticky lg:top-24">
              <ProductPurchasePanel product={product} />
            </div>
          </div>

        </div>
      </section>

      {/* Full Description */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
        <ProductDescription
          description={product.description}
          productName={product.name}
        />
      </div>

      {/* Trust Benefits */}
      {/* <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
        <ProductTrustBenefitsSection />
      </div> */}

      {/* Related Products */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="w-full h-px bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
        <ProductRelatedProducts productId={product.id} />
      </div>

    </div>
  );
}