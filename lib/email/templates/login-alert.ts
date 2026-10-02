export interface LoginAlertData {
  appUrl: string
  firstName: string
  email: string
  loginTime: string
  loginLocation?: string
  device?: string
}

export const getLoginAlertTemplate = (data: LoginAlertData) => {
  const { appUrl, firstName, email, loginTime, loginLocation, device } = data

  return {
    subject: 'New Login to Your Lily Waist Line Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Alert - Lily Waist Line</title>
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
          .alert-box {
            background-color: #f8f8f8;
            border-left: 4px solid #d4af37;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .login-details {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .security-tips {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .security-tips h4 {
            margin-top: 0;
            color: #856404;
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
          .security-link {
            color: #d4af37;
            text-decoration: none;
            font-weight: 600;
          }
          .security-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LILY WAIST LINE</div>
            <div>Account Security</div>
          </div>

          <div class="content">
            <h1 class="title">New Login Detected</h1>

            <div class="alert-box">
              <strong>Hi ${firstName},</strong><br>
              We detected a new login to your Lily Waist Line account.
            </div>

            <div class="section">
              <div class="section-title">Login Details</div>
              <div class="login-details">
                <div class="detail-row">
                  <span>Time</span>
                  <span><strong>${loginTime}</strong></span>
                </div>
                ${loginLocation ? `
                  <div class="detail-row">
                    <span>Location</span>
                    <span><strong>${loginLocation}</strong></span>
                  </div>
                ` : ''}
                ${device ? `
                  <div class="detail-row">
                    <span>Device</span>
                    <span><strong>${device}</strong></span>
                  </div>
                ` : ''}
                <div class="detail-row">
                  <span>Account</span>
                  <span><strong>${email}</strong></span>
                </div>
              </div>
            </div>

            <div class="security-tips">
              <h4>Security Tips</h4>
              <ul>
                <li>If this was you, no action is needed</li>
                <li>If you don't recognize this login,
                  <a href="${appUrl}/reset-password" class="security-link">reset your password immediately</a>
                </li>
                <li>Never share your login credentials with anyone</li>
                <li>Use a unique, strong password for your account</li>
              </ul>
            </div>

            <div class="section">
              <div class="section-title">Account Actions</div>
              <p>
                <strong>Need help?</strong><br>
                • <a href="${appUrl}/reset-password" class="security-link">Reset Password</a><br>
                • <a href="${appUrl}/contact" class="security-link">Contact Support</a><br>
                • <a href="${appUrl}/account" class="security-link">Manage Account</a>
              </p>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This email was sent to ${email}. If you didn't attempt to log in,
              please secure your account immediately.
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
Login Alert - Lily Waist Line

Dear ${firstName},

We detected a new login to your Lily Waist Line account.

Login Details:
Time: ${loginTime}
${loginLocation ? `Location: ${loginLocation}` : ''}
${device ? `Device: ${device}` : ''}
Account: ${email}

Security Tips:
• If this was you, no action is needed
• If you don't recognize this login, reset your password immediately: ${appUrl}/reset-password
• Never share your login credentials with anyone
• Use a unique, strong password for your account

Account Actions:
• Reset Password: ${appUrl}/reset-password
• Contact Support: ${appUrl}/contact
• Manage Account: ${appUrl}/account

This email was sent to ${email}. If you didn't attempt to log in, please secure your account immediately.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
