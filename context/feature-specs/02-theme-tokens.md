Read `AGENTS.md` before starting.

We're replacing the default shadcn theme tokens in `app/globals.css`.

The current `globals.css` still contains default shadcn color tokens and must now be updated to match:

- `context/design.md`
- `context/ui-context.md`

This project uses:

# Brand Identity

Lily Waist Line

Luxury women's fitness and body-sculpting eCommerce brand.

Theme supports:

- Light mode (`:root`)
- Dark mode (`.dark`)

Dark mode remains the default experience.

---

## Typography

Configure theme font tokens to match the design system:

### Heading Font
Use:

- Bodoni Moda

Assign to:

- `--font-heading`

### Body Font
Use:

- Montserrat

Assign to:

- `--font-sans`

Do not use Geist for this project.

---

## Radius Rules

Update radius tokens to match brand sharpness:

Structural UI should feel precise and disciplined.

Use:

`--radius: 0px`

No rounded luxury-soft corners.

---

## Color Token Rules

Replace all default shadcn color values.

Use black, white, neutral grays, and gold accents only.

---

## Light Mode (`:root`)

Implement:

- Background → pure white
- Foreground → near black
- Cards → soft white
- Borders → light gray
- Muted surfaces → off-white
- Primary → deep black
- Primary foreground → white
- Secondary → metallic gold
- Secondary foreground → black
- Accent → golden amber
- Input → subtle gray
- Ring → gold

---

## Dark Mode (`.dark`)

Implement:

- Background → deep black
- Foreground → soft white
- Cards → layered charcoal
- Borders → dark gray
- Muted surfaces → dark neutral
- Primary → metallic gold
- Primary foreground → black
- Secondary → charcoal
- Secondary foreground → white
- Accent → golden amber
- Input → dark layered surface
- Ring → gold glow

---

## Sidebar Tokens

Update sidebar tokens to match the same active theme.

No blue or purple default sidebar colors should remain.

---

## Base Layer

Ensure:

### html
Uses:

- `font-sans`

### body
Uses:

- `bg-background`
- `text-foreground`
- smooth antialiasing

---

## Important Rules

Do NOT:

- leave any default shadcn colors
- leave any blue/purple tokens
- use random Tailwind colors
- use rounded corners in token config

Do:

- preserve shadcn token structure
- preserve `@theme inline`
- preserve `@custom-variant dark`

Only replace token values.

---

### Check when done

- Light mode matches luxury editorial look
- Dark mode matches black + gold brand identity
- Fonts match design system
- No default shadcn colors remain
- Buttons, cards, inputs, dialogs inherit correct tokens