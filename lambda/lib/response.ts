import type { APIGatewayProxyResultV2 } from "aws-lambda";

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

export function ok(body: object): APIGatewayProxyResultV2 {
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function created(body: object): APIGatewayProxyResultV2 {
  return { statusCode: 201, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

export function badRequest(message: string): APIGatewayProxyResultV2 {
  return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function unauthorized(message = "Unauthorized"): APIGatewayProxyResultV2 {
  return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function serverError(message = "Internal server error"): APIGatewayProxyResultV2 {
  return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) };
}

export function preflight(): APIGatewayProxyResultV2 {
  return { statusCode: 204, headers: CORS_HEADERS, body: "" };
}
