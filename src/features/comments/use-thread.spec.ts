import { describe, expect, it } from "vitest";
import type { Comment, CommentThread, Reply } from "../entries/model/comment";
import type { CommentId, ReplyId } from "../entries/model/ids";
import { applyOptimistic } from "./use-thread";

const commentId = (n: number): CommentId =>
  `019218a0-7c3f-7000-8000-00000000000${n}` as CommentId;
const replyId = (n: number): ReplyId =>
  `019218a0-7c3f-7000-8000-10000000000${n}` as ReplyId;

const comment = (n: number, overrides: Partial<Comment> = {}): Comment => ({
  id: commentId(n),
  authorSub: "sub-a",
  body: `Comment ${n}`,
  createdAt: "2026-08-01T00:00:00Z",
  likedBy: [],
  replies: [],
  ...overrides,
});

const reply = (n: number, overrides: Partial<Reply> = {}): Reply => ({
  id: replyId(n),
  authorSub: "sub-b",
  body: `Reply ${n}`,
  createdAt: "2026-08-02T00:00:00Z",
  ...overrides,
});

const thread = (comments: readonly Comment[]): CommentThread => ({ comments });

describe("D3 §6.1: the optimistic reducer covers every mutation", () => {
  it("shows a new comment before the server confirms it", () => {
    const next = applyOptimistic(thread([comment(1)]), {
      kind: "add",
      comment: comment(2),
    });
    expect(next.comments.map((entry) => entry.body)).toEqual([
      "Comment 1",
      "Comment 2",
    ]);
  });

  it("shows a reply under the right comment", () => {
    const next = applyOptimistic(thread([comment(1), comment(2)]), {
      kind: "reply",
      commentId: commentId(2),
      reply: reply(1),
    });
    expect(next.comments[0]?.replies).toHaveLength(0);
    expect(next.comments[1]?.replies).toHaveLength(1);
  });

  it("shows an edit with its timestamp", () => {
    const next = applyOptimistic(thread([comment(1)]), {
      kind: "edit",
      commentId: commentId(1),
      body: "Revised",
      at: "2026-08-03T00:00:00Z",
    });
    expect(next.comments[0]?.body).toBe("Revised");
    expect(next.comments[0]?.editedAt).toBe("2026-08-03T00:00:00Z");
  });

  it("removes a comment and a reply", () => {
    const withReply = thread([comment(1, { replies: [reply(1), reply(2)] })]);

    expect(
      applyOptimistic(withReply, { kind: "remove", commentId: commentId(1) })
        .comments,
    ).toHaveLength(0);

    expect(
      applyOptimistic(withReply, {
        kind: "removeReply",
        commentId: commentId(1),
        replyId: replyId(1),
      }).comments[0]?.replies,
    ).toHaveLength(1);
  });

  it("D3 C8: a like is set, not toggled, so a double submit is a no-op", () => {
    const once = applyOptimistic(thread([comment(1)]), {
      kind: "like",
      commentId: commentId(1),
      sub: "sub-c",
      liked: true,
    });
    const twice = applyOptimistic(once, {
      kind: "like",
      commentId: commentId(1),
      sub: "sub-c",
      liked: true,
    });

    expect(once.comments[0]?.likedBy).toEqual(["sub-c"]);
    expect(twice.comments[0]?.likedBy).toEqual(["sub-c"]);
    expect(twice).toBe(once);
  });

  it("unliking is idempotent too", () => {
    const liked = thread([comment(1, { likedBy: ["sub-c"] })]);
    const removed = applyOptimistic(liked, {
      kind: "like",
      commentId: commentId(1),
      sub: "sub-c",
      liked: false,
    });
    expect(removed.comments[0]?.likedBy).toEqual([]);
    expect(
      applyOptimistic(removed, {
        kind: "like",
        commentId: commentId(1),
        sub: "sub-c",
        liked: false,
      }),
    ).toBe(removed);
  });

  it("ignores a like on a comment that is no longer there", () => {
    const empty = thread([]);
    expect(
      applyOptimistic(empty, {
        kind: "like",
        commentId: commentId(1),
        sub: "sub-c",
        liked: true,
      }),
    ).toBe(empty);
  });

  it("never mutates the thread it was given, which is what lets React roll it back", () => {
    const before = thread([comment(1, { replies: [reply(1)] })]);
    const snapshot = JSON.stringify(before);

    applyOptimistic(before, { kind: "add", comment: comment(2) });
    applyOptimistic(before, { kind: "remove", commentId: commentId(1) });
    applyOptimistic(before, {
      kind: "edit",
      commentId: commentId(1),
      body: "x",
      at: "2026-08-03T00:00:00Z",
    });
    applyOptimistic(before, {
      kind: "like",
      commentId: commentId(1),
      sub: "sub-c",
      liked: true,
    });

    expect(JSON.stringify(before)).toBe(snapshot);
  });

  it("applies to the same reducer the server uses, so the two cannot drift", () => {
    const posted = applyOptimistic(thread([]), {
      kind: "add",
      comment: comment(1),
    });
    expect(posted.comments[0]).toEqual(comment(1));
  });
});
