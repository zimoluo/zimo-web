import { rejectLegacyParams, requireEntryParams } from "@/src/server/http/params";
import { CACHE_WEEKS } from "@/src/server/http/context";
import { handler, json, notFound } from "@/src/server/http/problem";
import { findEntry } from "@/src/server/entries/load";
type Params = { params: Promise<{ section: string; slug: string }> };
export const GET = handler<Params>(async (request, { params }) => {
  rejectLegacyParams(new URL(request.url));
  const { section, slug } = requireEntryParams(await params);
  const entry = await findEntry(section, slug);
  if (entry === null) throw notFound("No such entry.");
  return json(entry, { headers: { "cache-control": CACHE_WEEKS } });
});
