import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

// ─── HTML Email Templates ──────────────────────────────
function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdfbf7;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Logo header -->
    <div style="text-align:center;padding:24px 0;">
      <span style="font-size:22px;font-weight:800;color:#7A4117;letter-spacing:-0.5px;">গৃহিণীর বাড়ি • GRIHINIR BARI</span>
    </div>
    <!-- Card -->
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);border:1px solid #eadfcf;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;font-size:12px;color:#8c7662;">
      <p style="margin:0;">© ${new Date().getFullYear()} Grihinir Bari (গৃহিণীর বাড়ি). All rights reserved.</p>
      <p style="margin:8px 0 0 0;">You received this email because you subscribed to Grihinir Bari updates.</p>
    </div>
  </div>
</body>
</html>`;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  buildHtml: (vars?: Record<string, string>) => string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Grihinir Bari! 🌾',
    buildHtml: () => wrapInLayout(`
      <div style="padding:40px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:#fef3c7;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">🌾</span>
        </div>
        <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#271c16;">গৃহিণীর বাড়িতে স্বাগতম!</h1>
        <p style="margin:0 0 24px;font-size:15px;color:#7a4117;line-height:1.6;">
          গৃহিণীর বাড়ি পরিবারের সাথে যুক্ত হওয়ার জন্য আপনাকে ধন্যবাদ! এখন থেকে ১০০% খাঁটি কাঠের ঘানিভাঙা সরষের তেল ও বিশেষ অফার পাবেন সরাসরি সবার আগে।
        </p>
        <div style="background:#fdfbf7;border:1px solid #eadfcf;border-radius:12px;padding:20px;margin:0 0 24px;">
          <p style="margin:0;font-size:13px;color:#7a4117;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">আমাদের প্রতিশ্রুতি</p>
          <p style="margin:8px 0 0;font-size:14px;color:#271c16;line-height:1.6;">✨ ১০০% খাঁটি দেশি সরিষা<br/>🪵 সনাতন কাঠের ঘানি কোল্ড-প্রেসড<br/>🚚 সারা দেশে ক্যাশ অন ডেলিভারি</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="display:inline-block;background:#C88A2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;">
          তেল সম্ভার দেখুন →
        </a>
      </div>
    `),
  },
  {
    id: 'promo',
    name: 'Promotional Offer',
    subject: 'গৃহিণীর বাড়ি স্পেশাল অফার! 🔥',
    buildHtml: (vars) => wrapInLayout(`
      <div style="background:linear-gradient(135deg,#1D4D4F 0%,#163A3C 100%);padding:40px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#FDE68A;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Special Heritage Offer</p>
        <h1 style="margin:0 0 8px;font-size:48px;font-weight:800;color:#ffffff;">${vars?.discount || '১০% ছাড়'}</h1>
        <p style="margin:0;font-size:16px;color:#DBEBEB;">আপনার পরবর্তী অর্ডারে</p>
      </div>
      <div style="padding:32px;text-align:center;">
        <p style="margin:0 0 24px;font-size:15px;color:#7a4117;line-height:1.6;">
          ${vars?.message || "আমাদের সম্মানিত গ্রাহকদের জন্য বিশেষ ছাড়ের সুযোগ। চেকআউটে নিচের কুপন কোডটি ব্যবহার করুন!"}
        </p>
        <div style="background:#fdfbf7;border:2px dashed #C88A2B;border-radius:12px;padding:16px;margin:0 0 24px;display:inline-block;min-width:200px;">
          <p style="margin:0;font-size:12px;color:#7a4117;font-weight:600;">কুপন কোড</p>
          <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#C88A2B;letter-spacing:3px;">${vars?.code || 'GRIHINIR10'}</p>
        </div>
        <br/>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="display:inline-block;background:#C88A2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;">
          অর্ডার করুন →
        </a>
        <p style="margin:16px 0 0;font-size:12px;color:#8c7662;">সীমিত সময়ের জন্য অফারটি প্রযোজ্য।</p>
      </div>
    `),
  },
  {
    id: 'new-arrival',
    name: 'New Arrival Announcement',
    subject: 'নতুন ঘানিভাঙা ফ্রেশ ব্যাচ প্রস্তুত! ✨',
    buildHtml: (vars) => wrapInLayout(`
      <div style="padding:40px 32px;text-align:center;">
        <div style="width:64px;height:64px;background:#fef3c7;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;">✨</span>
        </div>
        <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#271c16;">নতুন ফ্রেশ ব্যাচের সরষের তেল</h1>
        <p style="margin:0 0 24px;font-size:15px;color:#7a4117;line-height:1.6;">
          ${vars?.message || "বাছাইকৃত দেশি সরিষার ফ্রেশ ব্যাচ কাঠের ঘানিতে ভাঙানো হয়েছে। আজই অর্ডার করে পরিবারের জন্য খাঁটি পুষ্টি নিশ্চিত করুন!"}
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="display:inline-block;background:#C88A2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;">
          ক্যাটালগ দেখুন →
        </a>
      </div>
    `),
  },
  {
    id: 'newsletter',
    name: 'Newsletter / Update',
    subject: 'গৃহিণীর বাড়ি সাপ্তাহিক বার্তা 📬',
    buildHtml: (vars) => wrapInLayout(`
      <div style="padding:40px 32px;">
        <h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#271c16;text-align:center;">
          ${vars?.heading || '📬 ঘানি বার্তা ও স্বাস্থ্যকথা'}
        </h1>
        <div style="font-size:15px;color:#3f3f46;line-height:1.7;">
          ${vars?.body || '<p>গৃহিণীর বাড়ির সাথে থাকার জন্য ধন্যবাদ! খাঁটি সরষের তেল ও পুষ্টির খুঁটিনাটি নিয়ে আমাদের এই সপ্তাহের বিশেষ আয়োজন।</p>'}
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" style="display:inline-block;background:#C88A2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;">
            ভিজিট করুন →
          </a>
        </div>
      </div>
    `),
  },
  {
    id: 'custom',
    name: 'Custom Email',
    subject: '',
    buildHtml: (vars) => wrapInLayout(`
      <div style="padding:40px 32px;">
        <div style="font-size:15px;color:#3f3f46;line-height:1.7;">
          ${vars?.body || ''}
        </div>
      </div>
    `),
  },
];

// ─── GET: Return available templates ────────────────────
export async function GET() {
  return NextResponse.json({
    templates: EMAIL_TEMPLATES.map((t) => ({
      id: t.id,
      name: t.name,
      defaultSubject: t.subject,
    })),
  });
}

// ─── POST: Send email ───────────────────────────────────
export async function POST(request: Request) {
  // Protect route – only authenticated admin users
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const isAdmin = process.env.CONTACT_RECEIVER
    ? user.emailAddresses.some((e) => e.emailAddress === process.env.CONTACT_RECEIVER)
    : false;
  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { templateId, subject, body, recipients, variables } = await request.json();

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
  }

  // Find template
  const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return NextResponse.json({ error: 'Invalid template' }, { status: 400 });
  }

  const finalSubject = subject || template.subject || 'Message from Grihinir Bari';
  const html = template.buildHtml({ ...variables, body });

  const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER;
  const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    // Send in batches of 10 to avoid rate limits
    const BATCH_SIZE = 10;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((email: string) =>
          transporter.sendMail({
            from: `"Grihinir Bari" <${SMTP_USER}>`,
            to: email,
            subject: finalSubject,
            html,
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      sent: recipients.length,
      message: `Successfully sent to ${recipients.length} recipient(s)`,
    });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
