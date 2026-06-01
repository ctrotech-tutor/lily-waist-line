"use client";

import { useParams } from "next/navigation";
import { AdminProductFormShell, type ProductFormData } from "@/components/admin/products/form";
import { useAdminProduct } from "@/hooks/admin/use-admin-products";
import { Loader2 } from "lucide-react";

function mapProductToFormData(product: {
  name: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  status: string;
  variants: { size: string; compressionLevel: string; stockQuantity: number }[];
  images: { url: string }[];
}): Partial<ProductFormData> {
  const uniqueSizes = [...new Set(product.variants.map(v => v.size))]
  const uniqueCompressions = [...new Set(product.variants.map(v => v.compressionLevel.toLowerCase()))]
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0)

  let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock'
  if (totalStock === 0) stockStatus = 'out_of_stock'
  else if (totalStock <= 5) stockStatus = 'low_stock'

  return {
    name: product.name,
    shortDescription: product.shortDescription,
    fullDescription: product.description,
    price: product.basePrice.toString(),
    compareAtPrice: product.compareAtPrice?.toString() || '',
    stockQuantity: totalStock.toString(),
    stockStatus,
    sizes: uniqueSizes,
    compressionLevels: uniqueCompressions,
    status: product.status.toLowerCase() as 'draft' | 'active' | 'archived',
    images: product.images.map(i => i.url),
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

  const initialData = mapProductToFormData(product)

  return (
    <div className="py-4">
      <AdminProductFormShell
        mode="edit"
        productId={productId}
        initialData={initialData}
      />
    </div>
  );
}
