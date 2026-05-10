# Lily Waist Line

## Overview

Lily Waist Line is a premium eCommerce platform for a women’s fitness and shapewear brand focused on waist trainers. The platform enables customers to browse products, manage wishlists, place orders, and complete secure checkout flows, while providing administrators with a structured system to manage products, orders, and business operations.

The system is designed with a luxury-first UI approach using a deep black and metallic gold theme, supporting both light and dark modes. It emphasizes conversion-focused UX, mobile-first design, and scalable architecture for future expansion into additional fitness apparel categories.

---

## Goals

01. Provide a fully functional eCommerce experience for waist trainer products.
02. Enable customer authentication with secure account management.
03. Allow users to browse products, manage carts, and maintain wishlists.
04. Support a structured checkout flow with manual payment confirmation via Cash App.
05. Provide an admin system for product and order management.
06. Ensure a scalable architecture for future product expansion (e.g., workout outfits).
07. Maintain a premium, luxury-grade user interface and experience.

---

## Core User Flow

01. User visits the landing page.
02. User browses available waist trainer products.
03. User views product details and selects variants (size, etc.).
04. User adds products to cart or wishlist.
05. User signs up or logs in (if required for wishlist or checkout).
06. User proceeds to checkout.
07. User enters shipping details and places the order.
08. System creates the order with a pending payment status.
09. User is redirected to the client’s Cash App payment link for manual payment.
10. Admin verifies payment manually.
11. Order is processed, shipped, and tracking information is updated manually.

---

## Features

### Authentication System

* Email and password-based authentication for users.
* Separate admin authentication system.
* Session management for logged-in users.
* Protected routes for wishlist, cart persistence, and order history.

---

### Product Catalog

* Product listing with structured grid layout.
* Product detail pages with images, descriptions, sizes, and variants.
* Support for product variants (e.g., waist trainer sizes).
* Future-ready structure for additional product categories.

---

### Wishlist System

* Authenticated users can save products.
* Users can remove or move wishlist items to cart.
* Persistent storage of wishlist per user.

---

### Cart System

* Add, update, and remove cart items.
* Quantity management per product.
* Persistent cart state across sessions (for authenticated users).

---

### Checkout System

* Customer shipping information collection.
* Order summary with pricing breakdown.
* Delivery fee handling.
* Manual payment flow via Cash App payment link.
* Optional payment proof upload for manual verification.
* Order created with pending payment status before confirmation.

---

### Admin Dashboard

* Secure admin login.
* Overview of platform metrics (orders, revenue, customers).
* Product management (create, update, delete products).
* Order management (view and update order status).
* Inventory visibility and stock tracking.

---

### Order Management

* Order tracking system with status updates:
  + Pending Payment
  + Paid
  + Processing
  + Shipped
  + Delivered
  + Cancelled
* Customer order history access (if authenticated).
* Admin-controlled fulfillment flow.
* Admin can manually add carrier details and tracking numbers.
* Customers can track order progress after shipment.

---

### Shipping & Fulfillment

* Manual shipping fulfillment through local post office carriers.
* Admin manually processes shipments after payment confirmation.
* Admin can assign:
  + Carrier name
  + Tracking number
  + Shipping status

Future shipping upgrades may include:

* Third-party shipping aggregators
* Automated carrier rate calculation
* Real-time shipment tracking APIs

---

### UI/UX System

* Luxury black (#000000) and metallic gold theme.
* Light and dark mode support.
* Mobile-first responsive design.
* Minimal, premium, fashion-commerce interface.
* Conversion-focused layouts across all pages.

---

## Architecture

### Frontend

* React + TypeScript-based application.
* Component-driven UI architecture.
* State management for auth, cart, wishlist, and product data.
* Responsive layout system for mobile and desktop.

---

### Backend

* Backend-as-a-service architecture using Supabase.
* Handles:
  + Authentication
  + Database storage
  + User data
  + Orders
  + Wishlist
  + Cart persistence
  + Manual payment verification workflows
  + Shipping and tracking data management

---

### Payments

* Phase one uses manual payment processing via Cash App.
* Customers are redirected to the client’s Cash App payment link after checkout.
* Payment verification is handled manually by the admin.
* Orders remain in pending payment status until verification.

Future payment upgrades may include:

* :contentReference[oaicite:1]{index=1} for Cash App Pay and international card payments.
* Additional payment providers if business needs evolve.

---

### Data Storage

* Users
* Products
* Orders
* Wishlist items
* Cart items
* Admin metadata

---

## Scope

### In Scope

* Full eCommerce storefront
* Authentication system (users + admin)
* Wishlist functionality
* Cart and checkout system
* Payment integration
* Admin dashboard
* Product management system
* Order tracking system
* Responsive UI with light/dark modes

---

### Out of Scope

* Multi-vendor marketplace system
* Loyalty or reward systems (future phase)
* Mobile native applications
* Advanced AI recommendation engine
* Subscription billing systems

---

## Success Criteria

01. Users can browse and purchase waist trainers successfully.
02. Users can create accounts and maintain wishlists.
03. Orders are created, stored, and tracked correctly.
04. Admin can manage products and orders efficiently.
05. Manual payment flow works correctly with admin verification.
06. UI remains consistent, premium, and responsive.
07. System is scalable for future expansion.
08. Customers can track shipments after tracking details are added by admin.
