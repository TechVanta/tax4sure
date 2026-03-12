// Centralised API client — routes all calls through the Lambda Function URL

import { getStoredToken } from "./auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface CallOptions extends Omit<RequestInit, "headers"> {
  auth?: boolean;
  headers?: Record<string, string>;
}

export async function apiCall(
  path: string,
  { auth = true, headers = {}, ...rest }: CallOptions = {}
): Promise<Response> {
  const merged: Record<string, string> = { ...headers };

  if (rest.body && typeof rest.body === "string") {
    merged["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (token) merged["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, { ...rest, headers: merged });
}
