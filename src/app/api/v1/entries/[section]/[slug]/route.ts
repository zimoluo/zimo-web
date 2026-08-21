import { rejectLegacyParams, requireEntryParams } from "@/src/server/http/params";
import { CACHE_WEEKS, requestContext } from "@/src/server/http/context";
import { handler, json, notFound } from "@/src/server/http/problem";
import { readEntry } from "@/src/server/entries/read";
import { parseDocument } from "@/src/features/document/parse";

type Params = { params: Promise<{ section: string; slug: string }> };

export const GET = handler<Params>(async (request, { params }) => {
  rejectLegacyParams(new URL(request.url));

  const { section, slug } = requireEntryParams(await params);
  const { store } = await requestContext();

  const source = await readEntry(store, section, slug);
  if (source === null) throw notFound("No such entry.");

  const body =
    source.markdown === undefined
      ? { kind: "none" as const }
      : {
          kind: "document" as const,
          document: (await parseDocument(source.markdown, { idNamespace: slug }))
            .document,
        };

  return json(
    { ...source.entry, body },
    { headers: { "cache-control": CACHE_WEEKS } },
  );
});
