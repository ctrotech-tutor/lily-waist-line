"use client";

import { useParams } from "next/navigation";
import { AdminProductFormShell, type ProductFormData } from "@/components/admin/products/form";

// Mock data for edit mode demonstration
const MOCK_PRODUCT_DATA: Record<string, Partial<ProductFormData>> = {
  "prod-1": {
    name: "Classic Waist Trainer",
    shortDescription: "Everyday sculpting with comfort",
    fullDescription: "Our signature waist trainer designed for everyday wear. Features breathable fabric, flexible boning, and a seamless finish that sculpts your waist while remaining comfortable for all-day use.",
    price: "89.99",
    compareAtPrice: "120.00",
    stockQuantity: "45",
    stockStatus: "in_stock",
    sizes: ["XS", "S", "M", "L", "XL"],
    compressionLevels: ["light", "medium"],
    status: "active",
    images: ["/img-1.png", "/img-p-1.png"],
  },
};

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;

  // Get mock data or use defaults
  const initialData = MOCK_PRODUCT_DATA[productId] || {
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
