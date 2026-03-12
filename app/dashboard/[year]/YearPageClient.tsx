"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, RefreshCw } from "lucide-react";
import { DocumentUploader } from "@/components/dashboard/DocumentUploader";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TAX_YEARS } from "@/lib/utils";
import { apiCall } from "@/lib/api-client";
import type { DriveFile } from "@/lib/s3-storage";

interface PageProps {
  params: { year: string };
}

export default function YearPageClient({ params }: PageProps) {
  const { year } = params;
  const router = useRouter();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const yearNum = parseInt(year);
  const isValidYear = TAX_YEARS.includes(yearNum);

  useEffect(() => {
    if (!isValidYear) {
      router.push("/dashboard");
    }
  }, [isValidYear, router]);

  const fetchFiles = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiCall(`/api/documents/list?year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isValidYear) {
      fetchFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, isValidYear]);

  if (!isValidYear) return null;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-700">
              <FolderOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-700">Tax Year {year}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? "Loading..." : `${files.length} ${files.length === 1 ? "document" : "documents"}`}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchFiles(true)}
            disabled={refreshing || loading}
            className="gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
      >
        <h2 className="text-base font-semibold text-navy-700 mb-4">Upload Documents</h2>
        <DocumentUploader
          year={year}
          onUploaded={() => fetchFiles(true)}
        />
      </motion.section>

      <Separator className="mb-6" />

      {/* Document List Section */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-navy-700">
            Your Documents
          </h2>
          {!loading && files.length > 0 && (
            <span className="text-xs text-muted-foreground bg-gray-100 px-2.5 py-1 rounded-full">
              {files.length} {files.length === 1 ? "file" : "files"}
            </span>
          )}
        </div>

        <DocumentList
          files={files}
          loading={loading}
          onDeleted={() => fetchFiles(true)}
        />
      </motion.section>
    </div>
  );
}
