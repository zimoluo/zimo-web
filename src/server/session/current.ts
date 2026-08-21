import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { AppError } from "../../lib/errors";
import { keys } from "../storage/keys";
import { objects } from "../storage/object";
import { parseStoredUser } from "../account/user";
import type { StoredUser } from "../account/user";
import {
  CLEARED_COOKIE_OPTIONS,
  LEGACY_SESSION_COOKIE,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "./cookie";
import { secretFrom, shouldRotate, signSession, verifySession } from "./token";
import type { SessionClaims } from "./token";
import type { MaybeViewer, Viewer } from "./authorize";

const secret = (): Uint8Array => secretFrom(process.env.ZIMO_WEB_JWT_KEY);

export const currentClaims = cache(async (): Promise<SessionClaims | null> => {
  const jar = await cookies();
  const token =
    jar.get(SESSION_COOKIE)?.value ?? jar.get(LEGACY_SESSION_COOKIE)?.value;
  if (token === undefined) return null;
  return verifySession(token, secret());
});

export const currentUser = cache(async (): Promise<StoredUser | null> => {
  const claims = await currentClaims();
  if (claims === null) return null;

  const record = await objects().readJson(
    keys.user(claims.sub),
    parseStoredUser,
  );

  return record?.value ?? null;
});

export const currentViewer = cache(async (): Promise<MaybeViewer> => {
  const claims = await currentClaims();
  if (claims === null) return null;

  const user = await currentUser();
  return { sub: claims.sub, state: user?.state ?? "normal" };
});

export async function issueSession(sub: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(sub, secret()), SESSION_COOKIE_OPTIONS);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", CLEARED_COOKIE_OPTIONS);
  jar.set(LEGACY_SESSION_COOKIE, "", CLEARED_COOKIE_OPTIONS);
}

export async function rotateIfStale(): Promise<void> {
  const claims = await currentClaims();
  if (claims === null || !shouldRotate(claims)) return;
  await issueSession(claims.sub);
}

export async function requireCurrentViewer(): Promise<Viewer> {
  const viewer = await currentViewer();
  if (viewer === null) {
    throw new AppError("unauthenticated", "Sign in to do that.");
  }
  return viewer;
}
