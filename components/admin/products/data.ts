export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stockStatus: StockStatus;
  stockQuantity: number;
  category: string;
  isVisible: boolean;
  image: string;
  createdAt: string;
}

export const mockAdminProducts: AdminProduct[] = [
  {
    id: "1",
    name: "Classic Sculpt Waist Trainer",
    sku: "LWL-WS-001",
    price: 89.99,
    originalPrice: 119.99,
    stockStatus: "in-stock",
    stockQuantity: 45,
    category: "Waist Trainers",
    isVisible: true,
    image: "/img-p-1.png",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Core Fit Waist Trainer",
    sku: "LWL-WS-002",
    price: 79.99,
    stockStatus: "in-stock",
    stockQuantity: 32,
    category: "Waist Trainers",
    isVisible: true,
    image: "/img-p-2.png",
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    name: "Elite Shape Waist Trainer",
    sku: "LWL-WS-003",
    price: 129.99,
    originalPrice: 159.99,
    stockStatus: "low-stock",
    stockQuantity: 8,
    category: "Premium Collection",
    isVisible: true,
    image: "/img-p-3.png",
    createdAt: "2026-02-01",
  },
  {
    id: "4",
    name: "Signature Sculpt Collection",
    sku: "LWL-WS-004",
    price: 149.99,
    stockStatus: "in-stock",
    stockQuantity: 22,
    category: "Limited Edition",
    isVisible: true,
    image: "/img-p-1.png",
    createdAt: "2026-02-10",
  },
  {
    id: "5",
    name: "Daily Comfort Waist Trainer",
    sku: "LWL-WS-005",
    price: 69.99,
    stockStatus: "in-stock",
    stockQuantity: 56,
    category: "Waist Trainers",
    isVisible: true,
    image: "/img-p-2.png",
    createdAt: "2026-02-15",
  },
  {
    id: "6",
    name: "Power Compression Corset",
    sku: "LWL-WS-006",
    price: 99.99,
    originalPrice: 129.99,
    stockStatus: "out-of-stock",
    stockQuantity: 0,
    category: "Corsets",
    isVisible: false,
    image: "/img-p-3.png",
    createdAt: "2026-02-20",
  },
  {
    id: "7",
    name: "SportFlex Waist Trainer",
    sku: "LWL-WS-007",
    price: 84.99,
    stockStatus: "in-stock",
    stockQuantity: 38,
    category: "Active Wear",
    isVisible: true,
    image: "/img-p-1.png",
    createdAt: "2026-03-01",
  },
  {
    id: "8",
    name: "Luxe Gold Edition Trainer",
    sku: "LWL-WS-008",
    price: 189.99,
    stockStatus: "low-stock",
    stockQuantity: 5,
    category: "Premium Collection",
    isVisible: true,
    image: "/img-p-2.png",
    createdAt: "2026-03-05",
  },
];

export type FilterStockStatus = "all" | StockStatus;
