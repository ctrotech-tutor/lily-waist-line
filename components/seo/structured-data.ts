type Schema = Record<string, unknown>;

export function organizationSchema(baseUrl: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lily Waist Line",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    sameAs: [
      "https://instagram.com/lilywaistline",
      "https://facebook.com/lilywaistline",
      "https://pinterest.com/lilywaistline",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "support@lilywaistline.com",
      },
    ],
  };
}

export function websiteSchema(baseUrl: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lily Waist Line",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface ProductSchemaInput {
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

export function productSchema(product: ProductSchemaInput): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.imageUrl,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Lily Waist Line",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "USD",
      availability: `https://schema.org/${product.availability || "InStock"}`,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}