export interface OrderProcessingData {
  firstName: string
  email: string
  orderNumber: string
  items: Array<{ name: string; quantity: number }>
}

export const getOrderProcessingTemplate = (data: OrderProcessingData) => {
  const { firstName, orderNumber, items } = data

  const itemsHtml = items.map(item =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px;text-align:center">${item.quantity}</td></tr>`
  ).join('')

  return {
    subject: `Order Is Being Processed - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Processing - Lily Waist Line</title>
      <style>body{font-family:'Montserrat',sans-serif;line-height:1.6;color:#000;background:#fff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5}.header{background:#000;color:#fff;padding:30px;text-align:center}.logo{font-family:'Bodoni Moda',serif;font-size:24px;font-weight:600;letter-spacing:2px;margin-bottom:10px}.content{padding:40px 30px}.title{font-family:'Bodoni Moda',serif;font-size:28px;font-weight:600;margin:0 0 20px;color:#000}.badge{display:inline-block;background:#d4af37;color:#fff;padding:8px 20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:24px}.text{font-size:14px;color:#333;margin-bottom:16px;line-height:1.8}.table{width:100%;border-collapse:collapse;margin:24px 0}.table th{padding:10px 0;border-bottom:2px solid #000;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-align:left}.footer{border-top:1px solid #e5e5e5;padding:20px 30px;text-align:center;font-size:12px;color:#999}</style></head>
      <body>
        <div class="container">
          <div class="header"><div class="logo">LILY WAIST LINE</div><div style="font-size:12px;opacity:0.8;letter-spacing:1px">Premium Sculptwear</div></div>
          <div class="content">
            <h1 class="title">Your Order Is Being Processed</h1>
            <div class="badge">In Progress</div>
            <p class="text">Dear ${firstName},</p>
            <p class="text">Great news! Your order <strong>${orderNumber}</strong> is now being processed. Our team is carefully preparing your items for shipment.</p>
            <p class="text">You'll receive another email as soon as your order ships, along with tracking information so you can follow its journey to your doorstep.</p>
            <table class="table"><thead><tr><th>Item</th><th style="text-align:center">Qty</th></tr></thead><tbody>${itemsHtml}</tbody></table>
            <p class="text" style="color:#d4af37;font-weight:600">Thank you for your patience — we're crafting excellence for you.</p>
          </div>
          <div class="footer"><p>Lily Waist Line — Luxury Sculptwear</p></div>
        </div>
      </body>
      </html>`,
    text: `Your Order Is Being Processed - ${orderNumber}\n\nDear ${firstName},\n\nGreat news! Your order ${orderNumber} is now being processed. Our team is carefully preparing your items for shipment.\n\nYou'll receive another email as soon as your order ships.\n\nItems:\n${items.map(i => `- ${i.name} x${i.quantity}`).join('\n')}\n\nThank you for your patience.\n\nLily Waist Line`,
  }
}