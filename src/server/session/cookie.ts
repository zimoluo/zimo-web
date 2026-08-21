export const SESSION_COOKIE = "session";
export const LEGACY_SESSION_COOKIE = "session_token";

export const SESSION_MAX_AGE_SECONDS = 15_552_000;

export const ROTATE_AFTER_SECONDS = 30 * 24 * 60 * 60;

export type CookieOptions = {
  readonly httpOnly: boolean;
  readonly secure: boolean;
  readonly sameSite: "lax" | "strict" | "none";
  readonly path: string;
  readonly maxAge: number;
};

export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};

export const CLEARED_COOKIE_OPTIONS: CookieOptions = {
  ...SESSION_COOKIE_OPTIONS,
  maxAge: 0,
};

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions,
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path}`];

  parts.push(`Max-Age=${options.maxAge}`);
  parts.push(
    `SameSite=${options.sameSite.charAt(0).toUpperCase()}${options.sameSite.slice(1)}`,
  );
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");

  return parts.join("; ");
}

export function readCookie(header: string | null, name: string): string | null {
  if (header === null) return null;

  for (const pair of header.split(";")) {
    const separator = pair.indexOf("=");
    if (separator === -1) continue;
    if (pair.slice(0, separator).trim() !== name) continue;
    return decodeURIComponent(pair.slice(separator + 1).trim());
  }

  return null;
}

export const readSessionCookie = (header: string | null): string | null =>
  readCookie(header, SESSION_COOKIE) ?? readCookie(header, LEGACY_SESSION_COOKIE);

export const RENDER_COOKIE = "zw.render";

export const RENDER_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: false,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
