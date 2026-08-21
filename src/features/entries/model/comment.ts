import type { CommentId, ReplyId } from "./ids";

export type Reply = {
  readonly id: ReplyId;
  readonly authorSub: string;
  readonly toId?: ReplyId | undefined;
  readonly body: string;
  readonly createdAt: string;
  readonly editedAt?: string | undefined;
};

export type Comment = {
  readonly id: CommentId;
  readonly authorSub: string;
  readonly body: string;
  readonly createdAt: string;
  readonly editedAt?: string | undefined;
  readonly likedBy: readonly string[];
  readonly replies: readonly Reply[];
};

export type CommentThread = {
  readonly comments: readonly Comment[];
};

export type ReactionSet = {
  readonly likedBy: readonly string[];
};

export const byId = <T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined => items.find((item) => item.id === id);

export const sortComments = (
  comments: readonly Comment[],
): readonly Comment[] => [...comments].sort((a, b) => (a.id < b.id ? -1 : 1));

export function addComment(
  thread: CommentThread,
  comment: Comment,
): CommentThread {
  return { comments: sortComments([...thread.comments, comment]) };
}

export function removeComment(
  thread: CommentThread,
  id: CommentId,
): CommentThread {
  return { comments: thread.comments.filter((comment) => comment.id !== id) };
}

export function editComment(
  thread: CommentThread,
  id: CommentId,
  body: string,
  editedAt: string,
): CommentThread {
  return {
    comments: thread.comments.map((comment) =>
      comment.id === id ? { ...comment, body, editedAt } : comment,
    ),
  };
}

export function addReply(
  thread: CommentThread,
  commentId: CommentId,
  reply: Reply,
): CommentThread {
  return {
    comments: thread.comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment,
    ),
  };
}

export function removeReply(
  thread: CommentThread,
  commentId: CommentId,
  replyId: ReplyId,
): CommentThread {
  return {
    comments: thread.comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            replies: comment.replies
              .filter((reply) => reply.id !== replyId)
              .map((reply) =>
                reply.toId === replyId ? withoutTarget(reply) : reply,
              ),
          }
        : comment,
    ),
  };
}

const withoutTarget = (reply: Reply): Reply => {
  const { toId: _dropped, ...rest } = reply;
  return rest;
};

export function toggleLike(set: ReactionSet, sub: string): ReactionSet {
  return set.likedBy.includes(sub)
    ? { likedBy: set.likedBy.filter((member) => member !== sub) }
    : { likedBy: [...set.likedBy, sub] };
}

export const likeCount = (set: ReactionSet): number => set.likedBy.length;

export function toggleCommentLike(
  thread: CommentThread,
  id: CommentId,
  sub: string,
): CommentThread {
  return {
    comments: thread.comments.map((comment) =>
      comment.id === id
        ? { ...comment, likedBy: toggleLike(comment, sub).likedBy }
        : comment,
    ),
  };
}

export const likedBy = (set: ReactionSet, sub: string | null): boolean =>
  sub !== null && set.likedBy.includes(sub);

export const countReplies = (thread: CommentThread): number =>
  thread.comments.reduce(
    (total, comment) => total + 1 + comment.replies.length,
    0,
  );
