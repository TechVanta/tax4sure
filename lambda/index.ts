import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { handleLogin, handleRegister } from "./handlers/auth";
import {
  handleListFiles,
  handleStats,
  handleDeleteFile,
  handlePresignUpload,
} from "./handlers/documents";
import { preflight } from "./lib/response";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method.toUpperCase();
  const path = event.requestContext.http.path;

  // Handle CORS preflight
  if (method === "OPTIONS") return preflight();

  // Route table
  if (method === "POST" && path === "/api/auth/login") return handleLogin(event);
  if (method === "POST" && path === "/api/auth/register") return handleRegister(event);
  if (method === "GET" && path === "/api/documents/list") return handleListFiles(event);
  if (method === "GET" && path === "/api/documents/stats") return handleStats(event);
  if (method === "DELETE" && path === "/api/documents/delete") return handleDeleteFile(event);
  if (method === "POST" && path === "/api/documents/presign-upload") return handlePresignUpload(event);

  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Not found" }),
  };
};

