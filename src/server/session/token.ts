import { SignJWT, jwtVerify } from "jose";
import { AppError } from "../../lib/errors";
import { ROTATE_AFTER_SECONDS, SESSION_MAX_AGE_SECONDS } from "./cookie";

export type SessionClaims = {
  readonly sub: string;
  readonly iat: number;
  readonly exp: number;
};

export const ALGORITHM = "HS256";

const encoder = new TextEncoder();

export type Secret = Uint8Array;

export function secretFrom(value: string | undefined): Secret {
  if (value === undefined || value.length === 0) {
    throw new AppError("internal", "Session secret is not configured");
  }
  return encoder.encode(value);
}

export const nowSeconds = (at: Date = new Date()): number =>
  Math.floor(at.getTime() / 1000);

export async function signSession(
  sub: string,
  secret: Secret,
  issuedAt: number = nowSeconds(),
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(sub)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_MAX_AGE_SECONDS)
    .sign(secret);
}

export async function verifySession(
  token: string,
  secret: Secret,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALGORITHM],
    });

    const { sub, iat, exp } = payload;

    if (
      typeof sub !== "string" ||
      sub.length === 0 ||
      typeof iat !== "number" ||
      typeof exp !== "number"
    ) {
      return null;
    }

    return { sub, iat, exp };
  } catch {
    return null;
  }
}

export const shouldRotate = (
  claims: SessionClaims,
  at: number = nowSeconds(),
): boolean => at - claims.iat >= ROTATE_AFTER_SECONDS;
