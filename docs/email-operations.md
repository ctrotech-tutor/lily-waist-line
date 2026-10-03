# Transactional email operations

## Launch gate

Email is required for account verification, password recovery, and payment follow-up. Configure these server-only variables in every Vercel environment that serves the app:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`

Do not commit real values. Before enabling customer traffic, run `npm run email:verify` with the same application and SMTP environment variables used by the deployment. The command exits non-zero when the SMTP configuration is incomplete or the transport cannot connect. It verifies the transport handshake only; it does not prove inbox placement or successful delivery after acceptance.

In staging, send and inspect each of these messages end-to-end: signup verification, verification resend, password reset, and payment instructions. Confirm the expected sender, links, SPF/DKIM alignment, spam placement, and provider-side bounce/rejection logs.

## Customer recovery behavior

- Payment recipient, amount, and any payment link are shown on the order page independently of email. If the instruction email fails, the customer sees that failure, can use the on-page details, and may retry the email.
- Signup still creates the account if its verification email fails, but the result warns the customer and the verification page directs them to resend or contact support. They should not submit signup again.
- Password-reset and verification-resend responses stay generic to avoid disclosing whether an email address has an account. They do not claim provider-confirmed delivery.
- “Accepted” means the configured SMTP server accepted the message. It does not mean the recipient's inbox accepted it.

## Remaining limitation

The app does not yet have a durable email outbox, automatic retry schedule, or bounce/delivery webhook monitoring. Failed attempts are logged and the payment/signup flows expose immediate recovery guidance, but transient failures in other transactional messages may require manual support follow-up. Add an outbox/provider event integration before treating email delivery as fully reliable.
