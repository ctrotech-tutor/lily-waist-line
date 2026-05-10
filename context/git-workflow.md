# Git Workflow — Lily Waist Line

## Purpose

This file defines how source control is managed for Lily Waist Line.

The Git workflow agent is responsible for:

- Monitoring project changes
- Reviewing modified files before commit
- Grouping related changes into clean commits
- Creating feature branches when needed
- Preventing unrelated changes from being committed together
- Keeping branch history clean and production-safe
- Managing merge flow into protected branches

This workflow prioritizes clean history, traceability, and scalable collaboration.

---

## Branch Strategy

### Protected Branches

#### `main`

Production-ready code only.

Rules:

- Never commit directly to `main`
- Only merge tested, completed features
- Must remain deployable at all times

---

#### `develop`

Integration branch for completed features.

Rules:

- Feature branches merge here first
- Used for system testing and integration
- Must stay stable

---

## Feature Branches

All new work must begin in a feature branch.

Naming:

```bash
feature/<feature-name>
```

Examples:

```bash
feature/auth-system
feature/product-catalog
feature/cart-system
feature/manual-payment-flow
feature/order-tracking
feature/admin-dashboard
```

---

## When To Create A New Branch

Create a new branch if:

- Starting a new feature
- Modifying a new system boundary
- Refactoring an isolated subsystem
- Working on bug fixes

Do NOT create a new branch if:

- Fixing small issues in the current active feature
- Completing unfinished work already scoped in current branch

---

## Change Detection Rules

Before every commit:

The Git workflow agent must review:

```bash
git status
git diff
```

Must verify:

- Which files changed
- Whether changes belong to one logical unit
- Whether accidental files are included
- Whether environment or secret files are being tracked

Never commit:

- `.env`
- API keys
- Credentials
- Build artifacts
- Temporary files

---

## Commit Rules

Commits must represent one logical change only.

Do NOT combine:

- UI changes + database schema changes
- Auth changes + payment changes
- Admin changes + customer changes

Split unrelated changes into separate commits.

---

## Commit Message Format

Use conventional commits.

### Features

```bash
feat: add product catalog system
```

### Bug fixes

```bash
fix: resolve cart quantity sync issue
```

### Refactoring

```bash
refactor: simplify order creation logic
```

### Documentation

```bash
docs: update payment architecture
```

### Chores

```bash
chore: configure project linting
```

---

## Pre-Commit Checklist

Before committing, verify:

- Project builds successfully
- Types pass
- No secrets exposed
- No unrelated files staged
- Context docs are updated if architecture changed

Commands:

```bash
npm run lint
npm run type-check
git status
```

---

## Pull / Sync Rules

Before starting work:

```bash
git checkout develop
git pull origin develop
```

Then create feature branch.

---

## Merge Rules

A feature can only be merged if:

- Feature scope is complete
- No TypeScript errors
- No lint errors
- Matches architecture rules
- Context documentation is updated

Merge flow:

```bash
feature/* → develop → main
```

---

## Conflict Rules

If merge conflicts occur:

Priority order:

1. Architecture context
2. Business logic
3. UI changes

Never blindly accept incoming changes.

---

## Emergency Rules

If unstable code is committed:

Create hotfix branch:

```bash
hotfix/<issue-name>
```

Example:

```bash
hotfix/payment-status-bug
```

Hotfixes may merge directly into:

```bash
main
```

Then sync back into:

```bash
develop
```

---

## Lily Waist Line Specific Rules

Phase one business-critical systems:

Highest commit priority:

1. Authentication
2. Product catalog
3. Cart system
4. Manual payment flow
5. Order management
6. Shipping & tracking
7. Admin dashboard

Do not begin future automation features until phase one systems are stable.

Forbidden for phase one:

- Automated :contentReference[oaicite:0]{index=0} integrations
- Shipping carrier APIs
- Webhook-based payment flows