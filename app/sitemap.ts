import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils/app-url";

// Product URLs are loaded from the database at request time rather than during
// `next build`, so a temporary database outage cannot block a release.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();
  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, slug: true, updatedAt: true },
    });

    productEntries = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Keep the static, public URLs available if the catalog DB is temporarily
    // unreachable. Product URLs will appear again once the DB is healthy.
    console.error("Could not load products for sitemap:", error);
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.2 },
    ...productEntries,
  ];
}
