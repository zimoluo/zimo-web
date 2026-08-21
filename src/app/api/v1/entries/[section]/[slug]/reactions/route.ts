import { rejectLegacyParams, requireEntryParams } from "@/src/server/http/params";
import { CACHE_NONE, requestContext } from "@/src/server/http/context";
import { handler, json } from "@/src/server/http/problem";
import { readReactions } from "@/src/server/comments/mutations";
import { likedBy, likeCount } from "@/src/features/entries/model/comment";

type Params = { params: Promise<{ section: string; slug: string }> };

export const GET = handler<Params>(async (request, { params }) => {
  rejectLegacyParams(new URL(request.url));

  const { section, slug } = requireEntryParams(await params);
  const { store, viewer } = await requestContext();

  const reactions = await readReactions(store.asJsonStore(), section, slug);

  return json(
    {
      count: likeCount(reactions),
      likedByMe: likedBy(reactions, viewer?.sub ?? null),
    },
    { headers: { "cache-control": CACHE_NONE } },
  );
});
