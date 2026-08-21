import { buildFeed } from "@/src/server/feed/rss";
import { readSummaries } from "@/src/server/entries/read";
import { requestContext } from "@/src/server/http/context";
import { handler } from "@/src/server/http/problem";
import { baseUrl } from "@/lib/constants/navigationFinder";

export const GET = handler(async () => {
  const { store } = await requestContext();
  const summaries = await readSummaries(store, "blog");

  return new Response(
    buildFeed(summaries, { baseUrl, builtAt: new Date() }),
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600",
      },
    },
  );
});
