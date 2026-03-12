"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FolderOpen, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface YearFolderCardProps {
  year: number;
  fileCount: number;
  lastUpdated: string | null;
  index: number;
}

export function YearFolderCard({ year, fileCount, lastUpdated, index }: YearFolderCardProps) {
  const router = useRouter();

  const isCurrentYear = year === new Date().getFullYear();
  const isEmpty = fileCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      onClick={() => router.push(`/dashboard/${year}`)}
      className="year-card group relative cursor-pointer"
    >
      {/* Current year badge */}
      {isCurrentYear && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge variant="gold" className="text-xs font-semibold shadow-sm">
            Current Year
          </Badge>
        </div>
      )}

      {/* Folder icon */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
            isEmpty
              ? "bg-gray-100 text-gray-400"
              : "bg-navy-700/10 text-navy-700"
          }`}
        >
          <FolderOpen className="h-8 w-8" />
        </div>

        {!isEmpty && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700/10">
            <FileText className="h-4 w-4 text-navy-700" />
          </div>
        )}
      </div>

      {/* Year label */}
      <h3 className="text-lg font-bold text-navy-700 group-hover:text-navy-800 transition-colors">
        Tax Year {year}
      </h3>

      {/* File count */}
      <div className="mt-2 flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            isEmpty ? "text-muted-foreground" : "text-navy-700"
          }`}
        >
          {fileCount === 0
            ? "No documents yet"
            : `${fileCount} ${fileCount === 1 ? "document" : "documents"}`}
        </span>
        {!isEmpty && (
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
        )}
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Updated {formatDate(lastUpdated)}</span>
        </div>
      )}

      {/* Hover arrow */}
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-navy-700 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
        <span>View documents</span>
        <span>→</span>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-navy-700 to-gold-500 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
}

export function YearFolderCardSkeleton() {
  return (
    <div className="year-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-14 w-14 rounded-2xl skeleton" />
      </div>
      <div className="h-5 w-28 rounded skeleton" />
      <div className="mt-2 h-4 w-20 rounded skeleton" />
      <div className="mt-2 h-3.5 w-32 rounded skeleton" />
    </div>
  );
}
