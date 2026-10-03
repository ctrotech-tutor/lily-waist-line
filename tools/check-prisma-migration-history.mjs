import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const VERIFIED_MARKER = 'PRISMA_MIGRATIONS_VERIFIED'

export function findPrismaMigrationDirectories(migrationsPath) {
  if (!fs.existsSync(migrationsPath)) return []

  return fs.readdirSync(migrationsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory()
      && fs.existsSync(path.join(migrationsPath, entry.name, 'migration.sql')))
    .map((entry) => entry.name)
    .sort()
}

export function getPrismaMigrationReadiness(migrationsPath) {
  const directories = findPrismaMigrationDirectories(migrationsPath)
  const verifiedMarkerExists = fs.existsSync(path.join(migrationsPath, VERIFIED_MARKER))
  const issues = []

  if (directories.length === 0) {
    issues.push('No Prisma migration folders containing migration.sql were found.')
  }
  if (!verifiedMarkerExists) {
    issues.push(`The ${VERIFIED_MARKER} marker is absent; the deployed baseline has not been verified.`)
  }

  return {
    ready: issues.length === 0,
    directories,
    issues,
  }
}

function main() {
  const migrationsPath = path.resolve(process.cwd(), 'prisma/migrations')
  const readiness = getPrismaMigrationReadiness(migrationsPath)

  if (!readiness.ready) {
    console.error('Refusing to run Prisma Migrate: this repository has no verified Prisma migration baseline.')
    for (const issue of readiness.issues) console.error(`- ${issue}`)
    console.error('The loose root-level SQL files are not standard Prisma migrations.')
    console.error('Reconcile the deployed schema and migration history, then follow docs/database-migrations.md before enabling this workflow.')
    process.exitCode = 1
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
