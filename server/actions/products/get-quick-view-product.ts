"use server";

import prisma from "@/lib/prisma";
import { releaseExpiredInventoryReservations } from "@/lib/services/inventory-reservations";
import { tryAction } from "@/lib/security/error-handling";

export const getQuickViewProduct = tryAction(async (id: string) => {
  await releaseExpiredInventoryReservations()

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      basePrice: true,
      compareAtPrice: true,
      images: {
        select: { url: true, altText: true },
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        select: {
          id: true,
          size: true,
          compressionLevel: true,
          price: true,
          stockQuantity: true,
          images: {
            select: { url: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    ...product,
    basePrice: Number(product.basePrice),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price ? Number(v.price) : null,
    })),
  };
});
