import { CACHE_PRIVATE } from "@/src/server/http/context";
import { handler, json, noContent } from "@/src/server/http/problem";
import { currentUser, currentViewer, rotateIfStale } from "@/src/server/session/current";

export const GET = handler(async () => {
  const viewer = await currentViewer();
  if (viewer === null) return noContent({ "cache-control": CACHE_PRIVATE });

  await rotateIfStale();
  const user = await currentUser();

  return json(
    {
      sub: viewer.sub,
      state: viewer.state,
      name: user?.name ?? null,
      profilePic: user?.profilePic ?? null,
    },
    { headers: { "cache-control": CACHE_PRIVATE } },
  );
});
