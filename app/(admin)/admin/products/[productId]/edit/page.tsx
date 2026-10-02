"use client";

import { useParams } from "next/navigation";
import { AdminProductFormShell, type ProductFormData } from "@/components/admin/products/form";
import { useAdminProduct } from "@/hooks/admin/use-admin-products";
import { Loader2 } from "lucide-react";
import type { ProductImageEntry } from "@/types/media";

function mapProductToFormData(product: {
  name: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  status: string;
  variants: { id: string; size: string; compressionLevel: string; stockQuantity: number; price?: number | null; images?: { id: string; url: string; storagePath: string; imageType: string; sortOrder: number }[] }[];
  images: { id: string; url: string; storagePath: string; imageType: string; sortOrder: number }[];
}): { formData: Partial<ProductFormData>; variantIdMap: Record<string, string> } {
  const uniqueSizes = [...new Set(product.variants.map(v => v.size))]
  const uniqueCompressions = [...new Set(product.variants.map(v => v.compressionLevel.toLowerCase()))]
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)

  // Extract per-size prices (first variant per size with a price override)
  const variantPrices: Record<string, string> = {}
  for (const size of uniqueSizes) {
    const variant = product.variants.find(v => v.size === size && v.price != null)
    if (variant?.price != null) {
      variantPrices[size] = variant.price.toString()
    }
  }

  let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock'
  if (totalStock === 0) stockStatus = 'out_of_stock'
  else if (totalStock <= 5) stockStatus = 'low_stock'

  const mainImg = product.images.find(i => i.imageType === 'main')
  const galleryImgs = product.images.filter(i => i.imageType !== 'main')

  // Group variant images by size (first image per size)
  const variantImages: Record<string, ProductImageEntry | null> = {}
  const variantIdMap: Record<string, string> = {}
  for (const variant of product.variants) {
    if (!variantIdMap[variant.size]) {
      variantIdMap[variant.size] = variant.id
    }
    if (!variantImages[variant.size] && variant.images && variant.images[0]) {
      variantImages[variant.size] = {
        id: variant.images[0].id,
        url: variant.images[0].url,
        storagePath: variant.images[0].storagePath,
        imageType: 'variant' as const,
        sortOrder: 0,
        existing: true,
      }
    }
  }

  return {
    formData: {
      name: product.name,
      shortDescription: product.shortDescription,
      fullDescription: product.description,
      price: product.basePrice.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      stockQuantity: totalStock.toString(),
      stockStatus,
      sizes: uniqueSizes,
      compressionLevels: uniqueCompressions,
      variantPrices,
      status: product.status.toLowerCase() as 'draft' | 'active' | 'archived',
      mainImage: mainImg ? {
        id: mainImg.id,
        url: mainImg.url,
        storagePath: mainImg.storagePath,
        imageType: 'main' as const,
        sortOrder: 0,
        existing: true,
      } : null,
      galleryImages: galleryImgs.map(i => ({
        id: i.id,
        url: i.url,
        storagePath: i.storagePath,
        imageType: 'gallery' as const,
        sortOrder: i.sortOrder,
        existing: true,
      })),
      variantImages,
      removedImageIds: [],
    },
    variantIdMap,
  }
}

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { data: product, isLoading, error } = useAdminProduct(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Product not found'}
        </p>
      </div>
    )
  }

  const { formData: initialData, variantIdMap } = mapProductToFormData(product)

  return (
    <div className="py-4">
      <AdminProductFormShell
        mode="edit"
        productId={productId}
        initialData={initialData}
        variantIdMap={variantIdMap}
      />
    </div>
  );
}
