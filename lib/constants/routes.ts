export const ROUTE_ACCESS = {
  public: [
    "/shop",
    "/product",
  ],

  guestOnly: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],

  user: [
    "/cart",
    "/checkout",
    "/orders",
    "/wishlist",
    "/address",
  ],

  admin: [
    "/admin",
  ],

  apiPublic: [
    "/api/webhooks",
  ],
} as const;
