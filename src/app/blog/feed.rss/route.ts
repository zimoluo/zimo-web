import { loadBlogFeed } from "@/src/server/feed/load";
import { handler } from "@/src/server/http/problem";

export const GET = handler(async () => {
  return new Response(
    await loadBlogFeed(),
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600",
      },
    },
  );
});
