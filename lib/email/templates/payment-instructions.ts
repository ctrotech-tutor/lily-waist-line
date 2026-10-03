export interface PaymentInstructionsData {
  appUrl: string
  firstName: string
  email: string
  orderNumber: string
  orderId: string
  paymentMethod: string
  paymentLink: string | null
  paymentLabel: string
  amount: string
  items: Array<{
    name: string
    quantity: number
  }>
}

export const getPaymentInstructionsTemplate = (data: PaymentInstructionsData) => {
  const { appUrl, firstName, email, orderNumber, orderId, paymentMethod, paymentLink, paymentLabel, amount, items } = data
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!)
  const escapedRecipient = escapeHtml(paymentLabel)
  const escapedPaymentUrl = paymentLink && /^https:\/\/(cash\.app|www\.paypal\.me)\//.test(paymentLink)
    ? escapeHtml(paymentLink)
    : null
  const recipientHtml = escapedPaymentUrl
    ? `<a href="${escapedPaymentUrl}" style="color: #d4af37; text-decoration: underline;">${escapedRecipient}</a>`
    : `<strong>${escapedRecipient}</strong>`
  const paymentActionHtml = escapedPaymentUrl
    ? `Click the link below to open ${escapeHtml(paymentMethod)}:<br>${recipientHtml}`
    : `Open PayPal, choose Send, and enter this merchant email as the recipient: ${escapedRecipient}.`

  const uploadUrl = `${appUrl}/order/payment-proof/${orderId}`

  return {
    subject: `Payment Instructions - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Instructions - Lily Waist Line</title>
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
          .info-badge {
            background-color: #d4af37;
            color: #000;
            padding: 15px 25px;
            border-radius: 4px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
          }
          .order-number {
            font-size: 18px;
            font-weight: 600;
            color: #d4af37;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .payment-details {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .items-list {
            border: 1px solid #e5e5e5;
            border-radius: 4px;
            padding: 20px;
          }
          .item {
            border-bottom: 1px solid #e5e5e5;
            padding: 10px 0;
          }
          .item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .instructions {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .instructions ol {
            margin: 0;
            padding-left: 20px;
          }
          .instructions li {
            margin-bottom: 10px;
          }
          .instructions li:last-child {
            margin-bottom: 0;
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
          .button {
            display: inline-block;
            background-color: #d4af37;
            color: #000;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">LILY WAIST LINE</div>
            <div>Payment Instructions</div>
          </div>

          <div class="content">
            <h1 class="title">Complete Your Payment</h1>

            <div class="info-badge">
              Order #${orderNumber}
            </div>

            <p style="font-size: 16px; margin-bottom: 20px;">
              Dear ${firstName},
            </p>

            <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
              Thank you for your order! To complete your purchase, please send your payment using the details below.
            </p>

            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="payment-details">
                <div class="detail-row">
                  <span>Payment Method</span>
                  <span><strong>${paymentMethod}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Send To</span>
                  <span class="gold-accent">${recipientHtml}</span>
                </div>
                <div class="detail-row">
                  <span>Amount Due</span>
                  <span class="gold-accent"><strong>${amount}</strong></span>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Payment Instructions</div>
              <div class="instructions">
                <ol>
                  <li>${paymentActionHtml}</li>
                  <li>Send <strong>${amount}</strong> to the account above</li>
                  <li>Include your order number <strong>${orderNumber}</strong> in the payment note/reference</li>
                  <li>Take a screenshot of your payment confirmation showing the transaction details</li>
                  <li>Upload the screenshot below so we can verify your payment</li>
                </ol>
              </div>
              <div style="text-align: center;">
                <a href="${uploadUrl}" class="button">
                  Upload Payment Proof
                </a>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Order Items</div>
              <div class="items-list">
                ${items.map(item => `
                  <div class="item">
                    <div>${item.name}</div>
                    <div style="font-size: 14px; color: #666;">Quantity: ${item.quantity}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Important Notes</div>
              <ul style="font-size: 14px; color: #666; line-height: 1.8;">
                <li>Submit your payment proof within 24 hours of placing the order. After a timely proof is submitted, stock remains reserved while our team reviews it.</li>
                <li>Please include your order number in the payment reference to help us process your payment faster</li>
                <li>Your order will be processed within 24-48 hours after payment verification</li>
                <li>You will receive a confirmation email once your payment is verified</li>
                <li>If you have any questions, please contact our support team</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This email was sent to ${email}. If you have any questions about your order,
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
Payment Instructions - Lily Waist Line

Dear ${firstName},

Thank you for your order! To complete your purchase, please send your payment using the details below.

Order #${orderNumber}

Payment Details:
Payment Method: ${paymentMethod}
Send To: ${paymentLabel}${paymentLink ? ` (${paymentLink})` : ''}
Amount Due: ${amount}

Payment Instructions:
1. ${paymentLink ? `Open this link to pay: ${paymentLink}` : `Open PayPal and send to the merchant email above`}
2. Send ${amount} to the account above
3. Include your order number ${orderNumber} in the payment note/reference
4. Take a screenshot of your payment confirmation showing the transaction details
5. Upload your proof at: ${uploadUrl}

Order Items:
${items.map(item => `${item.name} (Quantity: ${item.quantity})`).join('\n')}

Important Notes:
- Submit your payment proof within 24 hours of placing the order. After a timely proof is submitted, stock remains reserved while our team reviews it.
- Please include your order number in the payment reference to help us process your payment faster
- Your order will be processed within 24-48 hours after payment verification
- You will receive a confirmation email once your payment is verified
- If you have any questions, please contact our support team

This email was sent to ${email}. If you have any questions about your order, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
