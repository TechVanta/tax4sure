"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Upload, FileIcon, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes, MAX_FILE_SIZE } from "@/lib/utils";
import { apiCall } from "@/lib/api-client";

interface UploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

interface DocumentUploaderProps {
  year: string;
  onUploaded: () => void;
}

export function DocumentUploader({ year, onUploaded }: DocumentUploaderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          toast.error(`${file.name}: ${errors[0]?.message || "File rejected"}`);
        });
      }

      const newUploads: UploadItem[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));

      setUploads((prev) => [...prev, ...newUploads]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    const pendingUploads = uploads.filter((u) => u.status === "pending");
    if (pendingUploads.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].status !== "pending") continue;

      setUploads((prev) =>
        prev.map((u, idx) => (idx === i ? { ...u, status: "uploading", progress: 10 } : u))
      );

      try {
        const upload = uploads[i];

        // Step 1: get a pre-signed S3 URL from Lambda
        const presignRes = await apiCall("/api/documents/presign-upload", {
          method: "POST",
          body: JSON.stringify({ filename: upload.file.name, mimeType: upload.file.type, year }),
        });

        if (!presignRes.ok) {
          const data = await presignRes.json();
          throw new Error(data.error || "Failed to get upload URL");
        }

        const { uploadUrl } = await presignRes.json();

        setUploads((prev) =>
          prev.map((u, idx) => (idx === i ? { ...u, progress: 40 } : u))
        );

        // Step 2: PUT directly to S3 using the pre-signed URL
        const s3Res = await fetch(uploadUrl, {
          method: "PUT",
          body: upload.file,
          headers: { "Content-Type": upload.file.type },
        });

        if (!s3Res.ok) throw new Error("Upload to storage failed");

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: "done", progress: 100 } : u
          )
        );

        toast.success(`${uploads[i].file.name} uploaded successfully`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: "error", progress: 0, error: message } : u
          )
        );
        toast.error(`${uploads[i].file.name}: ${message}`);
      }
    }

    setIsUploading(false);

    // Refresh document list if any uploads succeeded
    const hasSuccess = uploads.some((u) => u.status === "done");
    if (hasSuccess) {
      setTimeout(() => {
        onUploaded();
        setUploads((prev) => prev.filter((u) => u.status !== "done"));
      }, 1500);
    }
  };

  const pendingCount = uploads.filter((u) => u.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? "border-navy-700 bg-navy-700/5 scale-[1.01]"
            : "border-gray-300 bg-white hover:border-navy-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-200 ${
            isDragActive ? "bg-navy-700 text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          <Upload className="h-8 w-8" />
        </div>

        <p className="mt-4 text-base font-semibold text-gray-700">
          {isDragActive ? "Drop your files here" : "Drag & drop files here"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or <span className="text-navy-700 font-medium">click to browse</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          PDF, JPG, PNG, XLSX, CSV, DOCX — Max 25MB per file
        </p>
      </div>

      {/* Upload Queue */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploads.map((upload, i) => (
              <motion.div
                key={`${upload.file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    upload.status === "done"
                      ? "bg-green-100"
                      : upload.status === "error"
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  {upload.status === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : upload.status === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {upload.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">{formatBytes(upload.file.size)}</p>
                    {upload.status === "error" && (
                      <p className="text-xs text-red-500">{upload.error}</p>
                    )}
                    {upload.status === "done" && (
                      <p className="text-xs text-green-600 font-medium">Uploaded</p>
                    )}
                  </div>
                  {upload.status === "uploading" && (
                    <Progress value={upload.progress} className="mt-1.5 h-1" />
                  )}
                </div>

                {upload.status !== "uploading" && (
                  <button
                    onClick={() => removeUpload(i)}
                    className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}

            {pendingCount > 0 && (
              <Button
                onClick={uploadAll}
                disabled={isUploading}
                className="w-full mt-2"
                size="lg"
              >
                <Upload className="h-4 w-4" />
                {isUploading
                  ? "Uploading..."
                  : `Upload ${pendingCount} ${pendingCount === 1 ? "file" : "files"}`}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
