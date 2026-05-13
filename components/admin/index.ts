export { AdminShell } from "./admin-shell";
export { AdminSidebar } from "./admin-sidebar";
export { AdminTopbar } from "./admin-topbar";
export { AdminMobileNav } from "./admin-mobile-nav";

// Admin Overview Components
export { AdminOverviewHeader } from "./overview/admin-overview-header";
export { AdminKPICards } from "./overview/admin-kpi-cards";
export { RecentOrders } from "./overview/recent-orders";
export { AdminQuickActions } from "./overview/admin-quick-actions";
export { AdminAlerts } from "./overview/admin-alerts";

// Admin Orders Components
export {
  AdminOrdersHeader,
  AdminOrdersFilters,
  AdminOrdersTable,
  AdminOrdersEmpty,
  type FilterStatus,
  type AdminOrder,
  type PaymentStatus,
  type FulfillmentStatus,
} from "./orders";

// Admin Order Detail Components
export {
  AdminOrderHeader,
  AdminPaymentReview,
  AdminOrderItems,
  AdminCustomerInfo,
  AdminFulfillmentPanel,
  AdminOrderAlerts,
  getOrderById,
  mockOrderDetails,
  type OrderDetails,
  type OrderItem,
  type ShippingAddress,
  type PaymentProof,
} from "./order";

// Admin Products Components
export {
  AdminProductsHeader,
  AdminProductsControls,
  AdminProductsTable,
  AdminProductsEmpty,
  mockAdminProducts,
  type FilterStockStatus,
  type AdminProduct,
  type StockStatus,
} from "./products";

// Admin Customers Components
export {
  AdminCustomersHeader,
  AdminCustomersStats,
  AdminCustomersTable,
  AdminCustomersEmpty,
  mockCustomers,
  type Customer,
  type CustomerStatus,
} from "./customers";

// Admin Shipping Components
export {
  AdminShippingHeader,
  AdminShippingStats,
  AdminShippingTable,
  AdminShippingModal,
  AdminShippingEmpty,
  mockShippingOrders,
  calculateShippingStats,
  type ShippingOrder,
  type ShippingStatus,
  type Carrier,
  type ShippingStats,
} from "./shipping";
