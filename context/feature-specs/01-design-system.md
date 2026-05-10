Read `AGENTS.md` before starting.

The project already has:

- `shadcn/ui` installed and configured
- `lucide-react` installed
- `class-variance-authority` installed
- `clsx` installed
- `tailwind-merge` installed
- `lib/utils.ts` with `cn()` helper already created

Before making changes:

- Check `package.json`
- Verify these dependencies already exist
- Verify `lib/utils.ts` exists and `cn()` imports without errors

If any dependency is missing, install only the missing package.

---

Add these shadcn components:

## Core UI
- Button
- Card
- Input
- Textarea
- Label
- Badge
- Separator
- Skeleton

## Layout & Navigation
- Sheet
- Dialog
- DropdownMenu
- Tabs
- ScrollArea

## Forms & Selection
- Form
- Select
- Checkbox
- RadioGroup

## Feedback & Status
- Alert

## Data Display
- Table
- Pagination

Do not modify generated `components/ui/*` files after generation.

Ensure all components follow:

- `context/design.md`
- `context/ui-context.md`

---

### Check when done

- All components generate successfully
- All imports resolve correctly
- No duplicate dependencies are installed
- `cn()` works correctly
- No default shadcn styling conflicts with project theme
- Light and dark mode render correctly