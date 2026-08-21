import { requireSection } from "@/src/server/http/params";
import { rejectLegacyParams } from "@/src/server/http/params";
import { parseListQuery, paginate, project } from "@/src/server/http/query";
import { CACHE_HOURS, requestContext } from "@/src/server/http/context";
import { handler, json } from "@/src/server/http/problem";
import { readSummaries } from "@/src/server/entries/read";
import { isAdmin } from "@/src/server/session/authorize";

type Params = { params: Promise<{ section: string }> };

export const GET = handler<Params>(async (request, { params }) => {
  const url = new URL(request.url);
  rejectLegacyParams(url);

  const section = requireSection((await params).section);
  const query = parseListQuery(url);
  const { store, viewer } = await requestContext();

  const summaries = await readSummaries(store, section, {
    includeUnlisted: isAdmin(viewer),
  });

  const page = paginate(summaries, query.limit, query.cursor);

  return json(
    {
      items: page.items.map((summary) => project(summary, query.fields)),
      ...(page.nextCursor === undefined ? {} : { nextCursor: page.nextCursor }),
    },
    { headers: { "cache-control": CACHE_HOURS } },
  );
});
