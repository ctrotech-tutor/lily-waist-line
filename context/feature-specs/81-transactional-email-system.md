Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- email delivery best practices
- SMTP configuration patterns
- Next.js Server Actions + background execution patterns
- Prisma event-driven triggers (manual implementation style)

When email delivery behavior, SMTP handling, or server-side execution patterns may differ across versions:

Verify against latest official documentation:

- https://nextjs.org/docs
- https://nodemailer.com
- https://www.prisma.io/docs

---

We are now building the **Transactional Email System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Implement a reliable **email notification system** for all key business events.

---

## Core Rule

Emails are:

> system notifications, not UI features

They must always be triggered from server-side logic.

---

## Email Provider

Use:

:contentReference[oaicite:0]{index=0}

SMTP-based delivery.

No client-side email sending allowed.

---

## Required Work

---

## 1. Email Service Layer

Create:

`lib/services/email/`

---

### Core File:

---

#### email-service.ts

Must handle:

* SMTP transport
* reusable send function
* template injection
* error handling

---

## 2. Email Templates System

Create:

`lib/email/templates/`

---

### Required Templates:

---

#### welcome-email

Triggered on signup

---

#### login-alert

Triggered on login (optional security feature)

---

#### order-confirmation

Triggered when order is created

---

#### payment-received

Triggered when payment is approved

---

#### shipping-update

Triggered when order is shipped

---

## 3. Trigger Points (Server Actions Integration)

---

### Auth System

* signup → welcome email

---

### Order System

* create order → order confirmation email

---

### Admin System

* payment approved → payment received email
* shipping updated → shipping email

---

## 4. Email Queue Strategy (Phase One)

No external queue system yet.

Use:

> simple async server-side triggers

Ensure:

* non-blocking execution
* failure does not break business flow

---

## 5. Email Safety Rules

Must enforce:

* no sensitive data leakage
* no raw payment details in email
* no internal IDs exposed

---

## 6. Email Content Rules

Emails must be:

* clean
* minimal
* brand-consistent
* mobile-friendly

Tone:

> luxury + professional + simple

---

## 7. Error Handling

If email fails:

* log error internally
* DO NOT fail business operation
* do not block checkout/order flow

---

## 8. Configuration Layer

Create:

`lib/config/email.ts`

Must include:

* SMTP host
* SMTP port
* auth credentials (env-based)
* sender identity

---

## Important Rules

Do:

* use server-only email sending
* keep templates reusable
* decouple email from business logic
* ensure non-blocking execution

Do NOT:

* send emails from client
* expose SMTP credentials
* block orders if email fails
* hardcode email content in actions

---

## Check When Done

* emails send successfully
* templates render correctly
* order events trigger emails
* auth events trigger emails
* failures do not break system
* no sensitive data exposed

---

## Next Step Preview

👉 Security + Validation Layer (final backend hardening before production readiness)