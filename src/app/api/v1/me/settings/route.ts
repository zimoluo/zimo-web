import { CACHE_PRIVATE } from "@/src/server/http/context";
import { handler, json, noContent } from "@/src/server/http/problem";
import { currentUser, requireCurrentViewer } from "@/src/server/session/current";

export const GET = handler(async () => {
  await requireCurrentViewer();
  const user = await currentUser();
  const settings = user?.websiteSettings ?? null;

  if (settings === null) return noContent({ "cache-control": CACHE_PRIVATE });

  return json(settings, {
    headers: {
      "cache-control": CACHE_PRIVATE,
      "content-disposition": 'attachment; filename="zimo-web-settings.json"',
    },
  });
});
