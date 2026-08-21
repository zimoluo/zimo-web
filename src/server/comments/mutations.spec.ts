import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/errors";
import { FakeJsonStore } from "../storage/fake-store";
import { keys } from "../storage/keys";
import type { Slug } from "../../features/entries/model/ids";
import type { CommentThread } from "../../features/entries/model/comment";
import { countReplies } from "../../features/entries/model/comment";
import { MAX_COMMENT_LENGTH } from "../session/authorize";
import type { Viewer } from "../session/authorize";
import {
  CAS_ATTEMPTS,
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  EMPTY_REACTIONS,
  EMPTY_THREAD,
  readReactions,
  readThread,
  setCommentLike,
  setEntryReaction,
  updateComment,
} from "./mutations";
import type { CommentContext } from "./mutations";

const SLUG = "on-gradients" as Slug;
const THREAD_KEY = keys.commentThread("blog", SLUG);
const REACTIONS_KEY = keys.reactions("blog", SLUG);

const viewer = (sub: string, state: Viewer["state"] = "normal"): Viewer => ({
  sub,
  state,
});

const idSequence = (): (() => string) => {
  let next = 0;
  return () => {
    next += 1;
    return `019218a0-7c3f-7000-8000-${String(next).padStart(12, "0")}`;
  };
};

const context = (
  store: FakeJsonStore,
  who: Viewer | null,
  overrides: Partial<CommentContext> = {},
): CommentContext => ({
  store,
  viewer: who,
  now: () => "2026-08-21T00:00:00Z",
  newId: idSequence(),
  sleep: async () => {},
  ...overrides,
});

const threadIn = (store: FakeJsonStore): CommentThread =>
  (store.peek(THREAD_KEY) as CommentThread | undefined) ?? EMPTY_THREAD;

describe("posting", () => {
  it("creates the thread object on the first comment, with IfNoneMatch", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "First",
    );

    expect(threadIn(store).comments).toHaveLength(1);
    expect(store.writes[0]?.condition).toEqual({ ifAbsent: true });
    expect(comment.authorSub).toBe("sub-a");
    expect(comment.replies).toEqual([]);
  });

  it("appends to an existing thread with a compare-and-swap", async () => {
    const store = new FakeJsonStore();
    await createComment(context(store, viewer("sub-a")), "blog", SLUG, "First");
    await createComment(context(store, viewer("sub-b")), "blog", SLUG, "Second");

    expect(threadIn(store).comments).toHaveLength(2);
    expect(store.writes[1]?.condition).toHaveProperty("ifMatch");
  });

  it("refuses an anonymous poster", async () => {
    const store = new FakeJsonStore();
    await expect(
      createComment(context(store, null), "blog", SLUG, "Hello"),
    ).rejects.toMatchObject({ code: "unauthenticated" });
    expect(store.writes).toHaveLength(0);
  });

  it("refuses a banned poster", async () => {
    const store = new FakeJsonStore();
    await expect(
      createComment(context(store, viewer("sub-a", "banned")), "blog", SLUG, "Hi"),
    ).rejects.toMatchObject({ code: "forbidden" });
  });

  it("refuses an empty or over-long body before touching storage", async () => {
    const store = new FakeJsonStore();
    await expect(
      createComment(context(store, viewer("sub-a")), "blog", SLUG, "   "),
    ).rejects.toMatchObject({ code: "unprocessable" });
    await expect(
      createComment(
        context(store, viewer("sub-a")),
        "blog",
        SLUG,
        "a".repeat(MAX_COMMENT_LENGTH + 1),
      ),
    ).rejects.toMatchObject({ code: "unprocessable" });
    expect(store.writes).toHaveLength(0);
  });

  it("reads an absent thread as empty rather than failing", async () => {
    const store = new FakeJsonStore();
    await expect(readThread(store, "blog", SLUG)).resolves.toEqual(EMPTY_THREAD);
    await expect(readReactions(store, "blog", SLUG)).resolves.toEqual(EMPTY_REACTIONS);
  });
});

describe("D4 C8: update functions are pure, so a retry cannot change the outcome", () => {
  it("generates the id and timestamp once, before the retry loop", async () => {
    const store = new FakeJsonStore({ failures: 3 });

    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Survives three conflicts",
    );

    expect(store.writes).toHaveLength(4);
    expect(threadIn(store).comments).toHaveLength(1);
    expect(threadIn(store).comments[0]?.id).toBe(comment.id);
    expect(threadIn(store).comments[0]?.createdAt).toBe(comment.createdAt);
  });

  it("does not produce a second comment when the first write is retried", async () => {
    const store = new FakeJsonStore({ failures: 2 });
    await createComment(context(store, viewer("sub-a")), "blog", SLUG, "Once");
    expect(threadIn(store).comments).toHaveLength(1);
  });

  it("re-applies against the winner's state after losing a race", async () => {
    const store = new FakeJsonStore();
    const ids = idSequence();
    const first = await createComment(
      context(store, viewer("sub-a"), { newId: ids }),
      "blog",
      SLUG,
      "First",
    );

    store.interleave(THREAD_KEY, {
      comments: [
        threadIn(store).comments[0],
        { ...first, id: ids(), body: "Interloper" },
      ],
    });

    await createComment(
      context(store, viewer("sub-b"), { newId: ids }),
      "blog",
      SLUG,
      "Third",
    );

    expect(threadIn(store).comments.map((comment) => comment.body)).toEqual([
      "First",
      "Interloper",
      "Third",
    ]);
  });
});

describe("D4 C5: 20 parallel comments on one thread yield 20 comments", () => {
  it("loses nothing under full contention", async () => {
    const store = new FakeJsonStore();
    const ids = idSequence();

    await Promise.all(
      Array.from({ length: 20 }, (_unused, index) =>
        createComment(
          context(store, viewer(`sub-${index}`), { newId: ids }),
          "blog",
          SLUG,
          `Comment ${index}`,
        ),
      ),
    );

    const bodies = threadIn(store).comments.map((comment) => comment.body);
    expect(bodies).toHaveLength(20);
    expect(new Set(bodies).size).toBe(20);
  });

  it("allows more attempts than there can be concurrent writers", () => {
    expect(CAS_ATTEMPTS).toBeGreaterThan(20);
  });

  it("gives up with a user-facing conflict rather than looping forever", async () => {
    const store = new FakeJsonStore({ failures: 100 });

    await expect(
      createComment(
        context(store, viewer("sub-a"), { attempts: 5 }),
        "blog",
        SLUG,
        "Never lands",
      ),
    ).rejects.toMatchObject({
      code: "conflict",
      message: "Could not apply the change; please retry.",
    });
    expect(store.writes).toHaveLength(5);
  });
});

describe("D4 C6: 20 parallel reactions from 20 subjects yield 20 entries", () => {
  it("loses no like", async () => {
    const store = new FakeJsonStore();

    await Promise.all(
      Array.from({ length: 20 }, (_unused, index) =>
        setEntryReaction(context(store, viewer(`sub-${index}`)), "blog", SLUG, true),
      ),
    );

    expect((store.peek(REACTIONS_KEY) as { likedBy: string[] }).likedBy).toHaveLength(20);
  });

  it("D3 C8: setting the same value twice changes state once", async () => {
    const store = new FakeJsonStore();
    const who = viewer("sub-a");

    await setEntryReaction(context(store, who), "blog", SLUG, true);
    await setEntryReaction(context(store, who), "blog", SLUG, true);
    await setEntryReaction(context(store, who), "blog", SLUG, true);

    expect((store.peek(REACTIONS_KEY) as { likedBy: string[] }).likedBy).toEqual([
      "sub-a",
    ]);
  });

  it("D3 C8: unsetting is idempotent too, and does not remove someone else", async () => {
    const store = new FakeJsonStore();
    await setEntryReaction(context(store, viewer("sub-a")), "blog", SLUG, true);
    await setEntryReaction(context(store, viewer("sub-b")), "blog", SLUG, true);

    await setEntryReaction(context(store, viewer("sub-a")), "blog", SLUG, false);
    await setEntryReaction(context(store, viewer("sub-a")), "blog", SLUG, false);

    expect((store.peek(REACTIONS_KEY) as { likedBy: string[] }).likedBy).toEqual([
      "sub-b",
    ]);
  });

  it("a toggle over an unreliable network cannot undo itself", async () => {
    const store = new FakeJsonStore();
    const who = viewer("sub-a");

    await Promise.all([
      setEntryReaction(context(store, who), "blog", SLUG, true),
      setEntryReaction(context(store, who), "blog", SLUG, true),
    ]);

    expect((store.peek(REACTIONS_KEY) as { likedBy: string[] }).likedBy).toEqual([
      "sub-a",
    ]);
  });

  it("refuses an anonymous reaction", async () => {
    const store = new FakeJsonStore();
    await expect(
      setEntryReaction(context(store, null), "blog", SLUG, true),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe("comment likes", () => {
  it("is idempotent per comment and per subject", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Body",
    );

    await setCommentLike(context(store, viewer("sub-b")), "blog", SLUG, comment.id, true);
    await setCommentLike(context(store, viewer("sub-b")), "blog", SLUG, comment.id, true);

    expect(threadIn(store).comments[0]?.likedBy).toEqual(["sub-b"]);

    await setCommentLike(context(store, viewer("sub-b")), "blog", SLUG, comment.id, false);
    expect(threadIn(store).comments[0]?.likedBy).toEqual([]);
  });

  it("404s a like on a comment that is not there", async () => {
    const store = new FakeJsonStore();
    await expect(
      setCommentLike(
        context(store, viewer("sub-a")),
        "blog",
        SLUG,
        "019218a0-7c3f-7000-8000-000000000404",
        true,
      ),
    ).rejects.toMatchObject({ code: "not-found" });
  });

  it("404s an id that is not a v7 UUID at all", async () => {
    const store = new FakeJsonStore();
    await expect(
      setCommentLike(context(store, viewer("sub-a")), "blog", SLUG, "1", true),
    ).rejects.toMatchObject({ code: "not-found" });
  });
});

describe("F-27: deletion addresses an id, never an array index", () => {
  it("deletes the author's own comment", async () => {
    const store = new FakeJsonStore();
    const ids = idSequence();
    const first = await createComment(
      context(store, viewer("sub-a"), { newId: ids }),
      "blog",
      SLUG,
      "Mine",
    );
    await createComment(
      context(store, viewer("sub-b"), { newId: ids }),
      "blog",
      SLUG,
      "Theirs",
    );

    await deleteComment(context(store, viewer("sub-a")), "blog", SLUG, first.id);

    expect(threadIn(store).comments.map((comment) => comment.body)).toEqual([
      "Theirs",
    ]);
  });

  it("refuses to delete someone else's comment", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Mine",
    );

    await expect(
      deleteComment(context(store, viewer("sub-b")), "blog", SLUG, comment.id),
    ).rejects.toMatchObject({ code: "forbidden" });
    expect(threadIn(store).comments).toHaveLength(1);
  });

  it("lets an admin delete it", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Mine",
    );

    await deleteComment(
      context(store, viewer("sub-admin", "admin")),
      "blog",
      SLUG,
      comment.id,
    );
    expect(threadIn(store).comments).toHaveLength(0);
  });

  it("deletes the right comment even when a concurrent insert shifted the array", async () => {
    const store = new FakeJsonStore();
    const ids = idSequence();
    const target = await createComment(
      context(store, viewer("sub-a"), { newId: ids }),
      "blog",
      SLUG,
      "Target",
    );

    const inserted = {
      ...target,
      id: "019218a0-7c3f-7000-8000-000000000000",
      body: "Inserted before",
    };
    store.interleave(THREAD_KEY, {
      comments: [inserted, threadIn(store).comments[0]],
    });

    await deleteComment(context(store, viewer("sub-a")), "blog", SLUG, target.id);

    expect(threadIn(store).comments.map((comment) => comment.body)).toEqual([
      "Inserted before",
    ]);
  });

  it("404s a delete of something already gone, rather than reporting a refresh", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Once",
    );
    await deleteComment(context(store, viewer("sub-a")), "blog", SLUG, comment.id);

    await expect(
      deleteComment(context(store, viewer("sub-a")), "blog", SLUG, comment.id),
    ).rejects.toMatchObject({ code: "not-found" });
  });
});

describe("replies", () => {
  const setup = async () => {
    const store = new FakeJsonStore();
    const ids = idSequence();
    const comment = await createComment(
      context(store, viewer("sub-a"), { newId: ids }),
      "blog",
      SLUG,
      "Root",
    );
    return { store, ids, comment };
  };

  it("addresses a reply to a reply by id", async () => {
    const { store, ids, comment } = await setup();

    const first = await createReply(
      context(store, viewer("sub-b"), { newId: ids }),
      "blog",
      SLUG,
      comment.id,
      "A reply",
    );
    const second = await createReply(
      context(store, viewer("sub-c"), { newId: ids }),
      "blog",
      SLUG,
      comment.id,
      "To the reply",
      first.id,
    );

    expect(second.toId).toBe(first.id);
    expect(countReplies(threadIn(store))).toBe(3);
  });

  it("404s a reply to a comment that is not there", async () => {
    const store = new FakeJsonStore();
    await expect(
      createReply(
        context(store, viewer("sub-a")),
        "blog",
        SLUG,
        "019218a0-7c3f-7000-8000-000000000404",
        "Hello",
      ),
    ).rejects.toMatchObject({ code: "not-found" });
  });

  it("404s a reply addressed to a reply that is not there", async () => {
    const { store, ids, comment } = await setup();
    await expect(
      createReply(
        context(store, viewer("sub-b"), { newId: ids }),
        "blog",
        SLUG,
        comment.id,
        "Hello",
        "019218a0-7c3f-7000-8000-000000000404",
      ),
    ).rejects.toMatchObject({ code: "not-found" });
  });

  it("clears a dangling toId when its target is deleted", async () => {
    const { store, ids, comment } = await setup();
    const first = await createReply(
      context(store, viewer("sub-b"), { newId: ids }),
      "blog",
      SLUG,
      comment.id,
      "First",
    );
    await createReply(
      context(store, viewer("sub-c"), { newId: ids }),
      "blog",
      SLUG,
      comment.id,
      "Second",
      first.id,
    );

    await deleteReply(
      context(store, viewer("sub-b")),
      "blog",
      SLUG,
      comment.id,
      first.id,
    );

    const replies = threadIn(store).comments[0]?.replies ?? [];
    expect(replies).toHaveLength(1);
    expect(replies[0]?.toId).toBeUndefined();
  });

  it("refuses to delete someone else's reply", async () => {
    const { store, ids, comment } = await setup();
    const reply = await createReply(
      context(store, viewer("sub-b"), { newId: ids }),
      "blog",
      SLUG,
      comment.id,
      "Theirs",
    );

    await expect(
      deleteReply(context(store, viewer("sub-c")), "blog", SLUG, comment.id, reply.id),
    ).rejects.toMatchObject({ code: "forbidden" });
  });
});

describe("editing", () => {
  it("records editedAt and leaves createdAt alone", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Before",
    );

    await updateComment(
      context(store, viewer("sub-a"), { now: () => "2026-08-22T00:00:00Z" }),
      "blog",
      SLUG,
      comment.id,
      "After",
    );

    const stored = threadIn(store).comments[0];
    expect(stored?.body).toBe("After");
    expect(stored?.createdAt).toBe("2026-08-21T00:00:00Z");
    expect(stored?.editedAt).toBe("2026-08-22T00:00:00Z");
  });

  it("does not let an admin rewrite someone else's words", async () => {
    const store = new FakeJsonStore();
    const comment = await createComment(
      context(store, viewer("sub-a")),
      "blog",
      SLUG,
      "Mine",
    );

    await expect(
      updateComment(
        context(store, viewer("sub-admin", "admin")),
        "blog",
        SLUG,
        comment.id,
        "Rewritten",
      ),
    ).rejects.toMatchObject({ code: "forbidden" });
  });
});
