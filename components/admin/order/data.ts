export type PaymentStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "cashapp" | "paypal";
export type FulfillmentStatus = "processing" | "shipped" | "delivered";

export interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentProof {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  previewUrl: string;
}

export interface OrderDetails {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  paymentProof?: PaymentProof;
  carrierName?: string;
  trackingNumber?: string;
}

export const mockOrderDetails: Record<string, OrderDetails> = {
  "LWL-2026-001": {
    id: "LWL-2026-001",
    date: "2026-05-11",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    paymentStatus: "pending",
    paymentMethod: "cashapp",
    fulfillmentStatus: "processing",
    items: [
      {
        id: "item-1",
        productName: "Core Sculptor Waist Trainer",
        productImage: "/img-1.png",
        variant: "Medium / High Compression",
        quantity: 1,
        price: 89.99,
      },
      {
        id: "item-2",
        productName: "Hourglass Shaper",
        productImage: "/img-p-1.png",
        variant: "Small / Medium Compression",
        quantity: 1,
        price: 59.99,
      },
    ],
    shippingAddress: {
      fullName: "Sarah Johnson",
      street: "123 Elegance Avenue, Apt 4B",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    subtotal: 149.98,
    shipping: 10.0,
    total: 159.98,
    paymentProof: {
      id: "proof-1",
      fileName: "payment_screenshot.jpg",
      fileSize: "2.4 MB",
      uploadedAt: "2026-05-11 14:32",
      previewUrl: "/img-1.png",
    },
  },
  "LWL-2026-002": {
    id: "LWL-2026-002",
    date: "2026-05-10",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    paymentStatus: "verified",
    paymentMethod: "paypal",
    fulfillmentStatus: "shipped",
    items: [
      {
        id: "item-3",
        productName: "Posture Perfect Corset",
        productImage: "/img-p-1.png",
        variant: "Large / Light Compression",
        quantity: 1,
        price: 89.5,
      },
    ],
    shippingAddress: {
      fullName: "Emily Davis",
      street: "456 Transformation Blvd",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
    subtotal: 89.5,
    shipping: 10.0,
    total: 99.5,
    carrierName: "FedEx",
    trackingNumber: "7845123690123456",
  },
  "LWL-2026-003": {
    id: "LWL-2026-003",
    date: "2026-05-09",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@email.com",
    paymentStatus: "verified",
    paymentMethod: "cashapp",
    fulfillmentStatus: "delivered",
    items: [
      {
        id: "item-4",
        productName: "Core Sculptor Waist Trainer",
        productImage: "/img-1.png",
        variant: "Small / High Compression",
        quantity: 2,
        price: 89.99,
      },
      {
        id: "item-5",
        productName: "Daily Comfort Shaper",
        productImage: "/img-p-1.png",
        variant: "Medium / Light Compression",
        quantity: 1,
        price: 54.0,
      },
    ],
    shippingAddress: {
      fullName: "Maria Garcia",
      street: "789 Confidence Street",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "United States",
      phone: "+1 (555) 456-7890",
    },
    subtotal: 233.98,
    shipping: 0,
    total: 233.98,
    carrierName: "UPS",
    trackingNumber: "1Z999AA1234567890",
  },
  "LWL-2026-005": {
    id: "LWL-2026-005",
    date: "2026-05-08",
    customerName: "Amanda Brown",
    customerEmail: "amanda.brown@email.com",
    paymentStatus: "pending",
    paymentMethod: "paypal",
    fulfillmentStatus: "processing",
    items: [
      {
        id: "item-6",
        productName: "Elite Waist Trainer Pro",
        productImage: "/img-1.png",
        variant: "Medium / High Compression",
        quantity: 2,
        price: 94.5,
      },
    ],
    shippingAddress: {
      fullName: "Amanda Brown",
      street: "321 Luxury Lane",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
      phone: "+1 (555) 789-0123",
    },
    subtotal: 189.0,
    shipping: 10.0,
    total: 199.0,
  },
};

export function getOrderById(orderId: string): OrderDetails | undefined {
  return mockOrderDetails[orderId];
}
