export interface OrderShippedData {
  firstName: string
  email: string
  orderNumber: string
  items: Array<{ name: string; quantity: number }>
}

export const getOrderShippedTemplate = (data: OrderShippedData) => {
  const { firstName, orderNumber, items } = data

  const itemsHtml = items.map(item =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #e5e5e5;font-size:14px;text-align:center">${item.quantity}</td></tr>`
  ).join('')

  return {
    subject: `Your Order Has Shipped - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Shipped - Lily Waist Line</title>
      <style>body{font-family:'Montserrat',sans-serif;line-height:1.6;color:#000;background:#fff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5}.header{background:#000;color:#fff;padding:30px;text-align:center}.logo{font-family:'Bodoni Moda',serif;font-size:24px;font-weight:600;letter-spacing:2px;margin-bottom:10px}.content{padding:40px 30px}.title{font-family:'Bodoni Moda',serif;font-size:28px;font-weight:600;margin:0 0 20px;color:#000}.badge{display:inline-block;background:#d4af37;color:#fff;padding:8px 20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:24px}.text{font-size:14px;color:#333;margin-bottom:16px;line-height:1.8}.table{width:100%;border-collapse:collapse;margin:24px 0}.table th{padding:10px 0;border-bottom:2px solid #000;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-align:left}.footer{border-top:1px solid #e5e5e5;padding:20px 30px;text-align:center;font-size:12px;color:#999}</style></head>
      <body>
        <div class="container">
          <div class="header"><div class="logo">LILY WAIST LINE</div><div style="font-size:12px;opacity:0.8;letter-spacing:1px">Premium Sculptwear</div></div>
          <div class="content">
            <h1 class="title">Your Order Has Shipped!</h1>
            <div class="badge">On Its Way</div>
            <p class="text">Dear ${firstName},</p>
            <p class="text">Your order <strong>${orderNumber}</strong> is on its way! It has left our facility and is heading to your delivery address.</p>
            <p class="text">Tracking details will be shared once the carrier provides them. You can check your order status anytime from your account dashboard.</p>
            <table class="table"><thead><tr><th>Item</th><th style="text-align:center">Qty</th></tr></thead><tbody>${itemsHtml}</tbody></table>
            <p class="text" style="color:#d4af37;font-weight:600">Get ready — your sculptwear is coming!</p>
          </div>
          <div class="footer"><p>Lily Waist Line — Luxury Sculptwear</p></div>
        </div>
      </body>
      </html>`,
    text: `Your Order Has Shipped - ${orderNumber}\n\nDear ${firstName},\n\nYour order ${orderNumber} is on its way! It has left our facility and is heading to your delivery address.\n\nTracking details will be shared once available.\n\nItems:\n${items.map(i => `- ${i.name} x${i.quantity}`).join('\n')}\n\nGet ready — your sculptwear is coming!\n\nLily Waist Line`,
  }
}