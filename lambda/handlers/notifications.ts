import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { verifyToken } from "../lib/jwt";
import {
  createNotification,
  getNotificationsByRecipient,
  markNotificationsRead,
  type NotificationType,
} from "../lib/dynamodb";
import { ok, created, badRequest, unauthorized, serverError } from "../lib/response";

function getAuth(event: APIGatewayProxyEventV2) {
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  try {
    return verifyToken(auth.slice(7));
  } catch {
    return null;
  }
}

// GET /api/notifications
// Client: their own notifications
// Admin: notifications addressed to "admin"
export async function handleListNotifications(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth) return unauthorized();

  const recipient = auth.role === "admin" ? "admin" : auth.username;

  try {
    const notifications = await getNotificationsByRecipient(recipient);
    return ok({ notifications });
  } catch (err) {
    console.error("handleListNotifications error:", err);
    return serverError();
  }
}

// POST /api/notifications — create a notification (used for new-upload alerts)
export async function handleCreateNotification(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth) return unauthorized();

  try {
    const body = JSON.parse(event.body || "{}");
    const { recipientUsername, type, message, caseId } = body;

    if (!recipientUsername || !type || !message) {
      return badRequest("recipientUsername, type and message are required");
    }

    const notification = await createNotification({
      recipientUsername,
      type: type as NotificationType,
      message,
      read: false,
      caseId,
      createdAt: new Date().toISOString(),
    });

    return created({ ok: true, notification });
  } catch (err) {
    console.error("handleCreateNotification error:", err);
    return serverError();
  }
}

// PUT /api/notifications/read
// Body: { notificationIds?: string[] } — empty = mark ALL as read
export async function handleMarkNotificationsRead(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const auth = getAuth(event);
  if (!auth) return unauthorized();

  const recipient = auth.role === "admin" ? "admin" : auth.username;

  try {
    const body = JSON.parse(event.body || "{}");
    await markNotificationsRead(recipient, body.notificationIds);
    return ok({ ok: true });
  } catch (err) {
    console.error("handleMarkNotificationsRead error:", err);
    return serverError();
  }
}
