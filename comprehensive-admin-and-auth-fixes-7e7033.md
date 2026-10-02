# Comprehensive Admin Panel and Auth Fixes

Fix multiple issues in admin panel display, email notifications, tracking page, and authentication flows to ensure a seamless user experience.

## Issues Identified

### 1. Payment Proof Image Not Showing in Admin Panel
**Problem:** Admin panel shows fallback image instead of actual payment proof.
**Root Cause:** The `imageUrl` stored in database is the storage path (e.g., `orders/{orderId}/payment-proof/{filename}`), not a signed URL. Since the bucket is private, the image cannot be accessed without a signed URL.
**Fix:** Generate signed URL when displaying payment proof in admin panel.

### 2. Order ID Too Long in Admin Panel
**Problem:** Admin panel displays full UUID which is too long and not user-friendly.
**Root Cause:** Components display `order.id` (UUID) instead of formatted order number.
**Fix:** Add order number formatter and display formatted numbers like "LWL-2026-IV79KZ" throughout admin panel.

### 3. Missing Email Notifications for Fulfillment Status Updates
**Problem:** When admin updates fulfillment status (PROCESSING, SHIPPED, DELIVERED, CANCELLED), no email is sent to customer.
**Root Cause:** `updateFulfillmentStatus` action doesn't trigger email notifications.
**Current State:**
- ✓ Payment verification sends emails (received/rejected)
- ✓ Tracking number addition sends shipping email
- ✗ Fulfillment status updates send NO emails
**Fix:** Add email triggers for fulfillment status changes.

### 4. Tracking Page Needs Improvements
**Problem:** Tracking page is basic and could be more advanced.
**Current State:** Shows shipment status, timeline, and carrier tracking link.
**Potential Improvements:**
- Add estimated delivery date calculation based on carrier
- Show package details and items
- Add shipping address information
- Better visual timeline with icons
- Real-time tracking integration (if carrier API available)
- Mobile-responsive improvements

### 5. Email Verification Link Expiring Immediately
**Problem:** Clicking verification link shows "otp_expired" error immediately.
**Root Cause:** Likely Supabase auth link generation or configuration issue. The callback route looks correct.
**Investigation Needed:** Check email trigger function, link generation parameters, and Supabase auth settings.

### 6. Password Reset Link Expiring Immediately
**Problem:** Same as email verification - link expires immediately.
**Root Cause:** Same issue as email verification.
**Investigation Needed:** Check password reset email trigger and link generation.

## Implementation Plan

### Phase 1: Admin Panel Fixes
1. **Fix Payment Proof Image Display**
   - Modify `toAdminOrderDetail` function to generate signed URL for payment proof
   - Update admin panel to use signed URL when displaying image
   - Handle signed URL expiration gracefully

2. **Add Order Number Formatting**
   - Create utility function `formatOrderNumber(orderId)` to generate "LWL-2026-IV79KZ"
   - Update all admin components to display formatted order number
   - Keep UUID for internal use, show formatted number in UI

### Phase 2: Email Notification Fixes
3. **Add Fulfillment Status Email Triggers**
   - Create email templates for:
     - Order processing notification
     - Order shipped notification
     - Order delivered notification
     - Order cancelled notification
   - Update `updateFulfillmentStatus` action to send appropriate emails
   - Add email trigger functions to email-triggers.ts

### Phase 3: Tracking Page Enhancements
4. **Improve Tracking Page**
   - Add order details section (items, total, shipping address)
   - Enhance timeline with better visual design
   - Add carrier-specific tracking integration
   - Improve mobile responsiveness
   - Add estimated delivery date based on carrier and shipping date

### Phase 4: Auth Link Fixes
5. **Fix Email Verification Link**
   - Investigate Supabase auth link generation in email trigger
   - Check link expiration time configuration
   - Ensure proper redirect URL handling
   - Test link generation and expiration

6. **Fix Password Reset Link**
   - Same investigation as email verification
   - Ensure password reset flow works end-to-end
   - Test link expiration and validity

## Implementation Order

1. Fix payment proof image display (Phase 1)
2. Add order number formatting (Phase 1)
3. Add fulfillment status email notifications (Phase 2)
4. Improve tracking page (Phase 3)
5. Fix email verification link (Phase 4)
6. Fix password reset link (Phase 4)

## Expected Outcome

After implementation:
- Admin panel displays payment proof images correctly
- Admin panel shows user-friendly order numbers
- Customers receive email notifications for all order status changes
- Tracking page provides comprehensive shipment information
- Email verification links work reliably
- Password reset links work reliably
