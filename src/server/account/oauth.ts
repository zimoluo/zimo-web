import "server-only";
import { OAuth2Client } from "google-auth-library";
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";
import { z } from "zod";
import { AppError } from "../../lib/errors";
import type { AccountPayloadData } from "../../features/account/model/types";

const appleKeys = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));
const required = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value.length === 0) throw new AppError("internal", "OAuth is not configured");
  return value;
};

export async function exchangeOAuth(provider: "google" | "apple", code: string, name?: string): Promise<AccountPayloadData> {
  try {
    if (provider === "google") {
      const clientId = required("NEXT_PUBLIC_ZIMO_WEB_GOOGLE_CLIENT_ID");
      const client = new OAuth2Client(clientId, required("ZIMO_WEB_GOOGLE_CLIENT_SECRET"), "postmessage");
      const { tokens } = await client.getToken(code);
      if (tokens.id_token === undefined || tokens.id_token === null) throw new Error("Missing identity token");
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
      const payload = ticket.getPayload();
      if (payload === undefined) throw new Error("Missing identity");
      return { sub: payload.sub, name: payload.name ?? "Anonymous", profilePic: payload.picture ?? null };
    }
    const clientId = required("NEXT_PUBLIC_ZIMO_WEB_APPLE_SIGN_IN_CLIENT_ID");
    const key = await importPKCS8(required("ZIMO_WEB_APPLE_SECRET_KEY"), "ES256");
    const secret = await new SignJWT({}).setProtectedHeader({ alg: "ES256", kid: required("ZIMO_WEB_APPLE_KEY_ID") })
      .setIssuer(required("ZIMO_WEB_APPLE_TEAM_ID")).setSubject(clientId).setAudience("https://appleid.apple.com")
      .setIssuedAt().setExpirationTime("5m").sign(key);
    const response = await fetch("https://appleid.apple.com/auth/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: clientId, client_secret: secret, redirect_uri: "https://www.zimoluo.me" }), cache: "no-store" });
    if (!response.ok) throw new Error("Token exchange failed");
    const token = z.object({ id_token: z.string() }).parse(await response.json());
    const { payload } = await jwtVerify(token.id_token, appleKeys, { issuer: "https://appleid.apple.com", audience: clientId, algorithms: ["RS256"] });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) throw new Error("Missing subject");
    return { sub: `apple_${payload.sub}`, name: name?.trim() || "Apple User", profilePic: null };
  } catch (cause) {
    if (cause instanceof AppError) throw cause;
    throw new AppError("unauthenticated", "Sign-in could not be verified. Try again.", undefined, { cause });
  }
}
