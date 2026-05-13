"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductPricing } from "./product-pricing";
import { ProductInventory } from "./product-inventory";
import { ProductVariants } from "./product-variants";
import { ProductMedia } from "./product-media";
import { ProductStatus } from "./product-status";
import { ProductFormActions } from "./product-form-actions";

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
  images: string[];
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
};

export function AdminProductFormShell({
  mode,
  productId,
  initialData,
  className,
}: AdminProductFormShellProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = mode === "edit";
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

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Hide success after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const updateFormData = (field: keyof ProductFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
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
        {/* Back Link */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-muted-foreground hover:text-[#d4af37] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-xs uppercase tracking-wider font-semibold">
            Back to Products
          </span>
        </button>

        {/* Title Section */}
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 border border-[#d4af37]/30 flex items-center justify-center bg-[#d4af37]/5">
              <Package className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-bodoni)] text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-2">
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

        {/* Gold Divider */}
        <div className="w-16 h-px bg-[#d4af37] mt-6" />
      </div>

      {/* Form Card */}
      <Card className="border border-border bg-card">
        {showSuccess ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-16 h-16 border border-[#d4af37] flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h2 className="font-[family-name:var(--font-bodoni)] text-xl md:text-2xl text-foreground mb-2">
              Product {isEditMode ? "Updated" : "Created"}
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Your product has been {isEditMode ? "updated" : "created"} successfully.
              Changes will be reflected in the storefront.
            </p>
            <Button
              onClick={handleCancel}
              className="mt-6 bg-[#d4af37] text-black hover:bg-[#d4af37]/90 text-xs uppercase tracking-wider rounded-none transition-all duration-300"
            >
              Return to Products
            </Button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="divide-y divide-border">
            {/* Basic Info Section */}
            <div className="p-6 sm:p-8">
              <ProductBasicInfo
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            {/* Pricing Section */}
            <div className="p-6 sm:p-8">
              <ProductPricing
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            {/* Inventory Section */}
            <div className="p-6 sm:p-8">
              <ProductInventory
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            {/* Variants Section */}
            <div className="p-6 sm:p-8">
              <ProductVariants
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </div>

            {/* Media Section */}
            <div className="p-6 sm:p-8">
              <ProductMedia
                data={formData}
                onChange={updateFormData}
              />
            </div>

            {/* Status Section */}
            <div className="p-6 sm:p-8">
              <ProductStatus
                data={formData}
                onChange={updateFormData}
              />
            </div>

            {/* Actions Section */}
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
