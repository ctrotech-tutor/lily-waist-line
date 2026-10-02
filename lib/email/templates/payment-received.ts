export interface PaymentReceivedData {
  appUrl: string
  firstName: string
  email: string
  orderNumber: string
  paymentMethod: string
  amount: string
  items: Array<{
    name: string
    quantity: number
  }>
}

export const getPaymentReceivedTemplate = (data: PaymentReceivedData) => {
  const { firstName, email, orderNumber, paymentMethod, amount, items } = data

  return {
    subject: `Payment Received - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Received - Lily Waist Line</title>
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
          .success-badge {
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
            <div>Payment Confirmation</div>
          </div>
          
          <div class="content">
            <h1 class="title">Payment Received!</h1>
            
            <div class="success-badge">
              ✓ Your payment has been successfully processed
            </div>
            
            <div class="order-number">Order Number: ${orderNumber}</div>
            
            <div class="section">
              <div class="section-title">Payment Details</div>
              <div class="payment-details">
                <div class="detail-row">
                  <span>Payment Method</span>
                  <span><strong>${paymentMethod}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Amount Paid</span>
                  <span class="gold-accent"><strong>${amount}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Payment Status</span>
                  <span style="color: #28a745;"><strong>Confirmed</strong></span>
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
              <div class="section-title">What's Next?</div>
              <p>
                Your order is now being prepared for shipment. You'll receive another email 
                with tracking information once your order ships.
              </p>
              <p>
                <strong>Expected Timeline:</strong><br>
                • Order processing: 1-2 business days<br>
                • Shipping: 3-5 business days (domestic)<br>
                • International shipping: 7-14 business days
              </p>
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
Payment Received - Lily Waist Line

Dear ${firstName},

Great news! Your payment has been successfully processed.

Order Number: ${orderNumber}

Payment Details:
Payment Method: ${paymentMethod}
Amount Paid: ${amount}
Payment Status: Confirmed ✓

Order Items:
${items.map(item => `${item.name} (Quantity: ${item.quantity})`).join('\n')}

What's Next?
Your order is now being prepared for shipment. You'll receive another email with tracking information once your order ships.

Expected Timeline:
• Order processing: 1-2 business days
• Shipping: 3-5 business days (domestic)
• International shipping: 7-14 business days

This email was sent to ${email}. If you have any questions about your order, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
