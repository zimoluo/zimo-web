import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { baseUrl } from "../../lib/site";
import { objects, storageCacheKey } from "../storage/object";
import { entriesTag, readSummaries } from "../entries/read";
import { buildFeed } from "./rss";

export const loadBlogFeed = cache(async (): Promise<string> =>
  unstable_cache(async () => buildFeed(await readSummaries(objects(), "blog"), {
    baseUrl,
    builtAt: new Date(),
  }), ["blog-rss", storageCacheKey()], { revalidate: 3600, tags: [entriesTag("blog")] })());
