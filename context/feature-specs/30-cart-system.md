Read `AGENTS.md` before starting.

We are now implementing the **Cart System** for Lily Waist Line.

Follow strictly:

- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`

Maintain strict consistency with the Lily Waist Line luxury commerce system.

---

# 🎯 Goal

Implement the full cart system for authenticated customers.

This includes:

- Add to cart
- Update quantity
- Remove item
- Cart persistence
- Cart summary calculations
- Variant-aware cart handling

---

# ⚠️ SCOPE RULE

This task includes:

- UI wiring
- Server actions
- Database persistence

This task does NOT include:

- Checkout
- Payments
- Shipping
- Order creation

Those come later.

---

# 🔐 ACCESS RULE

Cart requires authentication.

Only authenticated users may:

- Add items
- View cart
- Modify cart

Unauthenticated users:

- Must be redirected to `/login`

Protected route:

```txt
/cart
```

---

# 🧱 DATA SOURCE

Use:

- :contentReference[oaicite:0]{index=0} Auth → identity
- :contentReference[oaicite:1]{index=1} → cart persistence

Use existing Prisma models:

- User
- Cart
- CartItem
- ProductVariant

Do NOT change schema here.

---

# 🛍️ ADD TO CART FLOW

When user clicks:

```txt
Add to Cart
```

Flow:

1. Verify user session
2. Fetch user's cart

If cart does not exist:

- Create cart

Then:

Check if variant already exists in cart.

If exists:

- increment quantity

Else:

- create new cart item

---

# 🧠 VARIANT RULE

Cart MUST be variant-based.

A product variant is defined by:

- Size
- Color

Different variants MUST create separate cart entries.

Do NOT merge different variants.

---

# ➕ QUANTITY RULES

Customer may:

- Increase quantity
- Decrease quantity

Minimum:

```txt
1
```

If quantity reaches:

```txt
0
```

Remove item from cart.

---

# 🗑️ REMOVE ITEM

Users may remove cart items manually.

This deletes the cart item only.

Do NOT delete cart itself.

---

# 💰 CART CALCULATIONS

Compute dynamically:

## Subtotal

Sum of:

```txt
variant price × quantity
```

---

## Shipping

Static placeholder for now:

```txt
Calculated at checkout
```

Do NOT calculate shipping yet.

---

## Total

For now:

```txt
Total = Subtotal
```

---

# 🔁 CART PERSISTENCE

Cart MUST persist across:

- page refresh
- logout/login
- device session restoration

Source of truth:

Database only.

Do NOT use localStorage as source of truth.

---

# 🧩 UI RULES

Use existing components:

- ProductCard
- Cart Page Shell
- Existing theme tokens

Must support:

- Empty cart state
- Loading state
- Auth redirect state

---

# EMPTY CART STATE

Display premium empty state.

Message tone:

Luxury + editorial.

Include CTA:

```txt
Continue Shopping
```

Route:

```txt
/shop
```

---

# SERVER ACTIONS

Create server actions for:

## addToCart

Inputs:

- variantId
- quantity

---

## updateCartQuantity

Inputs:

- cartItemId
- quantity

---

## removeCartItem

Inputs:

- cartItemId

---

# 🧠 SECURITY RULES

Users MUST only access their own cart.

All queries MUST use:

Authenticated Supabase user ID.

Never trust client-provided user IDs.

---

# 🚫 OUT OF SCOPE

- Checkout
- Address selection
- Payment flow
- Order creation
- Shipping logic

---

# 📌 CHECK WHEN DONE

- Authenticated users can add to cart
- Variant logic works correctly
- Quantity updates correctly
- Remove item works
- Cart persists in database
- Empty state works
- Unauthorized users are redirected
- No schema changes made