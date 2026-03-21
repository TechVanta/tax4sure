import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import nodemailer from "nodemailer";
import { ok, badRequest, serverError } from "../lib/response";

const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL || "tax4sureca@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const SITE_URL = process.env.SITE_URL || "https://www.tax4sure.ca";

const SUBJECT_LABELS: Record<string, string> = {
  "consultation": "Free Consultation Request",
  "personal-tax": "Personal Tax (T1)",
  "self-employed": "Self-Employed / Sole Proprietor",
  "corporate-tax": "Corporate Tax (T2)",
  "gst-hst": "GST / HST Returns",
  "bookkeeping": "Bookkeeping",
  "incorporation": "Corporation Incorporation",
  "business-registration": "Business Registration (Ontario)",
  "payroll": "Payroll & T4 Preparation",
  "cra-audit": "CRA Audit / Dispute Resolution",
  "rental-income": "Rental Property Income (T776)",
  "estate-trust": "Estate & Trust Tax (T3)",
  "non-resident": "Non-Resident / Newcomer Tax",
  "disability-tax-credit": "Disability Tax Credit (DTC)",
  "tax-advisory": "Tax Advisory & Planning",
  "newsletter": "Newsletter Subscription",
  "other": "General Inquiry",
};

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

export async function handleContactForm(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, phone, subject, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !subject || !message) {
      return badRequest("Name, email, subject, and message are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return badRequest("Invalid email address");

    const subjectLabel = SUBJECT_LABELS[subject] || "General Inquiry";
    const transporter = createTransporter();

    // 1. Notify admin
    await transporter.sendMail({
      from: `"Tax4Sure Contact Form" <${GMAIL_USER}>`,
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `[Tax4Sure] New Inquiry: ${subjectLabel} from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
          <div style="background:#0D1F4E;padding:24px 30px;">
            <h1 style="color:#C9A84C;margin:0;font-size:22px;letter-spacing:-0.5px;">Tax<span style="color:#C9A84C;">4</span><span style="color:#7EB3E8;">Sure</span></h1>
            <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:14px;">New Contact Form Submission</p>
          </div>
          <div style="background:#f9fafb;padding:30px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;font-weight:bold;color:#0D1F4E;width:100px;">Name</td><td style="padding:8px 0;color:#333;">${name}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0D1F4E;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#2B5BA8;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;font-weight:bold;color:#0D1F4E;">Phone</td><td style="padding:8px 0;color:#333;">${phone}</td></tr>` : ""}
              <tr><td style="padding:8px 0;font-weight:bold;color:#0D1F4E;">Subject</td><td style="padding:8px 0;color:#333;">${subjectLabel}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0;" />
            <p style="font-weight:bold;color:#0D1F4E;margin:0 0 10px;">Message:</p>
            <p style="color:#555;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
          </div>
        </div>`,
    });

    // 2. Confirmation to user
    await transporter.sendMail({
      from: `"Tax4Sure" <${GMAIL_USER}>`,
      to: email,
      subject: "We received your message — Tax4Sure",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
          <div style="background:#0D1F4E;padding:24px 30px;text-align:center;">
            <h1 style="color:#C9A84C;margin:0;font-size:26px;">Tax<span style="color:#C9A84C;">4</span><span style="color:#7EB3E8;">Sure</span></h1>
            <p style="color:rgba(255,255,255,0.65);margin:6px 0 0;font-size:13px;">Professional Canadian Tax Services</p>
          </div>
          <div style="background:#ffffff;padding:32px 30px;">
            <h2 style="color:#0D1F4E;margin:0 0 16px;">Thank you, ${name}! ✅</h2>
            <p style="color:#555;line-height:1.7;margin:0 0 16px;">
              We've received your inquiry about <strong>${subjectLabel}</strong> and will respond within <strong>1 business day</strong>.
            </p>
            <div style="background:#f5f7fa;border-left:4px solid #C9A84C;border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0;">
              <p style="margin:0;color:#0D1F4E;font-weight:bold;font-size:13px;">Your message summary:</p>
              <p style="margin:8px 0 0;color:#666;font-size:13px;line-height:1.6;">
                ${message.substring(0, 250)}${message.length > 250 ? "…" : ""}
              </p>
            </div>
            <p style="color:#555;line-height:1.7;margin:0 0 24px;">
              For urgent matters, email us directly at <a href="mailto:tax4sureca@gmail.com" style="color:#C9A84C;font-weight:bold;">tax4sureca@gmail.com</a>.
            </p>
            <a href="${SITE_URL}/login" style="display:inline-block;background:#0D1F4E;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px;">Access Client Portal</a>
          </div>
          <div style="background:#f9fafb;padding:16px 30px;border-top:1px solid #e0e0e0;text-align:center;">
            <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Tax4Sure. All rights reserved.</p>
          </div>
        </div>`,
    });

    return ok({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    return serverError("Failed to send message. Please try again.");
  }
}
