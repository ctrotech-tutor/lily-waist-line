Read `AGENTS.md` before starting.

We are building the global application shell components for Lily Waist Line.

Do NOT wire these components into `app/layout.tsx` yet.

For this task:

Only create the components.

Do not mount them globally yet.

Follow:

- `context/design.md`
- `context/ui-context.md`

Maintain strict visual consistency with the Lily Waist Line brand identity.

The official logo is located at:

`public/logo.png`

Use it wherever the brand mark is needed.

---

## Goal

Create the reusable layout components:

- Navbar
- Footer
- Mobile Navigation Drawer

These will later be integrated into the global app layout.

---

# Navbar

Create:

`components/layout/navbar.tsx`

Requirements:

## Layout

- sticky top navigation
- supports backdrop blur
- premium editorial appearance
- must feel custom and luxurious

---

## Desktop Layout

Three sections:

### Left

Brand area:

- logo from `public/logo.png`
- brand text: Lily Waist Line

The brand area should feel elegant, minimal, and premium.

---

### Center

Navigation links:

- Home
- Shop
- About
- Contact

Links should have subtle premium hover interactions.

No aggressive animations.

---

### Right

Utility actions:

Use `lucide-react` icons.

Include:

- Theme toggle
- Wishlist button
- Cart button
- Account button

Buttons should be future-ready for badge counts.

Do not implement counts yet.

---

## Mobile Behavior

On smaller screens:

Hide desktop navigation links.

Show:

- Brand
- Theme toggle
- Mobile menu trigger

---

# Mobile Navigation Drawer

Create:

`components/layout/mobile-nav.tsx`

Requirements:

Use:

- shadcn `Sheet`

Behavior:

- slides in from the left
- overlays content
- does not push content

---

## Drawer Content

### Header

Include:

- logo
- brand name
- close button

---

### Navigation

Include:

- Home
- Shop
- About
- Contact

---

### Utility Section

Include:

- Wishlist
- Cart
- Account
- Theme toggle

Keep spacing clean and uncluttered.

---

# Footer

Create:

`components/layout/footer.tsx`

Requirements:

Luxury editorial footer.

Include:

---

## Brand Section

- logo
- short brand statement

---

## Navigation Section

Links:

- Home
- Shop
- About
- Contact

---

## Policy Section

Placeholder links:

- Shipping Policy
- Returns Policy
- Privacy Policy

---

## Social Section

Prepare icon slots for:

- Instagram
- WhatsApp

Do not wire real links yet.

---

# Responsive Requirements

All components must be fully responsive across all devices.

Support:

- Mobile phones
- Large phones
- Tablets
- Small laptops
- Desktop screens
- Large desktop screens

Use a mobile-first responsive approach.

---

## Navbar Responsiveness

### Mobile

Show:

- logo
- theme toggle
- menu trigger

Hide desktop navigation.

---

### Tablet

Spacing must remain balanced.

Avoid cramped layouts.

---

### Desktop

Show full navigation.

Maintain premium spacing.

---

## Mobile Drawer Responsiveness

Must work correctly on:

- narrow mobile screens
- foldable-width layouts
- portrait tablets

Do not allow:

- overflow
- clipping
- horizontal scrolling

---

## Footer Responsiveness

### Mobile

Use vertical stacking.

---

### Tablet

Use adaptive multi-column layout.

---

### Desktop

Use full multi-column layout.

---

# Important Rules

Do NOT:

- wire these components into layout yet
- hardcode random colors
- use Tailwind zinc/slate colors
- use placeholder logos
- use default shadcn appearance

Do:

- use `public/logo.png`
- use theme tokens only
- follow design system rules
- make components reusable
- maintain consistent spacing and typography

---

### Check when done

- Components compile without TypeScript errors
- Navbar renders correctly
- Mobile drawer renders correctly
- Footer renders correctly
- Theme toggle works inside navbar and drawer
- Logo renders correctly
- All components are fully responsive
- Nothing is mounted in `app/layout.tsx`