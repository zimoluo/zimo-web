import { v7 as uuidv7 } from "uuid";
import { AppError } from "../../lib/errors";
import {
  addComment,
  addReply,
  byId,
  editComment,
  removeComment,
  removeReply,
  toggleCommentLike,
} from "../../features/entries/model/comment";
import type {
  Comment,
  CommentThread,
  ReactionSet,
  Reply,
} from "../../features/entries/model/comment";
import type { CommentId, ReplyId, Slug } from "../../features/entries/model/ids";
import { parseCommentId, parseReplyId } from "../../features/entries/model/ids";
import {
  parseCommentThread,
  parseReactionSet,
} from "../../features/entries/model/schema";
import type { CommentSection } from "../storage/keys";
import { keys } from "../storage/keys";
import { mutateJson } from "../storage/mutate";
import type { JsonStore } from "../storage/mutate";
import {
  requireActive,
  requireBody,
  requireOwner,
  requireOwnerOrAdmin,
} from "../session/authorize";
import type { MaybeViewer } from "../session/authorize";

export const EMPTY_THREAD: CommentThread = { comments: [] };
export const EMPTY_REACTIONS: ReactionSet = { likedBy: [] };

export const CAS_ATTEMPTS = 24;

export type CommentContext = {
  readonly store: JsonStore;
  readonly viewer: MaybeViewer;
  readonly now: () => string;
  readonly newId?: (() => string) | undefined;
  readonly attempts?: number | undefined;
  readonly sleep?: ((ms: number) => Promise<void>) | undefined;
};

const casOptions = (context: CommentContext) => ({
  attempts: context.attempts ?? CAS_ATTEMPTS,
  sleep: context.sleep,
});

const requireCommentId = (raw: string): CommentId => {
  const id = parseCommentId(raw);
  if (id === null) throw new AppError("not-found", "No such comment.");
  return id;
};

const requireReplyId = (raw: string): ReplyId => {
  const id = parseReplyId(raw);
  if (id === null) throw new AppError("not-found", "No such reply.");
  return id;
};

const findComment = (thread: CommentThread, id: CommentId): Comment => {
  const found = byId(thread.comments, id);
  if (found === undefined) throw new AppError("not-found", "No such comment.");
  return found;
};

const findReply = (comment: Comment, id: ReplyId): Reply => {
  const found = byId(comment.replies, id);
  if (found === undefined) throw new AppError("not-found", "No such reply.");
  return found;
};

const mutateThread = (
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  update: (thread: CommentThread) => CommentThread,
): Promise<CommentThread> =>
  mutateJson(
    context.store,
    keys.commentThread(section, slug),
    parseCommentThread,
    () => EMPTY_THREAD,
    update,
    casOptions(context),
  );

export async function readThread(
  store: JsonStore,
  section: CommentSection,
  slug: Slug,
): Promise<CommentThread> {
  const record = await store.readRaw(keys.commentThread(section, slug));
  return record === null ? EMPTY_THREAD : parseCommentThread(record.value);
}

export async function readReactions(
  store: JsonStore,
  section: CommentSection,
  slug: Slug,
): Promise<ReactionSet> {
  const record = await store.readRaw(keys.reactions(section, slug));
  return record === null ? EMPTY_REACTIONS : parseReactionSet(record.value);
}

export async function createComment(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawBody: string,
): Promise<Comment> {
  const viewer = requireActive(context.viewer);

  const comment: Comment = {
    id: requireCommentId((context.newId ?? uuidv7)()),
    authorSub: viewer.sub,
    body: requireBody(rawBody),
    createdAt: context.now(),
    likedBy: [],
    replies: [],
  };

  await mutateThread(context, section, slug, (thread) =>
    addComment(thread, comment),
  );

  return comment;
}

export async function createReply(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawCommentId: string,
  rawBody: string,
  rawToId?: string,
): Promise<Reply> {
  const viewer = requireActive(context.viewer);
  const commentId = requireCommentId(rawCommentId);
  const toId = rawToId === undefined ? undefined : requireReplyId(rawToId);

  const base = {
    id: requireReplyId((context.newId ?? uuidv7)()),
    authorSub: viewer.sub,
    body: requireBody(rawBody),
    createdAt: context.now(),
  };

  const reply: Reply = toId === undefined ? base : { ...base, toId };

  await mutateThread(context, section, slug, (thread) => {
    const comment = findComment(thread, commentId);
    if (toId !== undefined) findReply(comment, toId);
    return addReply(thread, commentId, reply);
  });

  return reply;
}

export async function deleteComment(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawCommentId: string,
): Promise<void> {
  const commentId = requireCommentId(rawCommentId);

  await mutateThread(context, section, slug, (thread) => {
    requireOwnerOrAdmin(context.viewer, findComment(thread, commentId));
    return removeComment(thread, commentId);
  });
}

export async function deleteReply(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawCommentId: string,
  rawReplyId: string,
): Promise<void> {
  const commentId = requireCommentId(rawCommentId);
  const replyId = requireReplyId(rawReplyId);

  await mutateThread(context, section, slug, (thread) => {
    const comment = findComment(thread, commentId);
    requireOwnerOrAdmin(context.viewer, findReply(comment, replyId));
    return removeReply(thread, commentId, replyId);
  });
}

export async function updateComment(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawCommentId: string,
  rawBody: string,
): Promise<void> {
  const commentId = requireCommentId(rawCommentId);
  const body = requireBody(rawBody);
  const at = context.now();

  await mutateThread(context, section, slug, (thread) => {
    requireOwner(context.viewer, findComment(thread, commentId));
    return editComment(thread, commentId, body, at);
  });
}

export async function setCommentLike(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  rawCommentId: string,
  liked: boolean,
): Promise<void> {
  const viewer = requireActive(context.viewer);
  const commentId = requireCommentId(rawCommentId);

  await mutateThread(context, section, slug, (thread) => {
    const comment = findComment(thread, commentId);
    return comment.likedBy.includes(viewer.sub) === liked
      ? thread
      : toggleCommentLike(thread, commentId, viewer.sub);
  });
}

export async function setEntryReaction(
  context: CommentContext,
  section: CommentSection,
  slug: Slug,
  liked: boolean,
): Promise<ReactionSet> {
  const viewer = requireActive(context.viewer);

  return mutateJson(
    context.store,
    keys.reactions(section, slug),
    parseReactionSet,
    () => EMPTY_REACTIONS,
    (current) => {
      if (current.likedBy.includes(viewer.sub) === liked) return current;
      return liked
        ? { likedBy: [...current.likedBy, viewer.sub] }
        : { likedBy: current.likedBy.filter((sub) => sub !== viewer.sub) };
    },
    casOptions(context),
  );
}
