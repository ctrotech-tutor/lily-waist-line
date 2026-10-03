import { emailService } from './email-service'

async function main(): Promise<void> {
  const verified = await emailService.verifyConnection()
  emailService.closeTransport()

  if (!verified) {
    console.error('SMTP launch check failed: email configuration is missing or the transport is unreachable.')
    process.exitCode = 1
    return
  }

  console.info('SMTP launch check passed: the configured transport is reachable.')
}

void main().catch((error: unknown) => {
  emailService.closeTransport()
  console.error('SMTP launch check failed:', error)
  process.exitCode = 1
})
