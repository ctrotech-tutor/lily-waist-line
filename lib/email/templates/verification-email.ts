export interface VerificationEmailData {
  appUrl: string
  firstName: string
  email: string
  verificationLink: string
}

export const getVerificationEmailTemplate = (data: VerificationEmailData) => {
  const { firstName, email, verificationLink } = data

  return {
    subject: 'Verify your email — Lily Waist Line',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
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
            <h1 class="title">Almost there, ${firstName}!</h1>
            <p class="subtitle">
              HEY, Thank you for creating your Lily Waist Line account. Please verify your email address to activate your account and start shopping.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" class="cta-button">
                Verify Email Address
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If the button above doesn't work, copy and paste the following link into your browser:
            </p>
            <p style="font-size: 12px; color: #999; word-break: break-all;">
              ${verificationLink}
            </p>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
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
Verify your email — Lily Waist Line

Almost there, ${firstName}!

Thank you for creating your Lily Waist Line account. Please verify your email address to activate your account and start shopping.

Verify Email Address: ${verificationLink}

If the button above doesn't work, copy and paste the link into your browser.

This link will expire in 24 hours. If you didn't create an account, please ignore this email.

This email was sent to ${email}.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}