import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isLoginEmailUnchanged,
  updateProfileSchema,
} from '../../lib/validators/account/update-profile'

describe('account profile policy', () => {
  it('trims profile fields and allows an optional phone number', () => {
    assert.deepEqual(updateProfileSchema.parse({
      fullName: '  Riley Customer  ',
      email: '  riley@example.com  ',
      phone: '  +1 555 0100  ',
    }), {
      fullName: 'Riley Customer',
      email: 'riley@example.com',
      phone: '+1 555 0100',
    })
    assert.equal(updateProfileSchema.safeParse({
      fullName: 'Riley Customer',
      email: 'riley@example.com',
      phone: '',
    }).success, true)
  })

  it('rejects invalid names, email addresses, and excessively long phone values', () => {
    assert.equal(updateProfileSchema.safeParse({ fullName: 'R', email: 'riley@example.com' }).success, false)
    assert.equal(updateProfileSchema.safeParse({ fullName: 'Riley Customer', email: 'not-an-email' }).success, false)
    assert.equal(updateProfileSchema.safeParse({
      fullName: 'Riley Customer',
      email: 'riley@example.com',
      phone: '1'.repeat(33),
    }).success, false)
  })

  it('allows only the existing auth email, ignoring case and surrounding spaces', () => {
    assert.equal(isLoginEmailUnchanged('Riley@Example.com', ' riley@example.com '), true)
    assert.equal(isLoginEmailUnchanged('riley@example.com', 'new@example.com'), false)
  })
})
