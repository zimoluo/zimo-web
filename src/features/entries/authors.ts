import type { AuthorId } from "./model/ids";
import { parseAuthorId } from "./model/ids";
import type { AuthorRef, ImageAsset } from "./model/types";

export const BUCKET_ORIGIN =
  "https://zimo-web-bucket.s3.us-east-2.amazonaws.com";

export type AuthorRecord = {
  readonly id: AuthorId;
  readonly name: string;
  readonly avatar: ImageAsset;
};

const avatarFromBucket = (id: string): ImageAsset => ({
  src: `${BUCKET_ORIGIN}/blog/author/${id}`,
  width: 256,
  height: 256,
  alt: "",
});

const ZIMO_AVATAR: ImageAsset = {
  src: "/util/zimo-default-profile.svg",
  width: 256,
  height: 256,
  alt: "",
};

const REGISTRY: readonly AuthorRecord[] = [
  { id: "zimo" as AuthorId, name: "Zimo Luo", avatar: ZIMO_AVATAR },
];

const BY_ID = new Map(REGISTRY.map((record) => [record.id as string, record]));

export const allAuthors = (): readonly AuthorRecord[] => REGISTRY;

export function resolveAuthor(id: string, fallbackName?: string): AuthorRef {
  const known = BY_ID.get(id);
  if (known !== undefined) {
    return { id: known.id, name: known.name, avatar: known.avatar };
  }

  const parsed = parseAuthorId(id);
  if (parsed === null) {
    return { id: "unknown" as AuthorId, name: fallbackName ?? id };
  }

  return {
    id: parsed,
    name: fallbackName ?? parsed,
    avatar: avatarFromBucket(parsed),
  };
}

export const resolveAuthors = (
  ids: readonly string[],
  names?: readonly string[],
): readonly AuthorRef[] =>
  ids.map((id, index) => resolveAuthor(id, names?.[index]));

export const authorNames = (authors: readonly AuthorRef[]): string =>
  authors.map((author) => author.name).join(", ");
