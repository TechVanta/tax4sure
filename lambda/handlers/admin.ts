import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
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
const TAX_YEARS = ["2022", "2023", "2024", "2025", "2026"];

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
    const { password } = body as { password?: string };

    if (!password || password !== ADMIN_PASSWORD) {
      return unauthorized("Invalid admin credentials");
    }

    const token = signToken({
      id: "admin",
      username: "admin",
      email: "admin@tax4sure.internal",
      name: "Administrator",
      role: "admin",
    });

    return ok({ token, user: { name: "Administrator", role: "admin" } });
  } catch (err) {
    console.error("Admin login error:", err);
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
