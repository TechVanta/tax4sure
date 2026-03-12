import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getFileTypeColor(mimeType: string): string {
  if (mimeType.includes("pdf")) return "text-red-500";
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv"))
    return "text-green-600";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "text-blue-600";
  if (mimeType.includes("image")) return "text-purple-500";
  return "text-gray-500";
}

export function getFileTypeLabel(mimeType: string): string {
  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "Excel";
  if (mimeType.includes("csv")) return "CSV";
  if (mimeType.includes("word") || mimeType.includes("document")) return "Word";
  if (mimeType.includes("image/jpeg") || mimeType.includes("image/jpg")) return "JPG";
  if (mimeType.includes("image/png")) return "PNG";
  return "File";
}

export const TAX_YEARS = [2022, 2023, 2024, 2025, 2026];

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
