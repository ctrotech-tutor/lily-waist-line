Read `AGENTS.md` before starting.

Before implementation:

Use available agent skills/tools where relevant.

This includes:

- Prisma relation handling skills
- Next.js Server Actions best practices
- Supabase Auth session validation
- form validation best practices

When validation, session handling, or server action behavior may differ across versions:

Verify against latest official documentation:

- https://www.prisma.io/docs
- https://nextjs.org/docs
- https://supabase.com/docs

---

We are now building the **Address Backend System** for Lily Waist Line.

Follow strictly:

- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/git-workflow.md`

---

## Goal

Connect the existing address UI system to real backend logic.

Support:

- create address
- update address
- delete address
- fetch user addresses
- set default address
- select address for checkout

---

## Core Rule

Addresses are:

> user-owned shipping records

Every address must belong to exactly one authenticated user.

---

## Required Work

---

## 1. Server Actions Layer

Create:

`server/actions/address/`

---

### Actions:

---

#### create-address.ts

Must:

* validate session
* validate form input
* create address safely

---

#### update-address.ts

Must:

* validate session
* validate ownership
* update safely

---

#### delete-address.ts

Must:

* validate session
* validate ownership
* delete safely

---

#### get-user-addresses.ts

Must return:

* all user addresses
* default address
* newest ordering

---

#### set-default-address.ts

Must:

* ensure only one default address exists
* unset previous default
* set new default

Use transaction.

---

## 2. Validation Layer

Create:

`lib/validators/address/`

---

### Validate:

* firstName
* lastName
* addressLine1
* city
* postalCode
* country
* phone (optional)
* company (optional)

---

### Validation Rules

Must follow best practices:

* sanitize inputs
* trim strings
* reject empty required values

---

## 3. Ownership Rules

Critical:

Users must never access another user's addresses.

Every mutation must verify:

> address.userId === currentUser.id

---

## 4. Checkout Selection Support

Must support future checkout flow:

User can:

* use default address
* select another saved address

---

## 5. Query Optimization

Fetching addresses should:

* use indexed userId
* avoid unnecessary joins
* sort predictably

---

## 6. UI Integration

Connect existing:

`/address`
`/address/new`
`/address/[id]`

Use server actions where appropriate.

Do NOT rebuild UI.

---

## 7. Data Integrity Rules

Must enforce:

* one default address per user
* ownership validation
* safe deletes

---

## Important Rules

Do:

* use server actions
* enforce ownership strictly
* use transactions where needed
* keep validation centralized

Do NOT:

* trust client IDs
* allow cross-user access
* duplicate validation logic
* expose raw DB errors

---

## Check When Done

* address creation works
* address editing works
* address deletion works
* default selection works
* ownership enforced
* checkout-ready address selection works
* no TypeScript errors

---

## Next Step Preview

👉 Order Creation System (cart → address → payment-ready order flow)
