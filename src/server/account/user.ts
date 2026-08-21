import { z } from "zod";
import { settingsSchema } from "../../features/settings/model/schema";
import type { Settings } from "../../features/settings/model/settings";
import type { UserState } from "../../features/account/model/types";

export const USER_STATES = ["normal", "admin", "banned"] as const;

export type StoredUser = {
  readonly name: string;
  readonly profilePic: string | null;
  readonly state: UserState;
  readonly websiteSettings: Settings | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export const storedUserSchema = z.object({
  name: z.string(),
  profilePic: z.string().nullable(),
  state: z.enum(USER_STATES),
  websiteSettings: settingsSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const parseStoredUser = (input: unknown): StoredUser =>
  storedUserSchema.parse(input) as StoredUser;

export type SyncOutcome =
  | { readonly kind: "applied"; readonly user: StoredUser }
  | { readonly kind: "stale"; readonly storedRevision: number };

export function applySettingsSync(
  user: StoredUser,
  incoming: Settings,
  at: string,
): SyncOutcome {
  const stored = user.websiteSettings;

  if (stored !== null && incoming.revision < stored.revision) {
    return { kind: "stale", storedRevision: stored.revision };
  }

  return {
    kind: "applied",
    user: { ...user, websiteSettings: incoming, updatedAt: at },
  };
}

export function reconcileOnSignIn(
  local: Settings,
  remote: Settings | null,
): Settings {
  if (remote === null) return local;
  return remote.revision > local.revision ? remote : local;
}

export const withState = (
  user: StoredUser,
  state: UserState,
  at: string,
): StoredUser => ({ ...user, state, updatedAt: at });

export const withProfile = (
  user: StoredUser,
  name: string,
  profilePic: string | null,
  at: string,
): StoredUser => ({ ...user, name, profilePic, updatedAt: at });

export const newUser = (
  name: string,
  profilePic: string | null,
  settings: Settings | null,
  at: string,
): StoredUser => ({
  name,
  profilePic,
  state: "normal",
  websiteSettings: settings,
  createdAt: at,
  updatedAt: at,
});
