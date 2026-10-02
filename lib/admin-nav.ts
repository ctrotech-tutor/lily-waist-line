import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { ROUTES } from "@/lib/constants/routes"

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: "Orders", href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  { label: "Products", href: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { label: "Customers", href: ROUTES.ADMIN_CUSTOMERS, icon: Users },
  { label: "Shipping", href: ROUTES.ADMIN_SHIPPING, icon: Truck },
  { label: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
]