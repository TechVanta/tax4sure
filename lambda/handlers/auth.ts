import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  findUserByUsernameOrEmail,
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUserPassword,
} from "../lib/dynamodb";
import { signToken } from "../lib/jwt";
import { ok, created, badRequest, unauthorized, serverError } from "../lib/response";

const JWT_SECRET = process.env.JWT_SECRET!;
const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
const SITE_URL = process.env.SITE_URL || "https://www.tax4sure.ca";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email required"),
  password: z.string().min(1, "Password required"),
});

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile: z.string().optional(),
});

function createMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
}

export async function handleLogin(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const { usernameOrEmail, password } = parsed.data;
    const user = await findUserByUsernameOrEmail(usernameOrEmail);
    if (!user) return unauthorized("Invalid credentials");

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return unauthorized("Invalid credentials");

    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.fullName,
    });

    return ok({
      token,
      user: { id: user.id, name: user.fullName, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    return serverError();
  }
}

export async function handleRegister(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0].message);

    const { fullName, email, username, password, mobile } = parsed.data;

    const existingByUsername = await findUserByUsername(username);
    if (existingByUsername) return badRequest("Username is already taken");

    const existingByEmail = await findUserByEmail(email);
    if (existingByEmail) return badRequest("An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser({
      fullName,
      email,
      username,
      passwordHash,
      mobile: mobile || "",
      createdAt: new Date().toISOString(),
    });

    return created({ message: "Account created successfully", userId: user.id });
  } catch (err) {
    console.error("Register error:", err);
    return serverError();
  }
}

export async function handleForgotPassword(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email } = body as { email?: string };
    if (!email) return badRequest("Email is required");

    const user = await findUserByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) {
      return ok({ message: "If that email is registered, a reset link has been sent." });
    }

    const resetToken = jwt.sign(
      { id: user.id, username: user.username, type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetUrl = `${SITE_URL}/reset-password?token=${resetToken}`;
    const mailer = createMailer();

    await mailer.sendMail({
      from: `"Tax4Sure" <${GMAIL_USER}>`,
      to: user.email,
      subject: "Reset your Tax4Sure password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
          <div style="background:#0D1F4E;padding:24px 30px;text-align:center;">
            <h1 style="color:#C9A84C;margin:0;font-size:26px;">Tax4Sure</h1>
          </div>
          <div style="background:#fff;padding:32px 30px;">
            <h2 style="color:#0D1F4E;margin:0 0 16px;">Reset Your Password</h2>
            <p style="color:#555;line-height:1.7;">Hi ${user.fullName},</p>
            <p style="color:#555;line-height:1.7;">We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="display:inline-block;background:#0D1F4E;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">Reset My Password</a>
            </div>
            <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
            <p style="color:#aaa;font-size:11px;word-break:break-all;">Or copy: ${resetUrl}</p>
          </div>
          <div style="background:#f9fafb;padding:14px 30px;border-top:1px solid #e0e0e0;text-align:center;">
            <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Tax4Sure. All rights reserved.</p>
          </div>
        </div>`,
    });

    return ok({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return serverError();
  }
}

export async function handleResetPassword(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body || "{}");
    const { token, password } = body as { token?: string; password?: string };

    if (!token || !password) return badRequest("Token and new password are required");
    if (password.length < 8) return badRequest("Password must be at least 8 characters");

    let payload: { id: string; username: string; type: string };
    try {
      payload = jwt.verify(token, JWT_SECRET) as typeof payload;
    } catch {
      return badRequest("Reset link is invalid or has expired. Please request a new one.");
    }

    if (payload.type !== "password_reset") return badRequest("Invalid reset token");

    const passwordHash = await bcrypt.hash(password, 12);
    await updateUserPassword(payload.username, passwordHash);

    return ok({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    return serverError();
  }
}
