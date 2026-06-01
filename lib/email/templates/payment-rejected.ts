export interface PaymentRejectedData {
  firstName: string
  email: string
  orderNumber: string
  paymentMethod: string
  amount: string
  reason?: string
  items: Array<{
    name: string
    quantity: number
  }>
}

export const getPaymentRejectedTemplate = (data: PaymentRejectedData) => {
  const { firstName, email, orderNumber, paymentMethod, amount, reason, items } = data

  return {
    subject: `Payment Not Approved - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Not Approved - Lily Waist Line</title>
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
          .alert-badge {
            background-color: #dc2626;
            color: #fff;
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
            color: #dc2626;
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
          .reason-box {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
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
          .cta-button {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 14px 28px;
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 1px;
            margin-top: 20px;
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
            <div>Payment Update</div>
          </div>
          
          <div class="content">
            <h1 class="title">Payment Not Approved</h1>
            
            <div class="alert-badge">
              ✕ Your payment was not approved
            </div>
            
            <div class="order-number">Order Number: ${orderNumber}</div>

            ${reason ? `
            <div class="reason-box">
              <strong>Reason:</strong><br>
              ${reason}
            </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="payment-details">
                <div class="detail-row">
                  <span>Payment Method</span>
                  <span><strong>${paymentMethod}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Amount</span>
                  <span><strong>${amount}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Payment Status</span>
                  <span style="color: #dc2626;"><strong>Rejected</strong></span>
                </div>
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
              <div class="section-title">What Happens Next?</div>
              <p>
                Your payment could not be verified. This may be due to an unclear screenshot, 
                incorrect amount, or missing transaction reference.
              </p>
              <p>
                <strong>You can submit a new payment proof</strong> from your order page. 
                Please ensure your screenshot clearly shows:
              </p>
              <ul>
                <li>The payment amount matching your order total</li>
                <li>The payment recipient details (${paymentMethod} handle/email)</li>
                <li>The transaction reference/confirmation</li>
              </ul>
              <a href="{{orderUrl}}" class="cta-button">Upload New Proof</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This email was sent to ${email}. If you have any questions, 
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
Payment Not Approved - Lily Waist Line

Dear ${firstName},

Your payment for order ${orderNumber} was not approved.

${reason ? `Reason: ${reason}` : ''}

Payment Details:
Payment Method: ${paymentMethod}
Amount: ${amount}
Payment Status: Rejected

Order Items:
${items.map(item => `${item.name} (Quantity: ${item.quantity})`).join('\n')}

What Happens Next?
Your payment could not be verified. You can submit a new payment proof from your order page.

Please ensure your screenshot clearly shows:
- The payment amount matching your order total
- The payment recipient details
- The transaction reference/confirmation

Upload a new proof at: {{orderUrl}}

This email was sent to ${email}. If you have any questions, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}