export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface AdminProductVariantSummary {
  id: string;
  size: string;
  compressionLevel: string;
  sku: string;
  stockQuantity: number;
}

export interface AdminProductImageSummary {
  url: string;
  imageType: string;
  sortOrder: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  status: string;
  createdAt: Date;
  variants: AdminProductVariantSummary[];
  images: AdminProductImageSummary[];
  totalStock: number;
  stockStatus: StockStatus;
  variantCount: number;
  inStockCount: number;
  image: AdminProductImageSummary | null;
}

export type FilterStockStatus = "all" | StockStatus;
