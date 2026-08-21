"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { v7 as uuidv7 } from "uuid";
import type { Comment, CommentThread, Reply } from "../entries/model/comment";
import {
  addComment as addCommentOptimistically,
  addReply as addReplyOptimistically,
  editComment as editCommentOptimistically,
  removeComment as removeCommentOptimistically,
  removeReply as removeReplyOptimistically,
  toggleCommentLike,
} from "../entries/model/comment";
import type { CommentId, ReplyId } from "../entries/model/ids";
import { createRefetcher, watchForRefetch } from "../../lib/data/refetch";
import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  editComment,
  fetchThread,
  setCommentLike,
} from "./actions";

export type ThreadAction =
  | { readonly kind: "add"; readonly comment: Comment }
  | { readonly kind: "reply"; readonly commentId: CommentId; readonly reply: Reply }
  | {
      readonly kind: "edit";
      readonly commentId: CommentId;
      readonly body: string;
      readonly at: string;
    }
  | { readonly kind: "remove"; readonly commentId: CommentId }
  | {
      readonly kind: "removeReply";
      readonly commentId: CommentId;
      readonly replyId: ReplyId;
    }
  | {
      readonly kind: "like";
      readonly commentId: CommentId;
      readonly sub: string;
      readonly liked: boolean;
    };

export function applyOptimistic(
  thread: CommentThread,
  action: ThreadAction,
): CommentThread {
  switch (action.kind) {
    case "add":
      return addCommentOptimistically(thread, action.comment);
    case "reply":
      return addReplyOptimistically(thread, action.commentId, action.reply);
    case "edit":
      return editCommentOptimistically(
        thread,
        action.commentId,
        action.body,
        action.at,
      );
    case "remove":
      return removeCommentOptimistically(thread, action.commentId);
    case "removeReply":
      return removeReplyOptimistically(thread, action.commentId, action.replyId);
    case "like": {
      const comment = thread.comments.find(
        (candidate) => candidate.id === action.commentId,
      );
      if (comment === undefined) return thread;
      return comment.likedBy.includes(action.sub) === action.liked
        ? thread
        : toggleCommentLike(thread, action.commentId, action.sub);
    }
  }
}

export type ThreadHandle = {
  readonly thread: CommentThread;
  readonly pending: boolean;
  readonly error: string | null;
  readonly refresh: () => void;
  readonly post: (body: string) => void;
  readonly reply: (commentId: CommentId, body: string, toId?: ReplyId) => void;
  readonly edit: (commentId: CommentId, body: string) => void;
  readonly remove: (commentId: CommentId) => void;
  readonly removeReply: (commentId: CommentId, replyId: ReplyId) => void;
  readonly like: (commentId: CommentId, liked: boolean) => void;
};

export type ThreadOptions = {
  readonly section: string;
  readonly slug: string;
  readonly initial: CommentThread;
  readonly viewerSub: string | null;
};

const monotonic = (): number => performance.now();

const isVisible = (): boolean => document.visibilityState === "visible";

const messageOf = (error: unknown): string =>
  error instanceof Error && error.message.length > 0
    ? error.message
    : "That did not go through. Try again.";

export function useCommentThread(options: ThreadOptions): ThreadHandle {
  const { section, slug, initial, viewerSub } = options;

  const [thread, setThread] = useState(initial);
  const [optimistic, addOptimistic] = useOptimistic(thread, applyOptimistic);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const commit = useCallback(
    (action: ThreadAction | null, run: () => Promise<CommentThread>) => {
      startTransition(async () => {
        if (action !== null) addOptimistic(action);
        try {
          const next = await run();
          setThread(next);
          setError(null);
        } catch (cause) {
          setError(messageOf(cause));
        }
      });
    },
    [addOptimistic],
  );

  const reload = useCallback(() => {
    commit(null, () => fetchThread(section, slug));
  }, [commit, section, slug]);

  const refetcher = useMemo(
    () => createRefetcher({ now: monotonic, run: reload }),
    [reload],
  );

  useEffect(
    () => watchForRefetch(window, { isVisible }, refetcher),
    [refetcher],
  );

  const now = (): string => new Date().toISOString();

  return {
    thread: optimistic,
    pending,
    error,

    refresh: () => {
      refetcher.request("manual");
    },

    post: (body) => {
      if (viewerSub === null) return;
      const comment: Comment = {
        id: uuidv7() as CommentId,
        authorSub: viewerSub,
        body,
        createdAt: now(),
        likedBy: [],
        replies: [],
      };
      commit({ kind: "add", comment }, () => addComment(section, slug, body));
    },

    reply: (commentId, body, toId) => {
      if (viewerSub === null) return;
      const base = {
        id: uuidv7() as ReplyId,
        authorSub: viewerSub,
        body,
        createdAt: now(),
      };
      const reply: Reply = toId === undefined ? base : { ...base, toId };
      commit({ kind: "reply", commentId, reply }, () =>
        addReply(section, slug, commentId, body, toId),
      );
    },

    edit: (commentId, body) => {
      commit({ kind: "edit", commentId, body, at: now() }, () =>
        editComment(section, slug, commentId, body),
      );
    },

    remove: (commentId) => {
      commit({ kind: "remove", commentId }, () =>
        deleteComment(section, slug, commentId),
      );
    },

    removeReply: (commentId, replyId) => {
      commit({ kind: "removeReply", commentId, replyId }, () =>
        deleteReply(section, slug, commentId, replyId),
      );
    },

    like: (commentId, liked) => {
      if (viewerSub === null) return;
      commit({ kind: "like", commentId, sub: viewerSub, liked }, () =>
        setCommentLike(section, slug, commentId, liked),
      );
    },
  };
}
