import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET_NAME!;
// Pre-signed URLs valid for 7 days
const URL_EXPIRY = 60 * 60 * 24 * 7;

export interface DriveFile {
  id: string;         // S3 object key
  name: string;       // original filename
  mimeType: string;
  size: string;
  createdTime: string;
  webViewLink: string;
  webContentLink: string;
}

function buildKey(username: string, year: string, filename: string): string {
  return `clients/${username}/${year}/${filename}`;
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

export async function uploadFileToDrive(
  username: string,
  year: string,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<DriveFile> {
  // Prefix filename with timestamp to avoid collisions
  const timestamp = Date.now();
  const dotIndex = fileName.lastIndexOf(".");
  const base = dotIndex > -1 ? fileName.slice(0, dotIndex) : fileName;
  const ext = dotIndex > -1 ? fileName.slice(dotIndex) : "";
  const uniqueFilename = `${base}_${timestamp}${ext}`;
  const key = buildKey(username, year, uniqueFilename);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        originalName: fileName,
        username,
        year,
      },
    })
  );

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    { expiresIn: URL_EXPIRY }
  );

  return {
    id: key,
    name: fileName,
    mimeType,
    size: String(buffer.length),
    createdTime: new Date().toISOString(),
    webViewLink: url,
    webContentLink: url,
  };
}

export async function listFilesInFolder(
  username: string,
  year: string
): Promise<DriveFile[]> {
  const prefix = `clients/${username}/${year}/`;

  try {
    const result = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix })
    );

    if (!result.Contents || result.Contents.length === 0) return [];

    const files = await Promise.all(
      result.Contents
        .filter((obj) => obj.Key && obj.Key !== prefix)
        .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
        .map(async (obj) => {
          const key = obj.Key!;
          // Strip the timestamp suffix to recover the original name
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
          } satisfies DriveFile;
        })
    );

    return files;
  } catch {
    return [];
  }
}

export async function deleteFileFromDrive(fileId: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: fileId }));
}

export async function ensureUserFolder(username: string): Promise<string> {
  // S3 folders are implicit — no creation needed
  return `clients/${username}`;
}

export async function ensureYearFolder(username: string, year: string): Promise<string> {
  return `clients/${username}/${year}`;
}

export async function getFileCountForYear(username: string, year: string): Promise<number> {
  const files = await listFilesInFolder(username, year);
  return files.length;
}

export async function getLatestUploadDate(username: string, year: string): Promise<string | null> {
  const files = await listFilesInFolder(username, year);
  return files[0]?.createdTime ?? null;
}
