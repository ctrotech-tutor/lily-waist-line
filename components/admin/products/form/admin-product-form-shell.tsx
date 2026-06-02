"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateProduct, useUpdateProduct } from "@/hooks/admin/use-admin-products";
import { ROUTES } from "@/lib/constants/routes";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductPricing } from "./product-pricing";
import { ProductInventory } from "./product-inventory";
import { ProductVariants } from "./product-variants";
import { ProductMedia } from "./product-media";
import { ProductStatus } from "./product-status";
import { ProductFormActions } from "./product-form-actions";
import type { ProductImageEntry } from "@/types/media";

export interface ProductFormData {
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  sizes: string[];
  compressionLevels: string[];
  status: "draft" | "active" | "archived";
  images: ProductImageEntry[];
  removedImageIds: string[];
}

interface AdminProductFormShellProps {
  mode: "create" | "edit";
  productId?: string;
  initialData?: Partial<ProductFormData>;
  className?: string;
}

const defaultFormData: ProductFormData = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  price: "",
  compareAtPrice: "",
  stockQuantity: "",
  stockStatus: "in_stock",
  sizes: ["M"],
  compressionLevels: ["medium"],
  status: "draft",
  images: [],
  removedImageIds: [],
};

function mapSizes(sizes: string[]): ('XS' | 'S' | 'M' | 'L' | 'XL')[] {
  return sizes.filter(s => ['XS', 'S', 'M', 'L', 'XL'].includes(s.toUpperCase())) as ('XS' | 'S' | 'M' | 'L' | 'XL')[]
}

function mapCompression(levels: string[]): ('LIGHT' | 'MEDIUM' | 'HIGH')[] {
  return levels.filter(l => ['light', 'medium', 'high'].includes(l.toLowerCase())).map(l => l.toUpperCase() as 'LIGHT' | 'MEDIUM' | 'HIGH')
}

export function AdminProductFormShell({
  mode,
  productId,
  initialData,
  className,
}: AdminProductFormShellProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const isEditMode = mode === "edit";
  const isSubmitting = createProduct.isPending || updateProduct.isPending
  const pageTitle = isEditMode ? "Edit Product" : "Add New Product";
  const pageSubtitle = isEditMode
    ? "Update product details, pricing, and availability"
    : "Create a new product for your waist trainer catalog";

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditMode && productId) {
      const newImages = formData.images
        .filter(img => !img.existing)
        .map((img, i) => ({
          url: img.url,
          storagePath: img.storagePath,
          imageType: i === 0 ? 'main' as const : 'gallery' as const,
          sortOrder: formData.images.indexOf(img),
        }))

      const result = await updateProduct.mutateAsync({
        productId,
        name: formData.name,
        shortDescription: formData.shortDescription || undefined,
        description: formData.fullDescription || undefined,
        basePrice: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        status: formData.status.toUpperCase() as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
        imageUrls: newImages,
        imageIdsToRemove: formData.removedImageIds,
      })
      if (result) {
        setShowSuccess(true)
      }
    } else {
      const result = await createProduct.mutateAsync({
        name: formData.name,
        shortDescription: formData.shortDescription || '',
        description: formData.fullDescription || '',
        basePrice: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        sizes: mapSizes(formData.sizes),
        compressionLevels: mapCompression(formData.compressionLevels),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        status: formData.status.toUpperCase() as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
        imageUrls: formData.images.map((img, i) => ({
          url: img.url,
          storagePath: img.storagePath,
          imageType: i === 0 ? 'main' : 'gallery' as const,
          sortOrder: i,
        })),
      })
      if (result) {
        setShowSuccess(true)
      }
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.ADMIN_PRODUCTS);
  };

  const updateFormData = (field: keyof ProductFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto", className)}>
      {/* Page Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="text-muted-foreground hover:text-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-sans text-xs uppercase tracking-wider font-semibold">
            Back to Products
          </span>
        </Button>

        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 border border-secondary/30 flex items-center justify-center bg-secondary/5">
              <Package className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-2">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg">
              {pageSubtitle}
            </p>
            {isEditMode && productId && (
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Product ID: {productId}
              </p>
            )}
          </div>
        </div>

        <div className="w-16 h-px bg-secondary mt-6" />
      </div>

      <Card className="border border-border bg-card">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-16 h-16 border border-secondary flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="font-[family-name:var(--font-bodoni-moda)] text-xl md:text-2xl text-foreground mb-2">
              Product {isEditMode ? "Updated" : "Created"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Your product has been {isEditMode ? "updated" : "created"} successfully.
              Changes will be reflected in the storefront.
            </p>
            <Button
              onClick={handleCancel}
              className="mt-6 bg-secondary text-foreground hover:bg-secondary/90 text-xs uppercase tracking-wider transition-all duration-300"
            >
              Return to Products
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="divide-y divide-border">
            <div className="p-6 sm:p-8">
              <ProductBasicInfo
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            <div className="p-6 sm:p-8">
              <ProductPricing
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            <div className="p-6 sm:p-8">
              <ProductInventory
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            <div className="p-6 sm:p-8">
              <ProductVariants
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            <div className="p-6 sm:p-8">
              <ProductMedia
                data={formData}
                onChange={updateFormData}
                productId={isEditMode ? productId : undefined}
              />
            </div>

            <div className="p-6 sm:p-8">
              <ProductStatus
                data={formData}
                onChange={updateFormData}
              />
            </div>

            <div className="p-6 sm:p-8 bg-muted/30">
              <ProductFormActions
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
                onCancel={handleCancel}
              />
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
