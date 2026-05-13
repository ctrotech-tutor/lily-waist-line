export type CustomerStatus = "new" | "returning" | "vip";

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: CustomerStatus;
  lastOrderDate: string;
}

export const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    totalOrders: 1,
    totalSpent: 89.99,
    status: "new",
    lastOrderDate: "May 11, 2026",
  },
  {
    id: "cust_002",
    name: "Michael Chen",
    email: "mchen@email.com",
    totalOrders: 3,
    totalSpent: 267.50,
    status: "returning",
    lastOrderDate: "May 10, 2026",
  },
  {
    id: "cust_003",
    name: "Emily Williams",
    email: "emily.w@email.com",
    totalOrders: 8,
    totalSpent: 1245.00,
    status: "vip",
    lastOrderDate: "May 9, 2026",
  },
  {
    id: "cust_004",
    name: "James Rodriguez",
    email: "j.rodriguez@email.com",
    totalOrders: 2,
    totalSpent: 178.00,
    status: "returning",
    lastOrderDate: "May 8, 2026",
  },
  {
    id: "cust_005",
    name: "Amanda Foster",
    email: "afoster@email.com",
    totalOrders: 12,
    totalSpent: 2156.75,
    status: "vip",
    lastOrderDate: "May 7, 2026",
  },
  {
    id: "cust_006",
    name: "David Park",
    email: "dpark@email.com",
    totalOrders: 1,
    totalSpent: 129.99,
    status: "new",
    lastOrderDate: "May 6, 2026",
  },
  {
    id: "cust_007",
    name: "Jessica Martinez",
    email: "j.martinez@email.com",
    totalOrders: 5,
    totalSpent: 567.25,
    status: "returning",
    lastOrderDate: "May 5, 2026",
  },
  {
    id: "cust_008",
    name: "Robert Taylor",
    email: "rtaylor@email.com",
    totalOrders: 15,
    totalSpent: 3450.00,
    status: "vip",
    lastOrderDate: "May 4, 2026",
  },
];
