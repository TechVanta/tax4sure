import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyToken, type JWTPayload } from "../lib/jwt";
import { ok, badRequest, unauthorized, serverError } from "../lib/response";

const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
const BUCKET = process.env.S3_BUCKET_NAME!;
const URL_EXPIRY = 60 * 60 * 24 * 7; // 7 days

const TAX_YEARS = [2022, 2023, 2024, 2025, 2026];

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

function getAuth(event: APIGatewayProxyEventV2): JWTPayload | null {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return verifyToken(auth.slice(7));
  } catch {
    return null;
  }
}

function getMimeFromExtension(ext: string): string {
  const map: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    csv: "text/csv",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
  };
  return map[ext.toLowerCase()] ?? "application/octet-stream";
}

async function listFilesForYear(username: string, year: string) {
  const prefix = `clients/${username}/${year}/`;
  const result = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix })
  );
  if (!result.Contents || result.Contents.length === 0) return [];

  return Promise.all(
    result.Contents.filter((obj) => obj.Key && obj.Key !== prefix)
      .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
      .map(async (obj) => {
        const key = obj.Key!;
        const rawFilename = key.split("/").pop() ?? key;
        const originalName = rawFilename.replace(/_\d{13}(\.[^.]+)$/, "$1");
        const ext = originalName.split(".").pop() ?? "";

        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({ Bucket: BUCKET, Key: key }),
          { expiresIn: URL_EXPIRY }
        );

        return {
          id: key,
          name: originalName,
          mimeType: getMimeFromExtension(ext),
          size: String(obj.Size ?? 0),
          createdTime: obj.LastModified?.toISOString() ?? new Date().toISOString(),
          webViewLink: url,
          webContentLink: url,
        };
      })
  );
}

export async function handleListFiles(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const user = getAuth(event);
  if (!user) return unauthorized();

  const year = event.queryStringParameters?.year;
  if (!year || !/^\d{4}$/.test(year)) return badRequest("Invalid year");

  try {
    const files = await listFilesForYear(user.username, year);
    return ok({ files });
  } catch (err) {
    console.error("List error:", err);
    return serverError();
  }
}

export async function handleStats(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const user = getAuth(event);
  if (!user) return unauthorized();

  try {
    const statsPromises = TAX_YEARS.map(async (year) => {
      const files = await listFilesForYear(user.username, String(year));
      return { year, count: files.length, lastUpdated: files[0]?.createdTime ?? null };
    });
    const stats = await Promise.all(statsPromises);
    return ok({ stats });
  } catch (err) {
    console.error("Stats error:", err);
    return serverError();
  }
}

export async function handleDeleteFile(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const user = getAuth(event);
  if (!user) return unauthorized();

  const fileId = event.queryStringParameters?.fileId;
  if (!fileId) return badRequest("fileId is required");

  // Ensure the file belongs to this user
  if (!fileId.startsWith(`clients/${user.username}/`)) {
    return unauthorized("You do not have permission to delete this file");
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: fileId }));
    return ok({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return serverError();
  }
}

export async function handlePresignUpload(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const user = getAuth(event);
  if (!user) return unauthorized();

  try {
    const body = JSON.parse(event.body || "{}");
    const { filename, mimeType, year } = body as {
      filename?: string;
      mimeType?: string;
      year?: string;
    };

    if (!filename || !mimeType || !year) return badRequest("filename, mimeType, and year are required");
    if (!ACCEPTED_MIME_TYPES.includes(mimeType)) return badRequest("File type not supported");
    if (!/^\d{4}$/.test(year)) return badRequest("Invalid year");

    // Build a unique S3 key
    const timestamp = Date.now();
    const dotIndex = filename.lastIndexOf(".");
    const base = dotIndex > -1 ? filename.slice(0, dotIndex) : filename;
    const ext = dotIndex > -1 ? filename.slice(dotIndex) : "";
    const uniqueFilename = `${base}_${timestamp}${ext}`;
    const key = `clients/${user.username}/${year}/${uniqueFilename}`;

    const uploadUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        ContentType: mimeType,
        Metadata: { originalName: filename, username: user.username, year },
      }),
      { expiresIn: 300 } // 5 minutes to complete the upload
    );

    return ok({ uploadUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return serverError();
  }
}
