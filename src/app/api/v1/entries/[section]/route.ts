import { requireSection } from "@/src/server/http/params";
import { rejectLegacyParams } from "@/src/server/http/params";
import { parseListQuery, paginate, project } from "@/src/server/http/query";
import { CACHE_HOURS, CACHE_PRIVATE, requestContext } from "@/src/server/http/context";
import { handler, json } from "@/src/server/http/problem";
import { enrichSummaries } from "@/src/server/entries/load";
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
  const displayed = await enrichSummaries(section, page.items);

  return json(
    {
      items: displayed.map((summary) => project(summary, query.fields)),
      ...(page.nextCursor === undefined ? {} : { nextCursor: page.nextCursor }),
    },
    { headers: { "cache-control": isAdmin(viewer) ? CACHE_PRIVATE : CACHE_HOURS, vary: "Cookie" } },
  );
});
