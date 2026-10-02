Read `AGENTS.md` before starting.

We are building the homepage newsletter subscription section for Lily Waist Line.

This section should feel exclusive, luxurious, and emotionally engaging.

This is not a generic email signup section.

It should feel like joining a premium transformation community.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create:

`components/home/newsletter-section.tsx`

Do not wire it into the homepage yet.

Only create the component.

Do not connect to backend, APIs, databases, or email services yet.

This is UI architecture only.

---

# Purpose

This section should help users feel like they are joining something exclusive.

The emotional goals:

- exclusivity
- transformation
- confidence
- belonging
- premium brand loyalty

---

# Section Layout

Create a premium responsive newsletter section.

This section should stand out from the rest of the homepage.

It should feel like a premium invitation.

---

## Content Area

Include:

### Eyebrow Label

Elegant uppercase micro-heading.

Examples:

- Join The Movement
- Exclusive Access
- For Women Who Transform

Use luxury spacing and typography.

---

### Main Heading

Large editorial headline.

Examples:

Own Your Transformation

or similar brand-aligned messaging.

Use the heading typography from the design system.

---

### Supporting Copy

Short premium body text.

Should communicate:

- early product launches
- exclusive offers
- fitness inspiration
- transformation journey

Keep it emotionally compelling and concise.

---

# Subscription Form

Include:

---

## Email Input

Use shadcn input.

Requirements:

- custom brand styling
- underline or editorial input feel
- no default shadcn appearance

Placeholder should feel premium.

Examples:

Enter your email

---

## Subscribe Button

Luxury CTA.

Examples:

- Join Now
- Get Exclusive Access
- Stay Inspired

Must follow brand styling.

No default shadcn button styling.

---

# Optional Accent Details

Support subtle premium accents such as:

- thin gold dividers
- glow highlights
- subtle layered backgrounds
- editorial framing

Do not overdesign.

Keep it clean and aspirational.

---

# Interaction States

Desktop interactions may include:

- subtle gold glow
- input focus highlight
- button hover shimmer

Must remain elegant.

No aggressive motion.

---

# Future Architecture

Prepare the component for future backend integration.

The structure should be easy to later connect with:

- email automation
- mailing lists
- marketing flows

Do not implement logic yet.

UI only.

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

Input and button must remain easy to use.

No overflow.

---

## Tablet

Balanced layout.

Comfortable spacing.

---

## Desktop

Premium editorial composition.

Strong whitespace.

Elegant alignment.

---

# Important Rules

Do NOT:

- use generic startup newsletter designs
- use random Tailwind colors
- use default shadcn styling
- hardcode widths

Do:

- use theme tokens only
- follow design typography
- maintain premium spacing
- keep the experience aspirational

---

### Check when done

- Component compiles without TypeScript errors
- Input renders correctly
- Button renders correctly
- Hover states work
- Light mode works
- Dark mode works
- Responsive layouts work
- Section feels premium and production-ready