import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { verifyToken } from "../lib/jwt";
import {
  createCase,
  getCasesByUsername,
  getAllCases,
  getCaseById,
  updateCase,
  deleteCaseById,
  createNotification,
  type CaseStatus,
  type PaymentStatus,
} from "../lib/dynamodb";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
} from "../lib/response";

const SERVICE_TYPE_LABELS: Record<string, string> = {
  "personal-tax": "Personal Tax Return",
  "corporate-tax": "Corporate Tax Return",
  "corporate-registration": "Corporate Registration",
  "hst-gst": "HST/GST Filing",
  "bookkeeping": "Bookkeeping",
  "self-employed": "Self-Employed Tax",
  "payroll": "Payroll Services",
  "other": "Other",
};

function getAuth(event: APIGatewayProxyEventV2) {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return verifyToken(auth.slice(7));
  } catch {
    return null;
  }
}

function getCaseIdFromPath(path: string): string | null {
  // /api/cases/{caseId} or /api/cases/{caseId}/request-documents
  const parts = path.split("/");
  // ["", "api", "cases", "{caseId}", ...]
  return parts[3] || null;
}

// GET /api/cases
// Admin: all cases (optionally ?username=)
// Client: their own cases only
export async function handleListCases(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth) return unauthorized();

  try {
    if (auth.role === "admin") {
      const filterUsername = event.queryStringParameters?.username;
      const cases = filterUsername
        ? await getCasesByUsername(filterUsername)
        : await getAllCases();
      return ok({ cases });
    } else {
      const cases = await getCasesByUsername(auth.username);
      return ok({ cases });
    }
  } catch (err) {
    console.error("handleListCases error:", err);
    return serverError();
  }
}

// POST /api/cases — admin only
export async function handleCreateCase(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth || auth.role !== "admin") return unauthorized("Admin access required");

  try {
    const body = JSON.parse(event.body || "{}");
    const { username, serviceType, year, status, paymentStatus, adminNotes } = body;

    if (!username || !serviceType || !year) {
      return badRequest("username, serviceType and year are required");
    }

    const newCase = await createCase({
      username,
      serviceType,
      year,
      status: (status as CaseStatus) ?? "not_started",
      paymentStatus: (paymentStatus as PaymentStatus) ?? "pending",
      adminNotes: adminNotes ?? "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return created({ case: newCase });
  } catch (err) {
    console.error("handleCreateCase error:", err);
    return serverError();
  }
}

// PUT /api/cases/{caseId} — admin only
export async function handleUpdateCase(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth || auth.role !== "admin") return unauthorized("Admin access required");

  const caseId = getCaseIdFromPath(event.requestContext.http.path);
  if (!caseId) return badRequest("caseId is required");

  try {
    const existing = await getCaseById(caseId);
    if (!existing) return badRequest("Case not found");

    const body = JSON.parse(event.body || "{}");
    const updated = await updateCase(caseId, {
      status: body.status,
      paymentStatus: body.paymentStatus,
      adminNotes: body.adminNotes,
    });

    // Notify client on status change
    if (body.status && body.status !== existing.status) {
      const statusLabels: Record<string, string> = {
        not_started: "Not Started",
        in_progress: "In Progress",
        needs_documents: "Needs Documents",
        done: "Done",
      };
      const serviceLabel = SERVICE_TYPE_LABELS[existing.serviceType] ?? existing.serviceType;
      await createNotification({
        recipientUsername: existing.username,
        type: "status_update",
        message: `Your ${serviceLabel} (${existing.year}) has been updated to: ${statusLabels[body.status] ?? body.status}.`,
        read: false,
        caseId,
        createdAt: new Date().toISOString(),
      });
    }

    // Notify client on payment status change
    if (body.paymentStatus && body.paymentStatus !== existing.paymentStatus) {
      const payLabels: Record<string, string> = {
        pending: "Pending",
        paid: "Paid",
        overdue: "Overdue",
      };
      const serviceLabel = SERVICE_TYPE_LABELS[existing.serviceType] ?? existing.serviceType;
      await createNotification({
        recipientUsername: existing.username,
        type: "payment_update",
        message: `Payment status for your ${serviceLabel} (${existing.year}) is now: ${payLabels[body.paymentStatus] ?? body.paymentStatus}.`,
        read: false,
        caseId,
        createdAt: new Date().toISOString(),
      });
    }

    return ok({ case: updated });
  } catch (err) {
    console.error("handleUpdateCase error:", err);
    return serverError();
  }
}

// DELETE /api/cases/{caseId} — admin only
export async function handleDeleteCase(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth || auth.role !== "admin") return unauthorized("Admin access required");

  const caseId = getCaseIdFromPath(event.requestContext.http.path);
  if (!caseId) return badRequest("caseId is required");

  try {
    await deleteCaseById(caseId);
    return ok({ ok: true });
  } catch (err) {
    console.error("handleDeleteCase error:", err);
    return serverError();
  }
}

// POST /api/cases/{caseId}/request-documents — admin only
export async function handleRequestDocuments(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth || auth.role !== "admin") return unauthorized("Admin access required");

  const caseId = getCaseIdFromPath(event.requestContext.http.path);
  if (!caseId) return badRequest("caseId is required");

  try {
    const theCase = await getCaseById(caseId);
    if (!theCase) return badRequest("Case not found");

    const body = JSON.parse(event.body || "{}");
    const serviceLabel = SERVICE_TYPE_LABELS[theCase.serviceType] ?? theCase.serviceType;
    const message =
      body.message ||
      `Additional documents are required for your ${serviceLabel} (${theCase.year}). Please upload them at your earliest convenience.`;

    const notification = await createNotification({
      recipientUsername: theCase.username,
      type: "document_request",
      message,
      read: false,
      caseId,
      createdAt: new Date().toISOString(),
    });

    return ok({ ok: true, notification });
  } catch (err) {
    console.error("handleRequestDocuments error:", err);
    return serverError();
  }
}
