import { rejectLegacyParams, requireEntryParams } from "@/src/server/http/params";
import { CACHE_NONE, requestContext } from "@/src/server/http/context";
import { handler, json } from "@/src/server/http/problem";
import { readThread } from "@/src/server/comments/mutations";

type Params = { params: Promise<{ section: string; slug: string }> };

export const GET = handler<Params>(async (request, { params }) => {
  rejectLegacyParams(new URL(request.url));

  const { section, slug } = requireEntryParams(await params);
  const { store } = await requestContext();

  const thread = await readThread(store.asJsonStore(), section, slug);

  return json(thread, { headers: { "cache-control": CACHE_NONE } });
});
