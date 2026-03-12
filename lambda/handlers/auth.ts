import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  findUserByUsernameOrEmail,
  findUserByUsername,
  findUserByEmail,
  createUser,
} from "../lib/dynamodb";
import { signToken } from "../lib/jwt";
import { ok, created, badRequest, unauthorized, serverError } from "../lib/response";

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
