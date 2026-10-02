export interface OrderCancelledData {
  appUrl: string
  firstName: string
  email: string
  orderNumber: string
  reason?: string
}

export const getOrderCancelledTemplate = (data: OrderCancelledData) => {
  const { firstName, orderNumber, reason } = data

  return {
    subject: `Order Cancelled - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Cancelled - Lily Waist Line</title>
      <style>body{font-family:'Montserrat',sans-serif;line-height:1.6;color:#000;background:#fff;margin:0;padding:20px}.container{max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5}.header{background:#000;color:#fff;padding:30px;text-align:center}.logo{font-family:'Bodoni Moda',serif;font-size:24px;font-weight:600;letter-spacing:2px;margin-bottom:10px}.content{padding:40px 30px}.title{font-family:'Bodoni Moda',serif;font-size:28px;font-weight:600;margin:0 0 20px;color:#000}.badge{display:inline-block;background:#dc3545;color:#fff;padding:8px 20px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:24px}.text{font-size:14px;color:#333;margin-bottom:16px;line-height:1.8}.cta{display:inline-block;background:#d4af37;color:#fff!important;padding:14px 32px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;margin:20px 0}.footer{border-top:1px solid #e5e5e5;padding:20px 30px;text-align:center;font-size:12px;color:#999}</style></head>
      <body>
        <div class="container">
          <div class="header"><div class="logo">LILY WAIST LINE</div><div style="font-size:12px;opacity:0.8;letter-spacing:1px">Premium Sculptwear</div></div>
          <div class="content">
            <h1 class="title">Order Cancelled</h1>
            <div class="badge" style="background:#dc3545">Cancelled</div>
            <p class="text">Dear ${firstName},</p>
            <p class="text">Your order <strong>${orderNumber}</strong> has been cancelled.</p>
            ${reason ? `<p class="text">Reason: ${reason}</p>` : ''}
            <p class="text">If you have any questions or would like assistance, our support team is here to help. Visit our contact page to reach out.</p>
            <p class="text">We look forward to serving you in the future.</p>
            <p class="text" style="color:#d4af37;font-weight:600">With care, Lily Waist Line</p>
          </div>
          <div class="footer"><p>Lily Waist Line — Luxury Sculptwear</p></div>
        </div>
      </body>
      </html>`,
    text: `Order Cancelled - ${orderNumber}\n\nDear ${firstName},\n\nYour order ${orderNumber} has been cancelled.${reason ? `\n\nReason: ${reason}` : ''}\n\nIf you have any questions, please contact our support team.\n\nWith care,\nLily Waist Line`,
  }
}