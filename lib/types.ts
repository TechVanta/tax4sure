export interface DriveFile {
  id: string;         // S3 object key
  name: string;       // original filename
  mimeType: string;
  size: string;
  createdTime: string;
  webViewLink: string;
  webContentLink: string;
}

export type CaseStatus = "not_started" | "in_progress" | "done" | "needs_documents";
export type PaymentStatus = "pending" | "paid" | "overdue";

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  "personal-tax": "Personal Tax Return",
  "corporate-tax": "Corporate Tax Return",
  "corporate-registration": "Corporate Registration",
  "hst-gst": "HST/GST Filing",
  "bookkeeping": "Bookkeeping",
  "self-employed": "Self-Employed Tax",
  "payroll": "Payroll Services",
  "other": "Other",
};

export const SERVICE_TYPES = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

export interface Case {
  caseId: string;
  username: string;
  serviceType: string;
  year: string;
  status: CaseStatus;
  paymentStatus: PaymentStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  notificationId: string;
  recipientUsername: string; // "admin" or client username
  type: "document_request" | "status_update" | "payment_update" | "new_upload";
  message: string;
  read: boolean;
  caseId?: string;
  createdAt: string;
}
