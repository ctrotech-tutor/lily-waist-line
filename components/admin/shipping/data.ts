export type ShippingStatus = "processing" | "shipped" | "delivered";
export type Carrier = "USPS" | "DHL" | "FedEx" | "UPS" | null;

export interface ShippingOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: ShippingStatus;
  carrier: Carrier;
  trackingNumber: string | null;
  orderDate: string;
  shippedDate: string | null;
  deliveredDate: string | null;
  itemCount: number;
  total: number;
}

export const mockShippingOrders: ShippingOrder[] = [
  {
    id: "LWL-2026-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    status: "processing",
    carrier: null,
    trackingNumber: null,
    orderDate: "2026-05-11",
    shippedDate: null,
    deliveredDate: null,
    itemCount: 2,
    total: 149.99,
  },
  {
    id: "LWL-2026-004",
    customerName: "Jessica Wilson",
    customerEmail: "jessica.w@email.com",
    status: "processing",
    carrier: null,
    trackingNumber: null,
    orderDate: "2026-05-09",
    shippedDate: null,
    deliveredDate: null,
    itemCount: 1,
    total: 67.99,
  },
  {
    id: "LWL-2026-005",
    customerName: "Amanda Brown",
    customerEmail: "amanda.brown@email.com",
    status: "processing",
    carrier: null,
    trackingNumber: null,
    orderDate: "2026-05-08",
    shippedDate: null,
    deliveredDate: null,
    itemCount: 2,
    total: 189.00,
  },
  {
    id: "LWL-2026-008",
    customerName: "Michelle Chen",
    customerEmail: "michelle.chen@email.com",
    status: "processing",
    carrier: null,
    trackingNumber: null,
    orderDate: "2026-05-07",
    shippedDate: null,
    deliveredDate: null,
    itemCount: 1,
    total: 78.00,
  },
  {
    id: "LWL-2026-002",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    status: "shipped",
    carrier: "USPS",
    trackingNumber: "9400111899562917000001",
    orderDate: "2026-05-10",
    shippedDate: "2026-05-11",
    deliveredDate: null,
    itemCount: 1,
    total: 89.50,
  },
  {
    id: "LWL-2026-007",
    customerName: "Rachel Taylor",
    customerEmail: "rachel.t@email.com",
    status: "shipped",
    carrier: "FedEx",
    trackingNumber: "784512369852",
    orderDate: "2026-05-07",
    shippedDate: "2026-05-09",
    deliveredDate: null,
    itemCount: 2,
    total: 156.50,
  },
  {
    id: "LWL-2026-003",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@email.com",
    status: "delivered",
    carrier: "DHL",
    trackingNumber: "1234567890",
    orderDate: "2026-05-09",
    shippedDate: "2026-05-10",
    deliveredDate: "2026-05-11",
    itemCount: 3,
    total: 234.00,
  },
  {
    id: "LWL-2026-009",
    customerName: "Lauren Martinez",
    customerEmail: "lauren.m@email.com",
    status: "delivered",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    orderDate: "2026-05-06",
    shippedDate: "2026-05-07",
    deliveredDate: "2026-05-09",
    itemCount: 2,
    total: 178.00,
  },
  {
    id: "LWL-2026-010",
    customerName: "Sophie Anderson",
    customerEmail: "sophie.a@email.com",
    status: "delivered",
    carrier: "USPS",
    trackingNumber: "9400111899562917000002",
    orderDate: "2026-05-05",
    shippedDate: "2026-05-06",
    deliveredDate: "2026-05-08",
    itemCount: 1,
    total: 95.00,
  },
];

export interface ShippingStats {
  pendingShipment: number;
  shipped: number;
  delivered: number;
}

export function calculateShippingStats(orders: ShippingOrder[]): ShippingStats {
  return {
    pendingShipment: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };
}
