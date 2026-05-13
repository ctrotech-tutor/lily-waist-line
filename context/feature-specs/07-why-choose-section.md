Read `AGENTS.md` before starting.

We are building the "Why Choose Lily Waist Line" section for the homepage.

This section builds trust, authority, and purchase confidence.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create:

`components/home/why-choose-section.tsx`

Do not wire it into the homepage yet.

Only create the component.

---

# Purpose

This section should communicate why customers should trust Lily Waist Line.

The emotional goals:

- confidence
- quality
- discipline
- premium experience
- customer assurance

This must feel luxurious and trustworthy.

Not like a generic SaaS features section.

---

# Section Structure

Create a premium content layout.

---

## Section Intro

Include:

### Eyebrow Label

Elegant micro-heading.

Examples:

- Why Choose Us
- Crafted For Transformation

Use uppercase styling.

Luxury spacing.

---

### Main Heading

Large editorial headline.

Examples:

More Than Waist Training

or similar brand-aligned messaging.

Use heading typography from the design system.

---

### Supporting Copy

Short premium body text.

Should communicate:

- quality craftsmanship
- body confidence
- comfort
- premium support

Keep it concise.

---

# Feature Grid

Create a responsive feature grid.

Recommended:

4 feature items.

---

## Feature Items

Each item should include:

### Icon

Use `lucide-react`.

Use premium minimal icons.

Examples:

### Premium Quality

Possible icon:

- Shield

---

### Secure Checkout

Possible icon:

- Lock

---

### Fast Delivery

Possible icon:

- Truck

---

### Customer Support

Possible icon:

- Headphones

---

# Card Design

Feature items should feel editorial.

Requirements:

- premium spacing
- subtle borders
- layered surfaces
- hover states

Optional:

- subtle gold accent
- soft elevation
- thin divider lines

No default shadcn card styling.

---

# Hover States

Desktop interactions may include:

- subtle border glow
- gentle elevation
- icon highlight

Must remain elegant.

No exaggerated motion.

---

# Responsive Requirements

Must work perfectly across:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

## Mobile

Stack vertically.

No cramped spacing.

---

## Tablet

2-column layout.

Balanced spacing.

---

## Desktop

4-column layout.

Luxury spacing.

Strong visual rhythm.

---

# Important Rules

Do NOT:

- use default SaaS feature layouts
- use random Tailwind colors
- use generic startup styling
- hardcode widths

Do:

- use theme tokens only
- use design system typography
- maintain editorial spacing
- keep visual consistency

---

### Check when done

- Component compiles without TypeScript errors
- Icons render correctly
- Hover interactions work
- Light mode works
- Dark mode works
- Responsive layouts work
- Section feels premium and production-ready