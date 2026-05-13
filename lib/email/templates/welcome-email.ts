export interface WelcomeEmailData {
  firstName: string
  email: string
}

export const getWelcomeEmailTemplate = (data: WelcomeEmailData) => {
  const { firstName, email } = data

  return {
    subject: 'Welcome to Lily Waist Line',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Lily Waist Line</title>
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
            <h1 class="title">Welcome, ${firstName}!</h1>
            <p class="subtitle">
              Thank you for joining Lily Waist Line. Your journey to confidence and transformation begins today.
            </p>
            
            <p>
              We're thrilled to have you as part of our exclusive community. Our premium waist trainers are designed 
              to sculpt your silhouette and boost your confidence with every wear.
            </p>
            
            <p>
              <strong>What's next?</strong><br>
              • Explore our curated collection of premium waist trainers<br>
              • Discover your perfect size and compression level<br>
              • Join thousands of satisfied customers worldwide
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://lilywaistline.com/shop" class="cta-button">
                Shop Now
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This email was sent to ${email}. If you didn't create an account, 
              please contact our support team.
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
Welcome to Lily Waist Line

Dear ${firstName},

Thank you for joining Lily Waist Line. Your journey to confidence and transformation begins today.

We're thrilled to have you as part of our exclusive community. Our premium waist trainers are designed to sculpt your silhouette and boost your confidence with every wear.

What's next?
• Explore our curated collection of premium waist trainers
• Discover your perfect size and compression level  
• Join thousands of satisfied customers worldwide

Shop Now: https://lilywaistline.com/shop

This email was sent to ${email}. If you didn't create an account, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
