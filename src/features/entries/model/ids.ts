export type Slug = string & { readonly __brand: "Slug" };
export type AuthorId = string & { readonly __brand: "AuthorId" };
export type CommentId = string & { readonly __brand: "CommentId" };
export type ReplyId = string & { readonly __brand: "ReplyId" };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MAX_LENGTH = 120;

export const isSlug = (input: string): boolean =>
  input.length > 0 && input.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(input);

export const parseSlug = (input: string): Slug | null =>
  isSlug(input) ? (input as Slug) : null;

export function requireSlug(input: string): Slug {
  const slug = parseSlug(input);
  if (slug === null) throw new Error(`not a slug: ${JSON.stringify(input)}`);
  return slug;
}

const AUTHOR_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}$/;

export const parseAuthorId = (input: string): AuthorId | null =>
  AUTHOR_ID_PATTERN.test(input) ? (input as AuthorId) : null;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const isUuid = (input: string): boolean => UUID_PATTERN.test(input);

export const uuidVersion = (input: string): number | null =>
  isUuid(input) ? Number.parseInt(input[14] as string, 16) : null;

export const parseCommentId = (input: string): CommentId | null =>
  uuidVersion(input) === 7 ? (input as CommentId) : null;

export const parseReplyId = (input: string): ReplyId | null =>
  uuidVersion(input) === 7 ? (input as ReplyId) : null;
