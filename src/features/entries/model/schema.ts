import { z } from "zod";
import { isIsoInstant } from "../../../lib/datetime";
import { parseAuthorId, parseSlug, uuidVersion } from "./ids";
import type {
  Comment,
  CommentThread,
  ReactionSet,
  Reply,
} from "./comment";
import { LINK_KINDS, SECTIONS } from "./types";
import type { Entry, EntrySummary, ImageAsset, SectionIndex } from "./types";

const instant = z
  .string()
  .refine((value) => value.endsWith("Z") && isIsoInstant(value), {
    message: "expected an ISO 8601 instant in UTC, ending in Z",
  });

const slug = z.string().refine((value) => parseSlug(value) !== null, {
  message: "expected a lowercase hyphenated slug",
});

const authorId = z.string().refine((value) => parseAuthorId(value) !== null, {
  message: "expected a lowercase hyphenated author id",
});

const uuidV7 = z.string().refine((value) => uuidVersion(value) === 7, {
  message: "expected a UUID v7",
});

export const imageAssetSchema = z.object({
  src: z.string().min(1),
  originalSrc: z.string().min(1).optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string(),
  caption: z.string().optional(),
  focus: z
    .object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) })
    .optional(),
  placeholder: z.string().optional(),
});

export const authorRefSchema = z.object({
  id: authorId,
  name: z.string().min(1),
  avatar: imageAssetSchema.optional(),
});

const placeSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
});

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  kind: z.enum(LINK_KINDS),
});

export const sectionExtrasSchema = z.discriminatedUnion("section", [
  z.object({ section: z.literal("blog") }),
  z.object({ section: z.literal("management") }),
  z.object({
    section: z.literal("album"),
    place: placeSchema.optional(),
    instagramUrl: z.string().optional(),
  }),
  z.object({
    section: z.literal("projects"),
    links: z.array(projectLinkSchema),
    icon: imageAssetSchema,
  }),
]);

export const entrySummarySchema = z.object({
  section: z.enum(SECTIONS),
  slug,
  title: z.string().min(1),
  description: z.string().optional(),
  publishedAt: instant,
  updatedAt: instant.optional(),
  unlisted: z.boolean(),
  tags: z.array(z.string().min(1)),
  authors: z.array(authorRefSchema),
  cover: imageAssetSchema.optional(),
});

export const sectionIndexSchema = z.object({
  section: z.enum(SECTIONS),
  builtAt: instant,
  entries: z.array(entrySummarySchema),
});

export const storedEntrySchema = entrySummarySchema.extend({
  images: z.array(imageAssetSchema),
  extras: sectionExtrasSchema,
  markdown: z.string().optional(),
});

export const replySchema = z.object({
  id: uuidV7,
  authorSub: z.string().min(1),
  toId: uuidV7.optional(),
  body: z.string(),
  createdAt: instant,
  editedAt: instant.optional(),
});

export const commentSchema = z.object({
  id: uuidV7,
  authorSub: z.string().min(1),
  body: z.string(),
  createdAt: instant,
  editedAt: instant.optional(),
  likedBy: z.array(z.string()),
  replies: z.array(replySchema),
});

export const commentThreadSchema = z.object({
  comments: z.array(commentSchema),
});

export const reactionSetSchema = z.object({ likedBy: z.array(z.string()) });

export type StoredEntry = Omit<Entry, "body"> & { readonly markdown?: string | undefined };

const cast = <T>(value: unknown): T => value as T;

export const parseEntrySummary = (input: unknown): EntrySummary =>
  cast<EntrySummary>(entrySummarySchema.parse(input));

export const parseSectionIndex = (input: unknown): SectionIndex =>
  cast<SectionIndex>(sectionIndexSchema.parse(input));

export const parseStoredEntry = (input: unknown): StoredEntry =>
  cast<StoredEntry>(storedEntrySchema.parse(input));

export const parseComment = (input: unknown): Comment =>
  cast<Comment>(commentSchema.parse(input));

export const parseReply = (input: unknown): Reply =>
  cast<Reply>(replySchema.parse(input));

export const parseCommentThread = (input: unknown): CommentThread =>
  cast<CommentThread>(commentThreadSchema.parse(input));

export const parseReactionSet = (input: unknown): ReactionSet =>
  cast<ReactionSet>(reactionSetSchema.parse(input));

export const parseImageAsset = (input: unknown): ImageAsset =>
  cast<ImageAsset>(imageAssetSchema.parse(input));


type JsonHast = { type:"text";value:string } | { type:"element";tagName:string;properties:Record<string,string|number|boolean|null|undefined|(string|number)[]>;children:JsonHast[] };
const hastNodeSchema:z.ZodType<JsonHast> = z.lazy(() => z.discriminatedUnion("type",[
  z.object({type:z.literal("text"),value:z.string()}),
  z.object({type:z.literal("element"),tagName:z.string().regex(/^[a-z][a-z0-9-]*$/i).refine((tag) => !["script","iframe","object","embed"].includes(tag)),properties:z.record(z.string(),z.union([z.string(),z.number(),z.boolean(),z.null(),z.undefined(),z.array(z.union([z.string(),z.number()]))])).default({}),children:z.array(hastNodeSchema)})
]));
const documentSchema=z.object({type:z.literal("root"),children:z.array(hastNodeSchema)});
const parsedDocumentSchema=z.object({document:documentSchema,outline:z.array(z.object({id:z.string(),depth:z.number().int().min(1).max(6),text:z.string()})),plainText:z.string(),readingMinutes:z.number().nonnegative(),issues:z.array(z.object({severity:z.enum(["error","warning","deprecated"]),code:z.string(),message:z.string(),line:z.number().optional(),column:z.number().optional()}))});
export const loadedEntrySchema=storedEntrySchema.omit({markdown:true}).extend({body:z.discriminatedUnion("kind",[z.object({kind:z.literal("none")}),z.object({kind:z.literal("document"),document:documentSchema})]),parsed:parsedDocumentSchema.nullable()});
export const parseLoadedEntry=(input:unknown):import("./loaded").LoadedEntry=>loadedEntrySchema.parse(input) as unknown as import("./loaded").LoadedEntry;
