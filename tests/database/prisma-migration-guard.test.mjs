import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, it } from 'node:test'
import {
  VERIFIED_MARKER,
  findPrismaMigrationDirectories,
  getPrismaMigrationReadiness,
} from '../../tools/check-prisma-migration-history.mjs'

const temporaryDirectories = []

function makeMigrationRoot() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prisma-migration-guard-'))
  temporaryDirectories.push(directory)
  return directory
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

describe('Prisma migration readiness guard', () => {
  it('does not mistake loose root-level SQL files for Prisma migrations', () => {
    const root = makeMigrationRoot()
    fs.writeFileSync(path.join(root, '001_legacy.sql'), 'SELECT 1;')
    fs.writeFileSync(path.join(root, '002_indexes.sql'), 'SELECT 1;')

    assert.deepEqual(findPrismaMigrationDirectories(root), [])
    assert.equal(getPrismaMigrationReadiness(root).ready, false)
  })

  it('requires an explicit baseline-verification marker even when a migration folder exists', () => {
    const root = makeMigrationRoot()
    const migration = path.join(root, '20261003_baseline')
    fs.mkdirSync(migration)
    fs.writeFileSync(path.join(migration, 'migration.sql'), 'SELECT 1;')

    const readiness = getPrismaMigrationReadiness(root)
    assert.deepEqual(readiness.directories, ['20261003_baseline'])
    assert.equal(readiness.ready, false)
    assert.match(readiness.issues.join(' '), new RegExp(VERIFIED_MARKER))
  })

  it('allows the migration commands only when both history and its verified marker exist', () => {
    const root = makeMigrationRoot()
    const migration = path.join(root, '20261003_baseline')
    fs.mkdirSync(migration)
    fs.writeFileSync(path.join(migration, 'migration.sql'), 'SELECT 1;')
    fs.writeFileSync(path.join(root, VERIFIED_MARKER), 'Baseline reviewed and approved.\n')

    assert.equal(getPrismaMigrationReadiness(root).ready, true)
  })
})
