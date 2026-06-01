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
  AdminOrdersTableSkeleton,
  AdminOrdersEmpty,
  type FilterStatus,
  type AdminOrderRow,
} from "./orders";

// Admin Order Detail Components
export {
  AdminOrderHeader,
  AdminPaymentReview,
  AdminOrderItems,
  AdminCustomerInfo,
  AdminFulfillmentPanel,
  AdminOrderAlerts,
  AdminOrderDetailSkeleton,
  type AdminOrderDetail,
  type AdminOrderDetailItem,
  type AdminOrderShippingAddress,
  type AdminOrderPaymentProof,
} from "./order";

// Admin Products Components
export {
  AdminProductsHeader,
  AdminProductsControls,
  AdminProductsTable,
  AdminProductsEmpty,
  type FilterStockStatus,
  type AdminProduct,
  type StockStatus,
} from "./products";

// Admin Customers Components
export {
  AdminCustomersHeader,
  AdminCustomersStats,
  AdminCustomersTable,
  AdminCustomersTableSkeleton,
  AdminCustomersEmpty,
  type AdminCustomerRow,
  type CustomerStatus,
} from "./customers";

// Admin Shipping Components
export {
  AdminShippingHeader,
  AdminShippingStats,
  AdminShippingTable,
  AdminShippingModal,
  AdminShippingEmpty,
  AdminShippingStatsSkeleton,
  AdminShippingTableSkeleton,
  type AdminShippingRow,
  type ShippingStats,
  computeShippingStats,
  formatShippingDate,
} from "./shipping";