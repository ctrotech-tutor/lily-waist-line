---
name: Aura of Discipline
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#cfc4c5'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#988e90'
  outline-variant: '#4c4546'
  surface-tint: '#c6c6c6'
  primary: '#c6c6c6'
  on-primary: '#303030'
  primary-container: '#000000'
  on-primary-container: '#757575'
  inverse-primary: '#5e5e5e'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#c6c6c6'
  on-tertiary: '#303030'
  tertiary-container: '#000000'
  on-tertiary-container: '#757575'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-xl:
    fontFamily: Poppins
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap-lg: 120px
  section-gap-sm: 64px
---

## Brand & Style

This design system targets an elite demographic of women who view fitness as a form of high-performance art. The aesthetic is rooted in **Modern Minimalism with a High-Fashion Editorial influence**. It emphasizes the "Transformation" brand value through a stark contrast between raw discipline and polished elegance.

The UI utilizes heavy whitespace to create a "gallery" feel, ensuring the products—waist trainers and shapewear—are treated as premium sculptural objects rather than simple apparel. Visual hierarchy is maintained through precise typography and thin, metallic accents that guide the eye without overwhelming the senses. The emotional response should be one of aspiration, prestige, and focused determination.

## Colors

The palette is designed to function across two distinct states: **Obsidian (Dark)** and **Alabaster (Light)**.

- **Primary:** Deep Black (#000000) serves as the foundation for the dark mode and the primary text/border color for light mode.
- **Accents:** Metallic Gold (#D4AF37) is used for primary CTAs, borders, and active states. Golden Amber (#FFD700) is reserved for subtle highlights and hover states to simulate a shimmer effect.
- **Support:** High-neutral grays provide depth. In Dark mode, they separate surface layers (e.g., card backgrounds on a black canvas). In Light mode, they offer soft contrast against pure white backgrounds.

Metallic effects should be implemented using a subtle linear gradient (45-degree angle) ranging from #D4AF37 to #FFD700 and back to #D4AF37 to mimic light reflecting off gold leaf.

## Typography

The typography strategy pairs the clean, geometric modernity of **Poppins** with the versatile, athletic precision of **Montserrat**.

- **Headings:** Large-scale geometric headlines create a modern, athletic feel. Use `display-xl` for hero sections with tight letter spacing.
- **Body:** Montserrat provides the "fitness-tech" balance, ensuring technical product details and workout instructions are highly legible.
- **Labels & Buttons:** All functional labels use uppercase Montserrat with increased letter spacing to evoke the feeling of luxury branding and modern athletic wear.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for desktop to maintain a boutique, controlled environment. 

- **Desktop:** 12-column grid with a 1440px max width and generous 80px side margins. 
- **Mobile:** 4-column fluid grid with 20px margins.
- **Vertical Rhythm:** A strict 8px baseline is used. High-end spacing is achieved by utilizing larger gaps (`section-gap-lg`) between content blocks to allow the product photography to "breathe."

Layout transitions should be fluid, but the focus remains on centered, symmetrical compositions for product displays and asymmetrical, editorial layouts for brand storytelling.

## Elevation & Depth

To maintain a sleek, high-fashion aesthetic, this system avoids traditional heavy shadows. Instead, it uses **Tonal Layering and Thin Outlines**:

- **Dark Mode:** Depth is created by placing #1A1A1A (Surface-1) containers on the #000000 (Base) background. A 1px border in #D4AF37 with 20% opacity is used for "ghost" containers.
- **Light Mode:** Subtle, neutral gray backgrounds (#F5F5F5) separate content sections from the white base. 
- **Interactions:** Upon hover, elements may gain a "Gold Glow"—a soft, diffused outer glow (#D4AF37 at 15% opacity) to simulate the way gold leaf catches light.
- **Glassmorphism:** Use only for navigation overlays or shopping cart drawers, employing a heavy backdrop blur (20px) with a 10% white or black tint depending on the active mode.

## Shapes

The design system utilizes **Sharp (0px)** corners for all structural elements including buttons, input fields, and product cards. This reinforces the brand values of "Self-Discipline" and "Precision." 

Small accents, such as selection indicators or status dots, may use circular forms to contrast against the rigid architecture of the layout, but the primary UI components must remain rectilinear and architectural.

## Components

### Buttons
- **Primary:** Solid Black (Dark Mode) or Solid Gold (Light Mode). No radius. Text is Montserrat Uppercase.
- **Secondary:** Transparent background with a 1px Gold (#D4AF37) border.
- **Micro-interaction:** On hover, the primary button fills with a subtle gold-to-amber gradient.

### Input Fields
- Underline style only. A 1px bottom border in gray, turning gold when focused. Floating labels in Montserrat 10px Uppercase.

### Cards (Product)
- Minimalist presentation. No borders by default. On hover, a 1px gold border fades in. Image aspect ratio is strictly 3:4 (Portrait/Editorial).

### Iconography
- **Style:** 1px thin-stroke linear icons. 
- **Color:** Icons are monochromatic (Black or White) with a single gold dot or small gold stroke highlight in the corner to denote active or premium status.

### Progress Indicators (Transformation Tracking)
- Used for workout or body-shaping progress. These should be thin, horizontal gold lines rather than bulky circular bars, maintaining the "luxury fitness" feel.