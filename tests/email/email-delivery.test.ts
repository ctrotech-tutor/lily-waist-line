import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { sendEmailWithResult } from '../../lib/services/email/email-delivery'
import type { EmailMessage, EmailSendResult } from '../../types/email'

const message: EmailMessage = {
  to: 'customer@example.com',
  subject: 'Payment instructions',
  text: 'Test message',
}

describe('email delivery result propagation', () => {
  it('returns an SMTP acceptance result to the caller', async () => {
    const accepted: EmailSendResult = { success: true, messageId: 'message-123' }
    const result = await sendEmailWithResult(message, async (sentMessage) => {
      assert.equal(sentMessage, message)
      return accepted
    })

    assert.deepEqual(result, accepted)
  })

  it('preserves an explicit provider failure instead of converting it to success', async () => {
    const rejected: EmailSendResult = { success: false, error: 'Mailbox rejected' }
    const result = await sendEmailWithResult(message, async () => rejected)

    assert.deepEqual(result, rejected)
  })

  it('normalizes unexpected sender exceptions into a failure result', async () => {
    const result = await sendEmailWithResult(message, async () => {
      throw new Error('SMTP connection lost')
    })

    assert.deepEqual(result, { success: false, error: 'SMTP connection lost' })
  })
})
