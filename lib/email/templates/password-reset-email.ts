export interface PasswordResetEmailData {
  appUrl: string
  firstName: string
  email: string
  resetLink: string
}

export const getPasswordResetEmailTemplate = (data: PasswordResetEmailData) => {
  const { firstName, email, resetLink } = data

  return {
    subject: 'Reset your password — Lily Waist Line',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.6;
            color: #000;
            background-color: #fff;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #e5e5e5;
          }
          .header {
            background-color: #000;
            color: #fff;
            padding: 30px;
            text-align: center;
          }
          .logo {
            font-family: 'Bodoni Moda', serif;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          .content {
            padding: 40px 30px;
          }
          .title {
            font-family: 'Bodoni Moda', serif;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #000;
          }
          .subtitle {
            font-size: 16px;
            margin-bottom: 30px;
            color: #666;
          }
          .cta-button {
            display: inline-block;
            background-color: #d4af37;
            color: #000;
            padding: 15px 30px;
            text-decoration: none;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
          }
          .cta-button:hover {
            background-color: #b8941f;
          }
          .footer {
            background-color: #f8f8f8;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e5e5;
          }
          .gold-accent {
            color: #d4af37;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LILY WAIST LINE</div>
            <div>Premium Body Sculpting</div>
          </div>

          <div class="content">
            <h1 class="title">Reset your password, ${firstName}</h1>
            <p class="subtitle">
              We received a request to reset the password for your Lily Waist Line account. Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="cta-button">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button above doesn't work, copy and paste the following link into your browser:
            </p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">
              ${resetLink}
            </p>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>

            <p style="font-size: 14px; color: #666;">
              This email was sent to ${email}.
            </p>
          </div>

          <div class="footer">
            <div class="gold-accent">© 2026 Lily Waist Line</div>
            <div>Luxury • Confidence • Transformation</div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Reset your password — Lily Waist Line

Reset your password, ${firstName}

We received a request to reset the password for your Lily Waist Line account. Click the link below to create a new password.

Reset Password: ${resetLink}

If the button above doesn't work, copy and paste the link into your browser.

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.

This email was sent to ${email}.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}