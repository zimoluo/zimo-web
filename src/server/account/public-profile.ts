import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { objects, storageCacheKey } from "../storage/object";
import { keys } from "../storage/keys";
import { authorTag } from "../entries/read";
import { parseStoredUser } from "./user";
import type { UserState } from "../../features/account/model/types";

export type PublicProfile = Readonly<{
  sub: string;
  name: string;
  profilePic: string | null;
  state: UserState;
}>;

export const loadPublicProfile = cache(async (sub: string): Promise<PublicProfile> =>
  unstable_cache(async () => {
    const record = await objects().readJson(keys.user(sub), parseStoredUser);
    return {
      sub,
      name: record?.value.name ?? "Deleted account",
      profilePic: record?.value.profilePic ?? null,
      state: record?.value.state ?? "normal",
    };
  }, ["public-author", storageCacheKey(), sub], { revalidate: 86400, tags: [authorTag(sub)] })());
