"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Trash2,
  Download,
  FileImage,
  FileSpreadsheet,
  File,
  AlertTriangle,
  FolderOpen,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate, getFileTypeLabel } from "@/lib/utils";
import type { DriveFile } from "@/lib/types";
import { apiCall } from "@/lib/api-client";

interface DocumentListProps {
  files: DriveFile[];
  loading: boolean;
  onDeleted: () => void;
}

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  if (mimeType.includes("pdf")) return <FileText className={`${className} text-red-500`} />;
  if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv"))
    return <FileSpreadsheet className={`${className} text-green-600`} />;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return <FileText className={`${className} text-blue-600`} />;
  if (mimeType.includes("image")) return <FileImage className={`${className} text-purple-500`} />;
  return <File className={`${className} text-gray-500`} />;
}

function FileTypeBadge({ mimeType }: { mimeType: string }) {
  const label = getFileTypeLabel(mimeType);
  const colorMap: Record<string, string> = {
    PDF: "bg-red-100 text-red-700",
    Excel: "bg-green-100 text-green-700",
    CSV: "bg-green-100 text-green-700",
    Word: "bg-blue-100 text-blue-700",
    JPG: "bg-purple-100 text-purple-700",
    PNG: "bg-purple-100 text-purple-700",
    File: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colorMap[label] || colorMap.File}`}>
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-6">
        <FolderOpen className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">No documents yet</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Upload your first document using the drag-and-drop area above.
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground bg-gray-50 rounded-lg px-4 py-2">
        <span>Supported:</span>
        {["PDF", "DOCX", "XLSX", "JPG", "PNG", "CSV"].map((t) => (
          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
        ))}
      </div>
    </motion.div>
  );
}

export function DocumentList({ files, loading, onDeleted }: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmFile, setConfirmFile] = useState<DriveFile | null>(null);

  const handleDelete = async () => {
    if (!confirmFile) return;

    setDeletingId(confirmFile.id);
    setConfirmFile(null);

    try {
      const res = await apiCall(`/api/documents/delete?fileId=${encodeURIComponent(confirmFile.id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      toast.success(`${confirmFile.name} deleted`);
      onDeleted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4">
            <div className="h-10 w-10 rounded-xl skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 rounded skeleton" />
              <div className="h-3 w-32 rounded skeleton" />
            </div>
            <div className="h-8 w-16 rounded skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence>
          {files.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.04 }}
              className="doc-row"
            >
              {/* File icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                <FileTypeIcon mimeType={file.mimeType} className="h-5 w-5" />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <FileTypeBadge mimeType={file.mimeType} />
                  <span className="text-xs text-muted-foreground">
                    {file.size ? formatBytes(Number(file.size)) : "—"}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {formatDate(file.createdTime)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={file.webContentLink || file.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-navy-700/10">
                    <Download className="h-4 w-4 text-navy-700" />
                  </Button>
                </a>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50"
                  disabled={deletingId === file.id}
                  onClick={() => setConfirmFile(file)}
                >
                  {deletingId === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600 transition-colors" />
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmFile} onOpenChange={() => setConfirmFile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <DialogTitle>Delete Document</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{confirmFile?.name}&quot;
              </span>
              ? This action cannot be undone and the file will be permanently removed from storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmFile(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
