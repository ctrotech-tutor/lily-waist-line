Read `AGENTS.md` before starting.

We are building the homepage hero section for Lily Waist Line.

This section will be the first visual and emotional touchpoint of the brand.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict consistency with the Lily Waist Line luxury editorial identity.

---

## Goal

Create the homepage hero section.

Create:

`components/home/hero-section.tsx`

Do not wire it into the homepage yet.

Only create the component.

---

## Brand Asset

Use the official hero image located at:

`public/img-1.png`

Do not use placeholder images.

Do not replace with stock images.

Use the actual brand image.

---

# Hero Purpose

This section should communicate:

- Transformation
- Confidence
- Discipline
- Luxury fitness
- Premium femininity

The hero must feel aspirational and emotionally powerful.

It must NOT feel like a generic ecommerce hero.

---

# Layout

Create a responsive two-panel hero layout.

---

## Left Content Area

Include:

### Eyebrow Label

Luxury micro-label.

Examples:

- Sculpt With Confidence
- Designed For Transformation

Use elegant uppercase styling.

---

### Main Headline

Large editorial headline.

Use heading typography from the design system.

The headline should feel bold, luxurious, and memorable.

Examples:

Body. Discipline. Transformation.

or similar brand-aligned messaging.

---

### Supporting Copy

Short premium body copy.

Should communicate:

- confidence
- premium waist training
- transformation journey

Keep copy concise and elegant.

---

### CTA Buttons

Include:

#### Primary CTA

Examples:

- Shop Collection
- Start Your Journey

---

#### Secondary CTA

Examples:

- Explore More
- View Products

Buttons must follow brand styling.

No default shadcn appearance.

---

## Right Content Area

Use:

`public/img-1.png`

Requirements:

- editorial image presentation
- preserve aspect ratio
- no distortion
- premium composition

Image should feel like fashion campaign photography.

---

# Optional Accent Details

Support subtle luxury accents such as:

- thin gold divider lines
- editorial framing
- subtle glow accents
- layered surfaces

Do not overdesign.

Keep it minimal and premium.

---

# Motion

Support subtle motion only.

Examples:

- soft image entrance
- subtle text reveal
- smooth hover interactions

Do not use aggressive animation.

Do not create distracting effects.

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

Text first.

Image second.

CTA buttons must remain usable.

---

## Tablet

Transition smoothly between stacked and split layouts.

---

## Desktop

Two-panel editorial composition.

Balanced spacing.

Strong visual hierarchy.

---

# Important Rules

Do NOT:

- use placeholder images
- use stock hero layouts
- use random Tailwind colors
- use generic startup hero styling
- hardcode dimensions that break responsiveness

Do:

- use `public/img-1.png`
- use theme tokens only
- follow design typography
- maintain luxury editorial feel

---

### Check when done

- Component compiles without TypeScript errors
- Image renders correctly
- Light mode works
- Dark mode works
- Responsive layouts work
- Typography matches design system
- Hero feels premium and production-ready