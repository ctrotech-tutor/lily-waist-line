import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getAccountDeletionResult } from '../../lib/services/account/deletion-policy'

describe('account deletion safety policy', () => {
  it('rejects unauthenticated requests without describing account data', () => {
    assert.deepEqual(getAccountDeletionResult(false), {
      success: false,
      error: 'Unauthorized',
    })
  })

  it('fails closed for authenticated users and states that no data was removed', () => {
    const result = getAccountDeletionResult(true)

    assert.equal(result.success, false)
    assert.match(result.error, /contact support/i)
    assert.match(result.error, /no account data was removed/i)
  })
})
