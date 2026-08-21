"use server";

import { updateTag } from "next/cache";
import { AppError } from "../../lib/errors";
import { authorTag } from "../../server/entries/read";
import { requestContext } from "../../server/http/context";
import { keys } from "../../server/storage/keys";
import { mutateJson } from "../../server/storage/mutate";
import {
  applySettingsSync,
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

export async function syncSettings(payload: unknown): Promise<number> {
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
