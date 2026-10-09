"use server";

import { themePreferencesSchema } from "../theme/model/preferences";
import { workspaceSchema } from "../workspace/model";
import { z } from "zod";
import { loadPublicProfile } from "../../server/account/public-profile";
import { exchangeOAuth } from "../../server/account/oauth";
import { issueSession, currentViewer, rotateIfStale } from "../../server/session/current";
import { reconcileOnSignIn, withProfile } from "../../server/account/user";
import { writeLimiter } from "../../server/http/rate-limit";
import type { AccountUser } from "./model/types";
import { updateTag } from "next/cache";
import { AppError } from "../../lib/errors";
import { authorTag } from "../../server/entries/read";
import { requestContext } from "../../server/http/context";
import { keys } from "../../server/storage/keys";
import { mutateJson } from "../../server/storage/mutate";
import {
  applySettingsSync,
  applyAccountSync,
  newUser,
  parseStoredUser,
  withState,
} from "../../server/account/user";
import type { StoredUser } from "../../server/account/user";
import {
  clearSession,
  currentUser,
  requireCurrentViewer,
} from "../../server/session/current";
import { requireAdmin } from "../../server/session/authorize";
import { safeParseSettings } from "../settings/model/schema";
import type { Settings } from "../settings/model/settings";
import type { UserState } from "./model/types";

export async function syncSettings(payload: unknown, domains?: unknown): Promise<number> {
  const parsedDomains = domains === undefined ? null : z.object({theme:themePreferencesSchema,workspace:workspaceSchema}).safeParse(domains);
  if (parsedDomains !== null && !parsedDomains.success) throw new AppError("invalid-request", "Synced data is invalid.");
  const viewer = await requireCurrentViewer();
  const settings = safeParseSettings(payload);

  if (settings === null) {
    throw new AppError("invalid-request", "Those settings are not valid.");
  }

  if (!settings.sync.enabled) {
    throw new AppError("forbidden", "Settings sync is off for this account.");
  }

  const { store, now } = await requestContext();
  const at = now();

  const user = await mutateJson(
    store.asJsonStore(),
    keys.user(viewer.sub),
    parseStoredUser,
    () => newUser("", null, settings, at),
    (current) => {
      if(parsedDomains?.success === true) return applyAccountSync(current,settings,parsedDomains.data,at);
      const result = applySettingsSync(current, settings, at);
      if (result.kind === "stale") {
        throw new AppError(
          "conflict",
          "A newer version of your settings is already saved.",
          { storedRevision: result.storedRevision, settings: current.websiteSettings },
        );
      }
      return result.user;
    },
  );

  return user.websiteSettings?.revision ?? 0;
}

export async function downloadSettings(): Promise<Settings | null> {
  await requireCurrentViewer();
  const user = await currentUser();
  return user?.websiteSettings ?? null;
}

export async function setUserState(
  sub: string,
  state: UserState,
): Promise<void> {
  const viewer = await requireCurrentViewer();
  requireAdmin(viewer);
  if (!z.string().min(1).max(300).safeParse(sub).success || !z.enum(["normal", "admin", "banned"]).safeParse(state).success) throw new AppError("invalid-request", "The account state is invalid.");

  if (sub === viewer.sub) {
    throw new AppError("forbidden", "You cannot change your own state.");
  }

  const { store, now } = await requestContext();
  const at = now();

  await mutateJson(
    store.asJsonStore(),
    keys.user(sub),
    parseStoredUser,
    () => {
      throw new AppError("not-found", "No such account.");
    },
    (current: StoredUser) => withState(current, state, at),
  );

  updateTag(authorTag(sub));
}

export async function deleteAccount(): Promise<void> {
  const viewer = await requireCurrentViewer();
  const { store } = await requestContext();

  await store.remove(keys.user(viewer.sub));
  await clearSession();
  updateTag(authorTag(viewer.sub));
}

export async function signOut(): Promise<void> {
  await clearSession();
}

export async function signIn(payload: unknown): Promise<AccountUser> {
  const parsed = z.object({ provider: z.enum(["google", "apple"]), code: z.string().min(1).max(4096), name: z.string().max(200).optional(), settings: z.unknown().optional() }).safeParse(payload);
  if (!parsed.success) throw new AppError("invalid-request", "The sign-in request is invalid.");
  const settings = parsed.data.settings === undefined ? null : safeParseSettings(parsed.data.settings);
  if (parsed.data.settings !== undefined && settings === null) throw new AppError("invalid-request", "The settings are invalid.");
  const profile = await exchangeOAuth(parsed.data.provider, parsed.data.code, parsed.data.name);
  writeLimiter.require(`signin:${profile.sub}`);
  const { store, now } = await requestContext();
  const at = now();
  const user = await mutateJson(store.asJsonStore(), keys.user(profile.sub), parseStoredUser,
    () => newUser(profile.name, profile.profilePic, settings?.sync.enabled === true ? settings : null, at),
    (current) => {
      const next = withProfile(current, profile.name === "Apple User" ? current.name : profile.name, profile.profilePic, at);
      return settings?.sync.enabled === true ? { ...next, websiteSettings: reconcileOnSignIn(settings, current.websiteSettings) } : next;
    });
  updateTag(authorTag(profile.sub));
  await issueSession(profile.sub);
  return { sub: profile.sub, ...user };
}

export async function restoreAccount(): Promise<AccountUser | null> {
  const viewer = await currentViewer();
  if (viewer === null) return null;
  const user = await currentUser();
  if (user === null) { await clearSession(); return null; }
  await rotateIfStale();
  return { sub: viewer.sub, ...user };
}

export async function fetchPublicUser(rawSub: string): Promise<Readonly<{ sub: string; name: string; profilePic: string | null; state: UserState }>> {
  const result = z.string().min(1).max(300).safeParse(rawSub);
  if (!result.success) throw new AppError("invalid-request", "The account is invalid.");
  return loadPublicProfile(result.data);
}

export async function downloadAccountData(): Promise<AccountUser | null> { return restoreAccount(); }
