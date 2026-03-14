const ADMIN_TOKEN_KEY = "t4s_admin_token";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function storeAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

// Authenticated fetch helper for admin — routes through the Lambda base URL
export async function adminApiCall(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: token ? `Bearer ${token}` : "",
  };
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
