# Database migration workflow status

## Current repository state

- `prisma.config.ts` points Prisma Migrate at `prisma/migrations`.
- That directory currently contains two loose root-level SQL files (`001_add_product_image_storage_fields.sql` and `002_add_performance_indexes.sql`). Prisma Migrate expects one directory per migration, each containing `migration.sql`; it will not treat those loose files as deployable migrations.
- Timestamped SQL files are also tracked under `supabase/migrations`. This repository has no tracked `supabase/config.toml`, and the production/staging migration history has not been inspected. Therefore, it is not yet verified that the Supabase CLI can apply the tracked files or that their contents match the deployed database.
- The checked-in Prisma schema is the application model, but by itself it is not a safe baseline for an existing database.

Do not delete, move, rename, replay, or mark any historical SQL as applied until its status has been compared with the actual target database. No baseline migration has been created because production schema and migration-history evidence are unavailable.

## Temporary safety gate

`npm run db:migrate` and `npm run db:migrate:deploy` now fail closed until both conditions are met:

1. `prisma/migrations` contains at least one standard migration directory with `migration.sql`.
2. The `PRISMA_MIGRATIONS_VERIFIED` marker exists after the deployed baseline and clean-install/upgrade procedures have been reviewed and tested.

The loose root-level SQL files do not satisfy the first condition. The marker is deliberately absent in this repository today. Do not create it simply to make a command run. `npm run db:generate` only regenerates Prisma Client; `npm run db:push` and `npm run db:reset` are schema-mutating operations and must not be used against production as substitutes for an ordered migration history.

## Required baseline/reconciliation work

Before enabling a migration workflow:

1. Take a restorable production backup and obtain a schema-only export plus the database's migration-history records through an authorized, read-only path. Do not commit credentials or production data.
2. Restore a sanitized copy into an isolated staging database. Compare its tables, columns, constraints, indexes, extensions, and applied-migration records against `prisma/schema.prisma`, every tracked Supabase migration, and the two legacy root SQL files.
3. Choose and document exactly one deployment owner for application DDL: Prisma Migrate or the Supabase migration system. Avoid allowing both systems to evolve the same schema independently.
4. Construct the baseline from the verified deployed schema and migration state—not by guessing from the current Prisma model. Do not rewrite old migrations to make the fresh-install path appear clean.
5. Rehearse both a clean empty-database install and an upgrade from a production-like copy. Verify the expected schema and application smoke checks before enabling deployment commands or adding the verification marker.

Until those steps are completed, continue to use the separately reviewed deployment instructions for each newly authored SQL change, apply changes only to staging first, and do not run Prisma Migrate against a live database. In particular, the order display snapshot migration is not applied by this repository work; use its maintenance-window guidance in `docs/order-inventory-reservations.md` only after the migration history and target schema have been confirmed.
