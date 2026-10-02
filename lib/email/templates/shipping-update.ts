export interface ShippingUpdateData {
  appUrl: string
  firstName: string
  email: string
  orderNumber: string
  carrier: string
  trackingNumber: string
  estimatedDelivery: string
  items: Array<{
    name: string
    quantity: number
  }>
}

export const getShippingUpdateTemplate = (data: ShippingUpdateData) => {
  const { firstName, email, orderNumber, carrier, trackingNumber, estimatedDelivery, items } = data

  return {
    subject: `Your Order Has Shipped - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipping Update - Lily Waist Line</title>
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
          .tracking-info {
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
          .tracking-number {
            font-family: monospace;
            font-size: 16px;
            font-weight: 600;
            color: #d4af37;
            background-color: #fff;
            padding: 10px;
            border: 1px solid #d4af37;
            border-radius: 4px;
            text-align: center;
            margin: 10px 0;
          }
          .track-button {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 12px 25px;
            text-decoration: none;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 15px 0;
            border-radius: 4px;
          }
          .track-button:hover {
            background-color: #333;
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
            <div>Shipping Update</div>
          </div>
          
          <div class="content">
            <h1 class="title">Your Order Has Shipped!</h1>
            
            <div class="success-badge">
              ✓ Your order is on its way
            </div>
            
            <div class="order-number">Order Number: ${orderNumber}</div>
            
            <div class="section">
              <div class="section-title">Tracking Information</div>
              <div class="tracking-info">
                <div class="detail-row">
                  <span>Carrier</span>
                  <span><strong>${carrier}</strong></span>
                </div>
                <div class="detail-row">
                  <span>Tracking Number</span>
                </div>
                <div class="tracking-number">${trackingNumber}</div>
                <div class="detail-row">
                  <span>Estimated Delivery</span>
                  <span class="gold-accent"><strong>${estimatedDelivery}</strong></span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="#" class="track-button">
                  Track Package
                </a>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Shipped Items</div>
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
              <div class="section-title">Delivery Information</div>
              <p>
                Your package will be delivered to your shipping address. Please ensure someone is available 
                to receive the package during business hours.
              </p>
              <p>
                <strong>Shipping Tips:</strong><br>
                • Track your package using the tracking number above<br>
                • Sign up for delivery notifications from ${carrier}<br>
                • Contact us immediately if there are any delivery issues
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              This email was sent to ${email}. If you have any questions about your shipment, 
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
Shipping Update - Lily Waist Line

Dear ${firstName},

Great news! Your order has shipped and is on its way to you.

Order Number: ${orderNumber}

Tracking Information:
Carrier: ${carrier}
Tracking Number: ${trackingNumber}
Estimated Delivery: ${estimatedDelivery}

Shipped Items:
${items.map(item => `${item.name} (Quantity: ${item.quantity})`).join('\n')}

Delivery Information:
Your package will be delivered to your shipping address. Please ensure someone is available to receive the package during business hours.

Shipping Tips:
• Track your package using the tracking number above
• Sign up for delivery notifications from ${carrier}
• Contact us immediately if there are any delivery issues

This email was sent to ${email}. If you have any questions about your shipment, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
