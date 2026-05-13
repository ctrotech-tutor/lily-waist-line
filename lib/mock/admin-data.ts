// Centralized mock data for Lily Waist Line Admin System
// This is the single source of truth for all admin mock data

export interface MockOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: "pending_payment" | "paid" | "failed";
  fulfillmentStatus: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: MockOrderItem[];
  shippingAddress: MockAddress;
  paymentMethod: "cashapp" | "paypal";
  trackingNumber?: string;
  carrier?: string;
  shippedDate?: string;
  deliveredDate?: string;
}

export interface MockOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant: {
    size: string;
    compression: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  status: "active" | "draft" | "archived";
  category: string;
  images: string[];
  variants: {
    sizes: string[];
    compressionLevels: string[];
  };
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: "new" | "returning" | "vip";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  addresses: MockAddress[];
  createdAt: string;
}

export interface MockAddress {
  id: string;
  type: "shipping" | "billing";
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface MockShipping {
  orderId: string;
  orderNumber: string;
  customerName: string;
  status: "pending_shipment" | "shipped" | "delivered";
  carrier: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippedDate?: string;
  deliveredDate?: string;
}

// Mock Data Collections
export const mockOrders: MockOrder[] = [
  {
    id: "LWL-2026-001",
    customerId: "cust_001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    amount: 8900,
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    date: "2026-01-15",
    paymentMethod: "cashapp",
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    items: [
      {
        id: "item_001",
        productId: "prod_001",
        productName: "Lily Waist Sculptor Pro",
        productImage: "/img-p-1.png",
        variant: { size: "M", compression: "High" },
        quantity: 2,
        unitPrice: 4450,
        totalPrice: 8900,
      },
    ],
    shippingAddress: {
      id: "addr_001",
      type: "shipping",
      isDefault: true,
      firstName: "Sarah",
      lastName: "Johnson",
      address: "123 Fashion Avenue",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
  },
  {
    id: "LWL-2026-002",
    customerId: "cust_002",
    customerName: "Emily Chen",
    customerEmail: "emily.chen@email.com",
    amount: 4450,
    paymentStatus: "pending_payment",
    fulfillmentStatus: "processing",
    date: "2026-01-16",
    paymentMethod: "paypal",
    items: [
      {
        id: "item_002",
        productId: "prod_002",
        productName: "Lily Daily Comfort Waist",
        productImage: "/img-1.png",
        variant: { size: "S", compression: "Medium" },
        quantity: 1,
        unitPrice: 4450,
        totalPrice: 4450,
      },
    ],
    shippingAddress: {
      id: "addr_002",
      type: "shipping",
      isDefault: true,
      firstName: "Emily",
      lastName: "Chen",
      address: "456 Style Street",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
  },
  {
    id: "LWL-2026-003",
    customerId: "cust_003",
    customerName: "Maria Rodriguez",
    customerEmail: "maria.rodriguez@email.com",
    amount: 13350,
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    date: "2026-01-14",
    paymentMethod: "cashapp",
    trackingNumber: "1Z999AA10123456785",
    carrier: "FedEx",
    shippedDate: "2026-01-15",
    deliveredDate: "2026-01-17",
    items: [
      {
        id: "item_003",
        productId: "prod_001",
        productName: "Lily Waist Sculptor Pro",
        productImage: "/img-p-1.png",
        variant: { size: "L", compression: "High" },
        quantity: 3,
        unitPrice: 4450,
        totalPrice: 13350,
      },
    ],
    shippingAddress: {
      id: "addr_003",
      type: "shipping",
      isDefault: true,
      firstName: "Maria",
      lastName: "Rodriguez",
      address: "789 Beauty Boulevard",
      city: "Miami",
      state: "FL",
      postalCode: "33101",
      country: "United States",
      phone: "+1 (555) 456-7890",
    },
  },
  {
    id: "LWL-2026-004",
    customerId: "cust_004",
    customerName: "Jessica Taylor",
    customerEmail: "jessica.taylor@email.com",
    amount: 5900,
    paymentStatus: "failed",
    fulfillmentStatus: "cancelled",
    date: "2026-01-13",
    paymentMethod: "paypal",
    items: [
      {
        id: "item_004",
        productId: "prod_003",
        productName: "Lily Sport Compression Band",
        productImage: "/IMG_2805.PNG",
        variant: { size: "XS", compression: "Light" },
        quantity: 2,
        unitPrice: 2950,
        totalPrice: 5900,
      },
    ],
    shippingAddress: {
      id: "addr_004",
      type: "shipping",
      isDefault: true,
      firstName: "Jessica",
      lastName: "Taylor",
      address: "321 Wellness Way",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "United States",
      phone: "+1 (555) 234-5678",
    },
  },
];

export const mockProducts: MockProduct[] = [
  {
    id: "prod_001",
    name: "Lily Waist Sculptor Pro",
    slug: "lily-waist-sculptor-pro",
    tagline: "Professional-grade waist sculpting for maximum results",
    description: "Our most advanced waist sculpting technology, designed for serious transformation seekers.",
    price: 4450,
    compareAtPrice: 5900,
    sku: "LWL-PRO-001",
    stock: 15,
    status: "active",
    category: "Professional",
    images: ["/img-p-1.png", "/img-1.png"],
    variants: {
      sizes: ["XS", "S", "M", "L", "XL"],
      compressionLevels: ["Light", "Medium", "High"],
    },
    visibility: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-15",
  },
  {
    id: "prod_002",
    name: "Lily Daily Comfort Waist",
    slug: "lily-daily-comfort-waist",
    tagline: "Everyday comfort with gentle shaping",
    description: "Perfect for daily wear, providing comfortable support and subtle shaping.",
    price: 4450,
    sku: "LWL-DAILY-002",
    stock: 8,
    status: "active",
    category: "Daily Wear",
    images: ["/img-1.png"],
    variants: {
      sizes: ["XS", "S", "M", "L", "XL"],
      compressionLevels: ["Light", "Medium"],
    },
    visibility: true,
    createdAt: "2026-01-02",
    updatedAt: "2026-01-10",
  },
  {
    id: "prod_003",
    name: "Lily Sport Compression Band",
    slug: "lily-sport-compression-band",
    tagline: "Performance compression for active lifestyles",
    description: "Engineered for workouts and athletic activities, providing targeted compression.",
    price: 2950,
    compareAtPrice: 3900,
    sku: "LWL-SPORT-003",
    stock: 2,
    status: "active",
    category: "Sport",
    images: ["/IMG_2805.PNG"],
    variants: {
      sizes: ["XS", "S", "M", "L"],
      compressionLevels: ["Light", "Medium", "High"],
    },
    visibility: true,
    createdAt: "2026-01-03",
    updatedAt: "2026-01-12",
  },
  {
    id: "prod_004",
    name: "Lily Overnight Recovery Wrap",
    slug: "lily-overnight-recovery-wrap",
    tagline: "Gentle recovery while you sleep",
    description: "Soft, breathable material designed for overnight wear and recovery.",
    price: 3250,
    sku: "LWL-RECOVERY-004",
    stock: 0,
    status: "active",
    category: "Recovery",
    images: ["/auth-1.png"],
    variants: {
      sizes: ["S", "M", "L", "XL"],
      compressionLevels: ["Light"],
    },
    visibility: true,
    createdAt: "2026-01-04",
    updatedAt: "2026-01-08",
  },
];

export const mockCustomers: MockCustomer[] = [
  {
    id: "cust_001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    status: "vip",
    totalOrders: 5,
    totalSpent: 22300,
    lastOrderDate: "2026-01-15",
    addresses: [
      {
        id: "addr_001",
        type: "shipping",
        isDefault: true,
        firstName: "Sarah",
        lastName: "Johnson",
        address: "123 Fashion Avenue",
        apartment: "Apt 4B",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "United States",
        phone: "+1 (555) 123-4567",
      },
    ],
    createdAt: "2025-12-01",
  },
  {
    id: "cust_002",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@email.com",
    phone: "+1 (555) 987-6543",
    status: "returning",
    totalOrders: 2,
    totalSpent: 8900,
    lastOrderDate: "2026-01-16",
    addresses: [
      {
        id: "addr_002",
        type: "shipping",
        isDefault: true,
        firstName: "Emily",
        lastName: "Chen",
        address: "456 Style Street",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "United States",
        phone: "+1 (555) 987-6543",
      },
    ],
    createdAt: "2025-12-15",
  },
  {
    id: "cust_003",
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    status: "vip",
    totalOrders: 8,
    totalSpent: 35600,
    lastOrderDate: "2026-01-14",
    addresses: [
      {
        id: "addr_003",
        type: "shipping",
        isDefault: true,
        firstName: "Maria",
        lastName: "Rodriguez",
        address: "789 Beauty Boulevard",
        city: "Miami",
        state: "FL",
        postalCode: "33101",
        country: "United States",
        phone: "+1 (555) 456-7890",
      },
    ],
    createdAt: "2025-11-20",
  },
  {
    id: "cust_004",
    firstName: "Jessica",
    lastName: "Taylor",
    email: "jessica.taylor@email.com",
    phone: "+1 (555) 234-5678",
    status: "new",
    totalOrders: 1,
    totalSpent: 0,
    lastOrderDate: "2026-01-13",
    addresses: [
      {
        id: "addr_004",
        type: "shipping",
        isDefault: true,
        firstName: "Jessica",
        lastName: "Taylor",
        address: "321 Wellness Way",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "United States",
        phone: "+1 (555) 234-5678",
      },
    ],
    createdAt: "2026-01-10",
  },
];

export const mockShipping: MockShipping[] = [
  {
    orderId: "LWL-2026-001",
    orderNumber: "LWL-2026-001",
    customerName: "Sarah Johnson",
    status: "shipped",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: "2026-01-18",
    shippedDate: "2026-01-15",
  },
  {
    orderId: "LWL-2026-002",
    orderNumber: "LWL-2026-002",
    customerName: "Emily Chen",
    status: "pending_shipment",
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  },
  {
    orderId: "LWL-2026-003",
    orderNumber: "LWL-2026-003",
    customerName: "Maria Rodriguez",
    status: "delivered",
    carrier: "FedEx",
    trackingNumber: "1Z999AA10123456785",
    estimatedDelivery: "2026-01-17",
    shippedDate: "2026-01-15",
    deliveredDate: "2026-01-17",
  },
  {
    orderId: "LWL-2026-004",
    orderNumber: "LWL-2026-004",
    customerName: "Jessica Taylor",
    status: "pending_shipment",
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  },
];

// Helper functions for data manipulation
export const getMockOrderById = (id: string): MockOrder | undefined => {
  return mockOrders.find(order => order.id === id);
};

export const getMockCustomerById = (id: string): MockCustomer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getMockProductById = (id: string): MockProduct | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getMockShippingByOrderId = (orderId: string): MockShipping | undefined => {
  return mockShipping.find(shipping => shipping.orderId === orderId);
};

// Mock statistics for dashboard
export const mockDashboardStats = {
  totalOrders: mockOrders.length,
  totalRevenue: mockOrders.reduce((sum, order) => sum + order.amount, 0),
  pendingOrders: mockOrders.filter(order => order.paymentStatus === "pending_payment").length,
  shippedOrders: mockOrders.filter(order => order.fulfillmentStatus === "shipped").length,
  totalCustomers: mockCustomers.length,
  activeCustomers: mockCustomers.filter(customer => customer.status !== "new").length,
  totalProducts: mockProducts.length,
  lowStockProducts: mockProducts.filter(product => product.stock <= 3).length,
};
