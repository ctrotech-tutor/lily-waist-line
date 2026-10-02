export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product',
  CART: '/cart',
  CHECKOUT: '/checkout',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  ORDER: '/order',
  ACCOUNT: '/account',
  ADDRESS: '/address',
  ADDRESS_NEW: '/address/new',
  ABOUT: '/about',
  CONTACT: '/contact',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  AUTH_CALLBACK: '/auth/callback',
  ADMIN: '/admin',
  ACCESS_DENIED: '/access-denied',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCTS_NEW: '/admin/products/new',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SHIPPING: '/admin/shipping',
  ADMIN_SETTINGS: '/admin/settings',
  API_UPLOADS_PAYMENT_PROOF: '/api/uploads/payment-proof',
  API_UPLOADS_AVATAR: '/api/uploads/avatar',
  API_WEBHOOKS: '/api/webhooks',
} as const

export const ROUTE_BUILDERS = {
  product: (id: string, slug: string) =>
    `/product/${id}/${slug}` as const,

  adminOrder: (orderId: string) =>
    `/admin/orders/${orderId}` as const,

  adminCustomer: (customerId: string) =>
    `/admin/customers/${customerId}` as const,

  orderConfirmation: (orderId: string) =>
    `/order/confirmation/${orderId}` as const,

  orderPaymentProof: (orderId: string) =>
    `/order/payment-proof/${orderId}` as const,
} as const

export const ROUTE_ACCESS = {
  public: [
    ROUTES.SHOP,
    ROUTES.PRODUCT,
    ROUTES.VERIFY_EMAIL,
    ROUTES.AUTH_CALLBACK,
  ],

  guestOnly: [
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
  ],

  user: [
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ORDERS,
    ROUTES.ORDER,
    ROUTES.WISHLIST,
    ROUTES.ADDRESS,
    ROUTES.ACCOUNT,
  ],

  admin: [
    ROUTES.ADMIN,
  ],

  apiPublic: [
    ROUTES.API_WEBHOOKS,
  ],
} as const