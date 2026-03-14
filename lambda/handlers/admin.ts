import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { listAllUsers } from "../lib/dynamodb";
import { signToken, verifyToken } from "../lib/jwt";
import { ok, badRequest, unauthorized, serverError } from "../lib/response";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET = process.env.S3_BUCKET_NAME!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tax4sureca@gmail.com";
const JWT_SECRET = process.env.JWT_SECRET!;
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const SITE_URL = process.env.SITE_URL || "https://d8nnmu6vr11v0.cloudfront.net";
function computeTaxYears(): string[] {
  const current = new Date().getFullYear();
  return [current, current - 1, current - 2, current - 3].map(String);
}
const TAX_YEARS = computeTaxYears();

function getAdminAuth(event: APIGatewayProxyEventV2) {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    const payload = verifyToken(auth.slice(7));
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

function createMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

async function countDocsForUser(username: string) {
  let totalDocs = 0;
  let lastUpload: string | null = null;

  for (const year of TAX_YEARS) {
    const prefix = `clients/${username}/${year}/`;
    const result = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix })
    );
    const items = result.Contents?.filter((o) => o.Key !== prefix) ?? [];
    totalDocs += items.length;
    const latest = items.sort(
      (a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0)
    )[0];
    if (latest?.LastModified) {
      const iso = latest.LastModified.toISOString();
      if (!lastUpload || iso > lastUpload) lastUpload = iso;
    }
  }
  return { totalDocs, lastUpload };
}

export async function handleAdminLogin(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return badRequest("Email and password are required");
    }

    // Validate email matches admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return unauthorized("Invalid admin credentials");
    }

    // Support bcrypt hashes stored in env var (future-proof) or plain comparison
    let passwordValid = false;
    if (ADMIN_PASSWORD.startsWith("$2")) {
      passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD);
    } else {
      passwordValid = password === ADMIN_PASSWORD;
    }

    if (!passwordValid) {
      return unauthorized("Invalid admin credentials");
    }

    const token = signToken({
      id: "admin",
      username: "admin",
      email: ADMIN_EMAIL,
      name: "Administrator",
      role: "admin",
    });

    return ok({ token, user: { name: "Administrator", role: "admin", email: ADMIN_EMAIL } });
  } catch (err) {
    console.error("Admin login error:", err);
    return serverError();
  }
}

export async function handleAdminForgotPassword(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email } = body as { email?: string };

    // Always return success to prevent enumeration
    if (!email || email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return ok({ message: "If that email is the admin email, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      { id: "admin", username: "admin", type: "admin_password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetUrl = `${SITE_URL}/admin/reset-password?token=${resetToken}`;
    const mailer = createMailer();

    await mailer.sendMail({
      from: `"Tax4Sure Admin" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: "Admin Password Reset — Tax4Sure",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
          <div style="background:#0D1F4E;padding:24px 30px;text-align:center;">
            <h1 style="color:#C9A84C;margin:0;font-size:26px;">Tax4Sure Admin</h1>
          </div>
          <div style="background:#fff;padding:32px 30px;">
            <h2 style="color:#0D1F4E;margin:0 0 16px;">Admin Password Reset</h2>
            <p style="color:#555;line-height:1.7;">A password reset was requested for the admin account. Click below to set a new admin password. This link expires in <strong>1 hour</strong>.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:#0D1F4E;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">Reset Admin Password</a>
            </div>
            <p style="color:#888;font-size:13px;">If you didn't request this, please secure your account immediately.</p>
          </div>
        </div>`,
    });

    return ok({ message: "If that email is the admin email, a reset link has been sent." });
  } catch (err) {
    console.error("Admin forgot password error:", err);
    return serverError();
  }
}

export async function handleAdminListClients(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  if (!getAdminAuth(event)) return unauthorized();

  try {
    const users = await listAllUsers();
    const clients = await Promise.all(
      users.map(async (user) => {
        const { totalDocs, lastUpload } = await countDocsForUser(user.username);
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
          totalDocs,
          lastUpload,
        };
      })
    );

    return ok({ clients });
  } catch (err) {
    console.error("Admin list clients error:", err);
    return serverError();
  }
}

export async function handleAdminListFiles(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  if (!getAdminAuth(event)) return unauthorized();

  const username = event.queryStringParameters?.username;
  const year = event.queryStringParameters?.year;

  if (!username) return badRequest("username is required");
  if (!year || !/^\d{4}$/.test(year)) return badRequest("Invalid year");

  try {
    const prefix = `clients/${username}/${year}/`;
    const result = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix })
    );

    if (!result.Contents || result.Contents.length === 0) {
      return ok({ files: [] });
    }

    const files = await Promise.all(
      result.Contents.filter((obj) => obj.Key && obj.Key !== prefix)
        .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
        .map(async (obj) => {
          const key = obj.Key!;
          const rawFilename = key.split("/").pop() ?? key;
          const originalName = rawFilename.replace(/_\d{13}(\.[^.]+)$/, "$1");
          const url = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: BUCKET, Key: key }),
            { expiresIn: 60 * 60 * 24 * 7 }
          );
          return {
            id: key,
            name: originalName,
            size: String(obj.Size ?? 0),
            createdTime: obj.LastModified?.toISOString() ?? new Date().toISOString(),
            url,
          };
        })
    );

    return ok({ files });
  } catch (err) {
    console.error("Admin list files error:", err);
    return serverError();
  }
}
