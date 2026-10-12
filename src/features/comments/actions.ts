"use server";

import { updateTag } from "next/cache";
import { requireSection, requireSlugParam } from "../../server/http/params";
import { requestContext } from "../../server/http/context";
import { writeLimiter } from "../../server/http/rate-limit";
import { albumReactionsTag } from "../../server/comments/album-counts";
import { entryTag } from "../../server/entries/read";
import {
  createComment,
  createReply,
  deleteComment as removeComment,
  deleteReply as removeReply,
  readReactions,
  readThread,
  setCommentLike as applyCommentLike,
  setEntryReaction as applyEntryReaction,
  updateComment as applyCommentEdit,
} from "../../server/comments/mutations";
import type { CommentContext } from "../../server/comments/mutations";
import { requireActive } from "../../server/session/authorize";
import type { CommentThread, ReactionSet } from "../entries/model/comment";
import type { Slug } from "../entries/model/ids";
import type { CommentSection } from "../../server/storage/keys";
const requireCommentSection = (section: string): CommentSection => section === "home" ? "home" : requireSection(section);

const context = async (): Promise<CommentContext> => {
  const request = await requestContext();
  return {
    store: request.store.asJsonStore(),
    viewer: request.viewer,
    now: request.now,
  };
};

const gate = (context: CommentContext): void => {
  const viewer = requireActive(context.viewer);
  writeLimiter.require(`write:${viewer.sub}`);
};

const invalidate = (section: CommentSection, slug: Slug): void => {
  updateTag(section === "home" ? "home:messages" : entryTag(section, slug));
};

export async function addComment(
  rawSection: string,
  rawSlug: string,
  body: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await createComment(request, section, slug, body);
  invalidate(section, slug);
  return readThread(request.store, section, slug);
}

export async function addReply(
  rawSection: string,
  rawSlug: string,
  commentId: string,
  body: string,
  toId?: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await createReply(request, section, slug, commentId, body, toId);
  invalidate(section, slug);
  return readThread(request.store, section, slug);
}

export async function editComment(
  rawSection: string,
  rawSlug: string,
  commentId: string,
  body: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await applyCommentEdit(request, section, slug, commentId, body);
  invalidate(section, slug);
  return readThread(request.store, section, slug);
}

export async function deleteComment(
  rawSection: string,
  rawSlug: string,
  commentId: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await removeComment(request, section, slug, commentId);
  invalidate(section, slug);
  return readThread(request.store, section, slug);
}

export async function deleteReply(
  rawSection: string,
  rawSlug: string,
  commentId: string,
  replyId: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await removeReply(request, section, slug, commentId, replyId);
  invalidate(section, slug);
  return readThread(request.store, section, slug);
}

export async function setCommentLike(
  rawSection: string,
  rawSlug: string,
  commentId: string,
  liked: boolean,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  await applyCommentLike(request, section, slug, commentId, liked);
  return readThread(request.store, section, slug);
}

export async function setEntryReaction(
  rawSection: string,
  rawSlug: string,
  liked: boolean,
): Promise<ReactionSet> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  gate(request);

  const reactions = await applyEntryReaction(request, section, slug, liked);
  if (section === "album") updateTag(albumReactionsTag);
  return reactions;
}

export async function fetchThread(
  rawSection: string,
  rawSlug: string,
): Promise<CommentThread> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  return readThread(request.store, section, slug);
}

export async function fetchReactions(
  rawSection: string,
  rawSlug: string,
): Promise<ReactionSet> {
  const section = requireCommentSection(rawSection);
  const slug = requireSlugParam(rawSlug);
  const request = await context();
  return readReactions(request.store, section, slug);
}
