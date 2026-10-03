export interface OrderConfirmationData {
  appUrl: string
  firstName: string
  email: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: string
    size?: string
    compression?: string
  }>
  subtotal: string
  shipping: string
  total: string
  shippingAddress?: {
    name: string
    address: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

export const getOrderConfirmationTemplate = (data: OrderConfirmationData) => {
  const { firstName, email, orderNumber, items, subtotal, shipping, total, shippingAddress } = data

  return {
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Lily Waist Line</title>
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
          .item {
            border-bottom: 1px solid #e5e5e5;
            padding: 15px 0;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-name {
            font-weight: 600;
            margin-bottom: 5px;
          }
          .item-details {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
          }
          .item-price {
            font-weight: 600;
            color: #000;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .price-row.total {
            font-weight: 600;
            font-size: 16px;
            border-top: 1px solid #e5e5e5;
            padding-top: 10px;
          }
          .address {
            background-color: #f8f8f8;
            padding: 20px;
            border-radius: 4px;
            font-size: 14px;
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
            <div>Order Confirmation</div>
          </div>
          
          <div class="content">
            <h1 class="title">Thank You, ${firstName}!</h1>
            <div class="order-number">Order Number: ${orderNumber}</div>
            
            <p>
              Your order has been received. We are holding the items while you complete payment and our team reviews your proof.
            </p>
            
            <div class="section">
              <div class="section-title">Order Items</div>
              ${items.map(item => `
                <div class="item">
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">
                    Quantity: ${item.quantity}
                    ${item.size ? `• Size: ${item.size}` : ''}
                    ${item.compression ? `• Compression: ${item.compression}` : ''}
                  </div>
                  <div class="item-price">${item.price}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <div class="section-title">Order Summary</div>
              <div class="price-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div class="price-row">
                <span>Shipping</span>
                <span>${shipping}</span>
              </div>
              <div class="price-row total">
                <span>Total</span>
                <span class="gold-accent">${total}</span>
              </div>
            </div>
            
            ${shippingAddress ? `
              <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="address">
                  <div><strong>${shippingAddress.name}</strong></div>
                  <div>${shippingAddress.address}</div>
                  <div>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</div>
                  <div>${shippingAddress.country}</div>
                </div>
              </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">What's Next?</div>
              <p>
                • Send payment and upload your proof within 24 hours of placing this order; otherwise the order will be cancelled and stock released<br>
                • If your proof is submitted on time, we keep the items reserved while our team reviews it<br>
                • Once payment is verified, your order will be processed for shipping and you will receive tracking details
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
Order Confirmation - Lily Waist Line

Dear ${firstName},

Thank you for your order! We are holding your items while you complete payment and our team reviews your proof.

Order Number: ${orderNumber}

Order Items:
${items.map(item => `
${item.name}
Quantity: ${item.quantity}${item.size ? ` • Size: ${item.size}` : ''}${item.compression ? ` • Compression: ${item.compression}` : ''}
Price: ${item.price}
`).join('\n')}

Order Summary:
Subtotal: ${subtotal}
Shipping: ${shipping}
Total: ${total}

${shippingAddress ? `
Shipping Address:
${shippingAddress.name}
${shippingAddress.address}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
${shippingAddress.country}
` : ''}

What's Next?
• Send payment and upload your proof within 24 hours of placing this order; otherwise the order will be cancelled and stock released
• If your proof is submitted on time, we keep the items reserved while our team reviews it
• Once payment is verified, your order will be processed for shipping and you will receive tracking details

This email was sent to ${email}. If you have any questions about your order, please contact our support team.

© 2026 Lily Waist Line
Luxury • Confidence • Transformation
    `,
  }
}
