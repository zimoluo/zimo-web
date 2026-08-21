export const ALLOWED_ORIGINS: readonly string[] = ["https://tree.zimoluo.me"];

export type CorsHeaders = Readonly<Record<string, string>>;

export function corsFor(origin: string | null): CorsHeaders {
  if (origin === null || !ALLOWED_ORIGINS.includes(origin)) {
    return { Vary: "Origin" };
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export const corsForRequest = (request: Request): CorsHeaders =>
  corsFor(request.headers.get("origin"));

export const preflight = (request: Request): Response =>
  new Response(null, { status: 204, headers: corsForRequest(request) });

export const isAllowedOrigin = (origin: string | null): boolean =>
  origin !== null && ALLOWED_ORIGINS.includes(origin);
