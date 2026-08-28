import nodemailer from "nodemailer";

function escapeHtml(unsafe: string) {
  if (!unsafe) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const statusConfig: Record<
  string,
  { title: string; subtitle: string; color: string; badgeBg: string; badgeText: string; icon: string }
> = {
  pending: {
    title: "Order Received",
    subtitle: "We have received your order and are currently processing it.",
    color: "#f59e0b",
    badgeBg: "#fef3c7",
    badgeText: "#92400e",
    icon: "⏳",
  },
  confirmed: {
    title: "Order Confirmed!",
    subtitle: "Your order has been confirmed and is being prepared for dispatch.",
    color: "#2563eb",
    badgeBg: "#dbeafe",
    badgeText: "#1e40af",
    icon: "✅",
  },
  processing: {
    title: "Order Processing",
    subtitle: "Your order is being packed with care by our team.",
    color: "#8b5cf6",
    badgeBg: "#f3e8ff",
    badgeText: "#6b21a8",
    icon: "📦",
  },
  shipped: {
    title: "On Its Way!",
    subtitle: "Your order has been handed over to our courier partner for delivery.",
    color: "#0284c7",
    badgeBg: "#e0f2fe",
    badgeText: "#075985",
    icon: "🚚",
  },
    delivered: {
    title: "Order Delivered!",
    subtitle: "Your package has been successfully delivered. Thank you for choosing Grihinir Bari (গৃহিণীর বাড়ি)!",
    color: "#16a34a",
    badgeBg: "#dcfce7",
    badgeText: "#166534",
    icon: "🎉",
  },
  cancelled: {
    title: "Order Cancelled",
    subtitle: "Your order has been cancelled. If you have questions, please contact our support.",
    color: "#dc2626",
    badgeBg: "#fee2e2",
    badgeText: "#991b1b",
    icon: "❌",
  },
  returned: {
    title: "Order Returned",
    subtitle: "Your return request has been processed.",
    color: "#6b7280",
    badgeBg: "#f3f4f6",
    badgeText: "#374151",
    icon: "↩️",
  },
};

export async function sendCustomerOrderStatusEmail({
  recipientEmail,
  recipientName,
  orderNumber,
  orderStatus,
  items,
  subtotal,
  deliveryCharge,
  discountAmount,
  totalAmount,
  paymentMethod,
  shippingAddress,
  note,
}: {
  recipientEmail: string;
  recipientName: string;
  orderNumber: string;
  orderStatus: string;
  items: { title: string; quantity: number; price: number; image?: string; size?: string; color?: string }[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    district: string;
    zoneName?: string;
  };
  note?: string;
}) {
  try {
    const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
    const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
    const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!SMTP_USER || !SMTP_PASS || !recipientEmail) {
      console.log("Email sending skipped: SMTP parameters or recipient email missing");
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const statusInfo = statusConfig[orderStatus] || {
      title: `Order Status: ${orderStatus.toUpperCase()}`,
      subtitle: `Your order status has been updated to ${orderStatus}.`,
      color: "#18181b",
      badgeBg: "#f4f4f5",
      badgeText: "#18181b",
      icon: "📢",
    };

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "#";

    const itemsRows = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle;">
            <div style="font-weight: 600; color: #111827; font-size: 14px;">${escapeHtml(item.title)}</div>
            ${item.size ? `<div style="font-size: 12px; color: #6b7280;">Size: ${escapeHtml(item.size)}</div>` : ""}
            ${item.color ? `<div style="font-size: 12px; color: #6b7280;">Color: ${escapeHtml(item.color)}</div>` : ""}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #374151; font-size: 14px;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">
            ৳${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>
      `
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
    <!-- Logo Header -->
    <div style="text-align: center; padding: 20px 0;">
      <span style="font-size: 24px; font-weight: 900; letter-spacing: 1.5px; color: #7A4117; text-transform: uppercase;">গৃহিণীর বাড়ি • GRIHINIR BARI</span>
    </div>

    <!-- Main Card -->
    <div style="background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
      
      <!-- Status Header Banner -->
      <div style="background: ${statusInfo.color}; padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 40px; margin-bottom: 8px;">${statusInfo.icon}</div>
        <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800;">${statusInfo.title}</h1>
        <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">${statusInfo.subtitle}</p>
      </div>
      
      <!-- Order Info -->
      <div style="padding: 24px;">
        <div style="background: #fdfbf7; border: 1px solid #eadfcf; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Order Number:</td>
              <td style="text-align: right; font-weight: 700; color: #111827; font-family: monospace;">#${orderNumber}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Status:</td>
              <td style="text-align: right;">
                <span style="display: inline-block; background: ${statusInfo.badgeBg}; color: ${statusInfo.badgeText}; font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 9999px; text-transform: uppercase;">
                  ${orderStatus}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #111827;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Price Summary -->
        <div style="border-top: 2px solid #f3f4f6; padding-top: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Subtotal:</td>
              <td style="text-align: right; font-weight: 600; color: #111827;">৳${subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 4px 0;">Delivery Charge:</td>
              <td style="text-align: right; font-weight: 600; color: #111827;">৳${deliveryCharge.toLocaleString()}</td>
            </tr>
            ${discountAmount && discountAmount > 0 ? `
            <tr>
              <td style="color: #16a34a; padding: 4px 0;">Discount:</td>
              <td style="text-align: right; font-weight: 600; color: #16a34a;">-৳${discountAmount.toLocaleString()}</td>
            </tr>
            ` : ""}
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="font-size: 16px; font-weight: 800; color: #111827; padding: 12px 0 4px 0;">Total Amount:</td>
              <td style="text-align: right; font-size: 18px; font-weight: 800; color: #C88A2B; padding: 12px 0 4px 0;">৳${totalAmount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #9ca3af; padding: 0;">Payment Method:</td>
              <td style="text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; padding: 0;">${paymentMethod}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background: #fdfbf7; border: 1px solid #eadfcf; border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #7A4117; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</h4>
          <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
            <strong>${escapeHtml(shippingAddress.fullName)}</strong><br>
            Phone: ${escapeHtml(shippingAddress.phone)}<br>
            ${escapeHtml(shippingAddress.addressLine)}, ${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.district)}
            ${shippingAddress.zoneName ? `<br>Zone: ${escapeHtml(shippingAddress.zoneName)}` : ""}
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 28px;">
          <a href="${serverUrl}" target="_blank" style="display: inline-block; background: #C88A2B; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">
            Visit Grihinir Bari Store →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #fdfbf7; border-top: 1px solid #eadfcf; padding: 16px; text-align: center; font-size: 12px; color: #8c7662;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Grihinir Bari (গৃহিণীর বাড়ি). All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">If you have any questions, reply to this email or contact customer support.</p>
      </div>

    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Grihinir Bari Orders" <${SMTP_USER}>`,
      to: recipientEmail,
      subject: `[Grihinir Bari] Order #${orderNumber} Update - ${statusInfo.title}`,
      html,
    });
    console.log(`Order status update email sent to customer: ${recipientEmail}`);
  } catch (error) {
    console.error("Failed to send customer order status email:", error);
  }
}
