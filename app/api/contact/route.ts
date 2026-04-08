import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.CONTACT_EMAIL ?? "ravibhalala217@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER ?? "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD ?? "";

const SUBJECT_LABELS: Record<string, string> = {
  consultation: "Book a Free Consultation",
  "personal-tax": "Personal Tax Return (T1)",
  "self-employed": "Self-Employed / Sole Proprietor",
  "corporate-tax": "Corporate Tax Return (T2)",
  "gst-hst": "GST / HST Returns",
  bookkeeping: "Bookkeeping",
  incorporation: "Corporation Incorporation",
  "business-registration": "Business Registration (Ontario)",
  payroll: "Payroll & T4 Preparation",
  "cra-audit": "CRA Audit / Dispute Resolution",
  "rental-income": "Rental Property Income (T776)",
  "estate-trust": "Estate & Trust Tax (T3)",
  "non-resident": "Non-Resident / Newcomer Tax",
  "disability-tax-credit": "Disability Tax Credit (DTC)",
  "tax-advisory": "Tax Advisory & Planning",
  other: "General Inquiry",
};

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
    const transporter = createTransporter();

    // Notify admin
    await transporter.sendMail({
      from: `"Tax4Sure Contact Form" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `[Tax4Sure] New Inquiry: ${subjectLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#0D1F4E;padding:24px 32px;border-radius:10px 10px 0 0">
            <h2 style="color:#C9A84C;margin:0;font-size:20px">New Contact Form Submission</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:28px 32px;border-radius:0 0 10px 10px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:120px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0;font-weight:600"><a href="mailto:${email}" style="color:#0D1F4E">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0;font-weight:600">${phone}</td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#6b7280">Subject</td><td style="padding:8px 0;font-weight:600">${subjectLabel}</td></tr>
            </table>
            <div style="margin-top:20px;background:#f9fafb;border-radius:8px;padding:16px">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Message</p>
              <p style="margin:0;white-space:pre-wrap;font-size:14px">${message}</p>
            </div>
            <p style="margin-top:24px;font-size:12px;color:#9ca3af">
              Submitted via tax4sure.ca/contact
            </p>
          </div>
        </div>
      `,
    });

    // Confirmation to user
    await transporter.sendMail({
      from: `"Tax4Sure" <${GMAIL_USER}>`,
      to: email,
      subject: "We received your message — Tax4Sure",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
          <div style="background:#0D1F4E;padding:24px 32px;border-radius:10px 10px 0 0">
            <h2 style="color:#C9A84C;margin:0;font-size:20px">Thanks for reaching out, ${name.split(" ")[0]}!</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:28px 32px;border-radius:0 0 10px 10px">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6">
              We've received your message about <strong>${subjectLabel}</strong> and will get back to you within <strong>one business day</strong>.
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6">
              In the meantime, feel free to email us directly at
              <a href="mailto:tax4sureca@gmail.com" style="color:#0D1F4E;font-weight:600">tax4sureca@gmail.com</a>.
            </p>
            <div style="background:#f9fafb;border-radius:8px;padding:16px;font-size:13px;color:#6b7280">
              <strong>Your message:</strong><br/>
              <span style="white-space:pre-wrap">${message}</span>
            </div>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
            <p style="margin:0;font-size:13px;color:#9ca3af">
              Tax4Sure · Professional Tax Services · Canada<br/>
              <a href="https://www.tax4sure.ca" style="color:#9ca3af">www.tax4sure.ca</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
