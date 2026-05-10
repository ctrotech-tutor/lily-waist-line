Read `AGENTS.md` before starting.

The project already has these dependencies installed:

- next-themes
- nextjs-toploader

Before making changes:

- Check `package.json`
- Verify both packages exist

Do not reinstall packages unless something is missing.

---

## Goal

Create the global theme system and browser navigation loading system for Lily Waist Line.

This project uses:

- Next.js App Router
- Light mode
- Dark mode
- System theme detection

Dark mode is the brand-first experience, but the default theme setting must be:

`system`

Users must be able to inherit their device preference automatically.

---

## Theme System

Use `next-themes`.

Create a reusable theme provider.

Recommended file:

`components/providers/theme-provider.tsx`

Requirements:

- Use `ThemeProvider` from `next-themes`
- Enable system theme detection
- Default theme = `system`
- Disable transition flashes during theme changes
- Use class-based theming
- Must work with Tailwind dark mode tokens

Configuration should be production-safe:

- no hydration mismatch
- no theme flashing
- no client/server mismatch

---

## Root Layout Integration

Integrate the theme provider inside:

`app/layout.tsx`

Requirements:

- Wrap the full application
- Theme must be available everywhere
- Ensure `suppressHydrationWarning` is correctly applied where needed

---

## Browser Top Loader

Use `nextjs-toploader`.

Integrate globally inside:

`app/layout.tsx`

Requirements:

The loader should feel premium and match the brand identity.

Configure:

- slim height
- smooth animation
- no spinner
- gold brand color
- reliable route transition behavior

The loader must work across:

- page navigation
- auth routes
- product routes
- admin routes

---

## Provider Architecture

If a providers folder does not exist:

Create:

`components/providers/`

Keep provider files isolated and reusable.

Do not place provider logic directly inside pages.

---

## Important Rules

Do NOT:

- hardcode theme state manually
- create custom localStorage logic
- use useEffect theme hacks
- place provider logic inside page components

Do:

- follow Next.js App Router best practices
- keep providers composable
- make theme state globally accessible

---

### Check when done

- System theme works correctly
- Light mode works
- Dark mode works
- No hydration warnings
- No theme flash on reload
- Top loader appears during route transitions
- Top loader matches Lily Waist Line branding