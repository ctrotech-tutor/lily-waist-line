Read `AGENTS.md` before starting.

We are now building the **Admin Settings & Business Configuration UI** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/design.md`
- `context/ui-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

Maintain strict consistency with the Lily Waist Line luxury ecommerce identity.

---

## Goal

Build the **Admin Settings System UI**.

This allows admins to configure:

- business identity
- payment methods (Cash App / PayPal placeholders)
- email settings (UI only)
- store configuration
- system toggles

This is:

> UI only (no real system changes)

Do NOT connect:

- Supabase
- Prisma
- server actions
- SMTP services
- payment APIs

yet.

---

## Route

Create:

app/(admin)/settings/page.tsx

---

## Core UX Purpose

Admin must control:

- how the store behaves
- how payments are presented
- how emails are configured
- basic branding settings

---

## Layout Structure

---

### 1. Settings Header

Create:

components/admin/settings/admin-settings-header.tsx

Contains:

- Title: Settings
- Subtitle: system configuration

Example:

Configure store behavior, payments, and business identity.

---

## 2. Business Profile Section

Create:

components/admin/settings/admin-business-profile.tsx

Fields:

---

### Store Name

Lily Waist Line

---

### Brand Email

---

### Support Contact

---

### Business Logo (UI only upload placeholder)

---

## 3. Payment Configuration Section

Create:

components/admin/settings/admin-payment-settings.tsx

Show:

---

### Cash App

- enabled toggle (UI only)
- display handle field

---

### PayPal

- enabled toggle (UI only)
- merchant email field

---

### Payment Notes

Example:

Manual verification required for all transactions in phase one.

---

## 4. Email Configuration Section

Create:

components/admin/settings/admin-email-settings.tsx

Fields:

---

### SMTP Host (mock)

---

### SMTP User (mock)

---

### Email Templates Toggle

- Order Confirmation
- Payment Notification
- Shipping Update

UI only toggles.

---

## 5. System Controls Section

Create:

components/admin/settings/admin-system-controls.tsx

Include:

---

### Maintenance Mode Toggle

---

### New Orders Enabled Toggle

---

### Admin Notifications Toggle

---

## 6. Danger Zone Section

Create:

components/admin/settings/admin-danger-zone.tsx

Actions (UI only):

- Reset System
- Clear Mock Data
- Export Data

Must be visually separated and dangerous-looking.

---

## UI Primitive Rules

Use shadcn primitives:

- Card
- Button
- Input
- Switch
- Separator
- Alert
- Tabs (optional)

Do NOT modify:

components/ui/*

---

## Styling Rules

Must follow:

- luxury black / white / gold system
- structured settings layout
- strong section separation
- clear hierarchy between safe and dangerous actions

No decorative UI.

---

## Responsiveness

Must support:

- 320px
- 375px
- 768px
- 1024px+
- 1440px+

---

## Important Rules

Do:

- keep settings modular
- clearly separate business vs system config
- design for future real integrations

Do NOT:

- connect backend services
- persist settings
- call APIs
- integrate payment gateways
- send emails

---

## Check When Done

- settings page renders
- all sections display correctly
- toggles work (UI only)
- forms render correctly
- danger zone is clearly styled
- mobile works
- desktop works
- admin shell integration works
- premium consistency maintained

---

## Final System State

At this point, Lily Waist Line has:

- Full storefront (shop → product → checkout → orders)
- Full customer post-purchase system
- Full admin dashboard system
- Full operational mock architecture

---

## Next Step Preview

👉 Admin System Wiring + Role Protection + Final Integration Layer