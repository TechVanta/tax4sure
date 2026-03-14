// Tax4Sure API — route handler
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleResetPassword,
} from "./handlers/auth";
import {
  handleListFiles,
  handleStats,
  handleDeleteFile,
  handlePresignUpload,
} from "./handlers/documents";
import {
  handleAdminLogin,
  handleAdminForgotPassword,
  handleAdminListClients,
  handleAdminListFiles,
} from "./handlers/admin";
import { handleContactForm } from "./handlers/contact";
import { preflight } from "./lib/response";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method.toUpperCase();
  const path = event.requestContext.http.path;

  // Handle CORS preflight
  if (method === "OPTIONS") return preflight();

  // Auth routes
  if (method === "POST" && path === "/api/auth/login") return handleLogin(event);
  if (method === "POST" && path === "/api/auth/register") return handleRegister(event);
  if (method === "POST" && path === "/api/auth/forgot-password") return handleForgotPassword(event);
  if (method === "POST" && path === "/api/auth/reset-password") return handleResetPassword(event);

  // Document routes (authenticated)
  if (method === "GET" && path === "/api/documents/list") return handleListFiles(event);
  if (method === "GET" && path === "/api/documents/stats") return handleStats(event);
  if (method === "DELETE" && path === "/api/documents/delete") return handleDeleteFile(event);
  if (method === "POST" && path === "/api/documents/presign-upload") return handlePresignUpload(event);

  // Contact route (public)
  if (method === "POST" && path === "/api/contact") return handleContactForm(event);

  // Admin routes
  if (method === "POST" && path === "/api/admin/login") return handleAdminLogin(event);
  if (method === "POST" && path === "/api/admin/forgot-password") return handleAdminForgotPassword(event);
  if (method === "GET" && path === "/api/admin/clients") return handleAdminListClients(event);
  if (method === "GET" && path === "/api/admin/files") return handleAdminListFiles(event);

  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not found" }),
  };
};
