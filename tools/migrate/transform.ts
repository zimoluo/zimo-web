import matter from "gray-matter";
import { createHash } from "node:crypto";
import { v7 as uuidv7 } from "uuid";
import { migrateDocument, migrateInlineMarks } from "../../src/features/document/migrate-syntax";
import { parseDocument } from "../../src/features/document/parse";
import { allAuthors, BUCKET_ORIGIN } from "../../src/features/entries/authors";
import { parseTreeBoard } from "../../src/server/special/tree";
import { parseCommentThread,parseReactionSet } from "../../src/features/entries/model/schema";
import { parseStoredEntry } from "../../src/features/entries/model/schema";
import type { StoredEntry } from "../../src/features/entries/model/schema";
import type { AuthorRef, ImageAsset, Section, ProjectLink } from "../../src/features/entries/model/types";
import { requireSlug, parseAuthorId } from "../../src/features/entries/model/ids";
import { migrateSettings } from "../../src/features/settings/migrate";
import { migrateThemePreferences } from "../../src/features/theme/model/preferences";
import { migrateWorkspace } from "../../src/features/workspace/migrate";
import type { Root,RootContent } from "hast";
import { parseStoredUser } from "../../src/server/account/user";

export type MigrationIssue = { readonly key: string; readonly message: string; readonly blocking: boolean };
export type MigrationOutput = { readonly key: string; readonly body: string };
export type TransformResult = { readonly outputs: readonly MigrationOutput[]; readonly issues: readonly MigrationIssue[] };
export type MeasureImage = (src: string, alt: string, caption?: string, originalSrc?: string) => Promise<ImageAsset>;
const object = (input: unknown): Record<string, unknown> => {
  if (typeof input !== "object" || input === null || Array.isArray(input)) throw new Error("Expected an object");
  return input as Record<string, unknown>;
};
const text = (input: unknown, fallback = ""): string => typeof input === "string" ? input : fallback;
const strings = (input: unknown): string[] => Array.isArray(input) ? input.filter((value): value is string => typeof value === "string") : [];
const instant = (value: unknown): string => {
  const raw = text(value).trim();
  const date = /^\d{4}-\d{1,2}-\d{1,2}$/.test(raw) ? new Date(`${raw.split("-").map((part,index) => index === 0 ? part : part.padStart(2,"0")).join("-")}T00:00:00Z`) : new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(raw) ? `${raw}Z` : raw);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid timestamp: ${raw}`);
  return date.toISOString();
};
const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const normalizeId = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "unknown";
const sectionFor = (key: string): Section | null => key.startsWith("blog/text/") || key.startsWith("blog/documents/") ? "blog" : key.startsWith("about/text/") || key.startsWith("management/documents/") ? "management" : key.startsWith("photos/entries/") || key.startsWith("album/entries/") ? "album" : key.startsWith("projects/entries/") ? "projects" : null;
export const finalKey = (key: string): string => {
  const pairs = [["photos/","album/"],["blog/text/","blog/documents/"],["about/text/","management/documents/"],["about/comments/","management/comments/"],["about/likedBy/","management/reactions/"],["about/homepage/","home/"],["about/aboutpage/","about/"]] as const;
  for (const [old,next] of pairs) if (key.startsWith(old)) return `${next}${key.slice(old.length)}`.replace("/likedBy/","/reactions/");
  return key.replace("/likedBy/","/reactions/");
};

export async function transformObject(key: string, body: string, measure: MeasureImage): Promise<TransformResult> {
  const issues: MigrationIssue[] = [];
  const target = finalKey(key);
  const stableId = (at: string, identity: string): string => uuidv7({ msecs: Date.parse(at), random: createHash("sha256").update(`${key}:${identity}`).digest().subarray(0,16) });
  const section = sectionFor(key);
  if(key.endsWith(".meta.json")) { parseStoredEntry(JSON.parse(body)); return {outputs:[],issues}; }
  if (section !== null && !key.endsWith(".meta.json") && (key.endsWith(".md") || key.endsWith(".json"))) {
    const document = key.endsWith(".md") ? matter(body) : null;
    const data = document === null ? object(JSON.parse(body)) : document.data;
    if ((data.schema === 2 || data.formatVersion === 2) && target === key) {
      if (document === null) parseStoredEntry(data);
      return { outputs: [], issues };
    }
    const content = data.content ?? data.body;
    if (document === null && content !== undefined && typeof content !== "string" && (!Array.isArray(content) || content.some((item) => typeof item !== "string"))) {
      return { outputs: [], issues: [{key, message:"Unsupported legacy rich document tree; select the authored Markdown source instead", blocking:true}] };
    }
    const slug = requireSlug(key.slice(key.lastIndexOf("/") + 1).replace(/\.(md|json)$/,""));
    const image = async (src: string, alt: string, caption?: string, originalSrc?: string): Promise<ImageAsset> => {
      if (alt.length === 0) issues.push({ key, message: `Image needs authored alt text: ${src}`, blocking: false });
      return measure(src, alt, caption === undefined ? undefined : migrateInlineMarks(caption).markdown, originalSrc);
    };
    const images: ImageAsset[] = [];
    if (Array.isArray(data.images)) {
      for (const value of data.images) images.push(value as ImageAsset);
    } else if (data.images !== undefined) {
      const old = object(data.images);
      const urls = strings(old.url), captions = strings(old.text), originals = strings(old.original);
      for (const [index,src] of urls.entries()) images.push(await image(src, captions[index] ?? "", captions[index], originals[index]));
      const ratio = text(old.aspectRatio).split(":").map(Number);
      if (images[0] !== undefined && ratio.length === 2 && ratio[1] !== 0 && Math.abs(images[0].width / images[0].height - Number(ratio[0]) / Number(ratio[1])) > .01) issues.push({ key, message: "Measured image ratio differs from legacy shared aspectRatio", blocking: false });
    }
    const oldCover = typeof data.cover === "object" && data.cover !== null ? object(data.cover) : undefined;
    const coverName = text(data.coverImage, text(oldCover?.regular));
    const cover = oldCover?.src !== undefined ? oldCover as ImageAsset : coverName.length === 0 ? undefined : await image(coverName.startsWith("/") ? `${BUCKET_ORIGIN}/blog/posts/${slug}/${coverName.slice(1)}` : coverName, `Cover of ${text(data.title)}`);
    const rawAuthors = Array.isArray(data.authors) ? data.authors : [];
    const authorInputs = rawAuthors.length > 0 ? rawAuthors.map((author) => typeof author === "string" && (author === data.author || rawAuthors.length === 1) ? {name:author,id:data.authorId,profile:data.authorProfile} : author) : text(data.author).length > 0 || text(data.authorId).length > 0 ? [{name:data.author,id:data.authorId,profile:data.authorProfile}] : [];
    const authors: AuthorRef[] = await Promise.all(authorInputs.map(async (input) => {
      const old = typeof input === "string" ? {name:input} : object(input);
      const rawId = text(old.id);
      const name = text(old.name, rawId.replace(/\.[a-z0-9]+$/i,""));
      const id = parseAuthorId(normalizeId(rawId.replace(/\.(svg|png|jpe?g|webp|avif)$/i,"") || name));
      if (id === null) throw new Error(`Invalid author identity: ${rawId || name}`);
      const known = allAuthors().find((author) => author.id === id);
      const profile = text(old.profile, text(old.authorProfile));
      const avatar = old.avatar !== undefined ? old.avatar as ImageAsset : profile.length > 0 ? await image(profile, name) : known !== undefined ? known.avatar : rawId.length > 0 ? await image(`${BUCKET_ORIGIN}/blog/author/${rawId}`, name) : undefined;
      return {id, name:name || known?.name || id, ...(avatar === undefined ? {} : {avatar})};
    }));
    let markdown = document?.content ?? (Array.isArray(content) ? strings(content).join("\n") : text(content));
    if (markdown.length > 0) {
      const migrated = migrateDocument(markdown, { legacyMarks: true });
      for (const issue of migrated.issues) issues.push({ key, message: issue.message, blocking: true });
      markdown = migrated.markdown;
      const parsed = await parseDocument(markdown, { idNamespace: slug });
      const collect = async (node:Root|RootContent):Promise<void> => {
        if(node.type === "element" && node.tagName === "img" && typeof node.properties.src === "string" && !images.some((asset) => asset.src === node.properties.src)) images.push(await image(node.properties.src,typeof node.properties.alt === "string" ? node.properties.alt : ""));
        if("children" in node) for(const child of node.children) await collect(child);
      };
      await collect(parsed.document as Root);
      for (const issue of parsed.issues) if (issue.severity === "error") issues.push({ key, message: issue.message, blocking: true });
    }
    const links: ProjectLink[] = Object.entries(section !== "projects" || data.links === undefined ? {} : object(data.links)).map(([label,value]) => {
      const raw = text(value).trim();
      if (label === "github" && !/^https?:\/\//.test(raw)) {
        if (!/^[a-z0-9_.-]+\/[a-z0-9_.-]+$/i.test(raw) || raw.split("/").some((part) => part === "." || part === "..")) throw new Error(`Invalid GitHub repository shorthand: ${raw}`);
        return {label, url:`https://github.com/${raw}`, kind:"source"};
      }
      if (label === "zimo-blog" && !/^https?:\/\//.test(raw)) return {label, url:`/blog/${requireSlug(raw)}`, kind:"article"};
      return { label, url:raw, kind: label === "download" ? "download" : label === "zimo-blog" ? "article" : /github\.com|gitlab\.com/.test(raw) ? "source" : /apps\.apple\.com/.test(raw) ? "store" : "other" };
    });
    const extras = section === "projects" ? { section, links, icon: await image(`${BUCKET_ORIGIN}/projects/favicon/${slug}.${text(data.faviconFormat,"png")}`, `${text(data.title)} icon`) } : section === "album" ? { section, ...(data.location === undefined ? {} : { place: data.location }), ...(data.instagramLink === undefined ? {} : { instagramUrl: data.instagramLink }) } : { section };
    const edited = [data.updatedAt,data.lastEditedDate].find((value) => value !== undefined && text(value).trim().length > 0);
    const displayCover = data.displayCover ?? oldCover?.displayAtBeginning;
    const entry: StoredEntry = parseStoredEntry({ section, slug, title: migrateInlineMarks(text(data.title,slug)).markdown, description: migrateInlineMarks(text(data.description)).markdown, publishedAt: instant(data.publishedAt ?? data.date), ...(edited === undefined ? {} : { updatedAt: instant(edited) }), tags: strings(data.tags), unlisted: data.unlisted === true, authors, images, extras, ...(cover === undefined ? {} : { cover }), ...(displayCover === undefined ? {} : {displayCover}), ...(section === "projects" ? { markdown } : {}) });
    if (document !== null) {
      return { outputs: [{ key: target, body: matter.stringify(markdown, { ...entry, formatVersion: 2 }) }, { key: target.replace(/\.md$/,".meta.json"), body: json({ ...entry, schema: 2 }) }], issues };
    }
    return { outputs: [{ key: target, body: json({ ...entry, schema: 2 }) }], issues };
  }
  if (key.endsWith(".json") && (key.includes("/comments/") || key === "home/messages.json" || key === "about/homepage/messages.json")) {
    const parsed: unknown = JSON.parse(body);
    const wrapped = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? object(parsed) : null;
    const records = Array.isArray(parsed) ? parsed : wrapped?.schema !== 2 && Array.isArray(wrapped?.comments) && wrapped.comments.some((value) => typeof value === "object" && value !== null && ("author" in value || "date" in value || "content" in value)) ? wrapped.comments : null;
    if (records === null) { parseCommentThread(parsed); return { outputs: target === key ? [] : [{ key: target, body }], issues }; }
    const comments = records.map((value,commentIndex) => {
      const old = object(value);
      const replies = Array.isArray(old.replies) ? old.replies.map(object) : [];
      const replyIds = replies.map((reply,index) => stableId(instant(reply.date),`${commentIndex}:reply:${index}`));
      return { id: stableId(instant(old.date),`${commentIndex}:comment`), authorSub: text(old.author), body: migrateInlineMarks(text(old.content)).markdown, createdAt: instant(old.date), likedBy: strings(old.likedBy), replies: replies.map((reply,index) => { const to = replies.findIndex((candidate) => text(candidate.from) === text(reply.to)); return { id: replyIds[index], authorSub: text(reply.from), body: migrateInlineMarks(text(reply.content)).markdown, createdAt: instant(reply.date), ...(to < 0 || text(reply.to).length === 0 ? {} : { toId: replyIds[to] }) }; }) };
    });
    return { outputs: [{ key: target, body: json({ schema: 2, ...parseCommentThread({comments}) }) }], issues };
  }
  if (key.includes("/likedBy/") || key.includes("/reactions/")) {
    const parsed: unknown = JSON.parse(body);
    if(!Array.isArray(parsed)) parseReactionSet(parsed);
    return { outputs: Array.isArray(parsed) ? [{ key: target, body: json({ schema: 2, likedBy: strings(parsed) }) }] : target === key ? [] : [{ key: target, body }], issues };
  }
  if (key.startsWith("account/users/") && key.endsWith(".json")) {
    const old = object(JSON.parse(body));
    if (old.createdAt !== undefined && old.updatedAt !== undefined) { parseStoredUser(old); return { outputs: [], issues }; }
    const now = new Date(0).toISOString();
    const user = parseStoredUser({ ...old, createdAt: now, updatedAt: now, syncedWorkspace: migrateWorkspace(old.websiteSettings, (at,index) => stableId(at,`page:${index}`)), syncedTheme: migrateThemePreferences(old.websiteSettings), websiteSettings: old.websiteSettings === null || old.websiteSettings === undefined ? null : migrateSettings(old.websiteSettings,1) });
    return { outputs: [{ key: target, body: json(user) }], issues };
  }
  if (target === "about/intro.json") {
    const value = object(JSON.parse(body));
    if(value.schema === 2 && target === key) return { outputs:[], issues };
    const next = json({ ...value, schema:2, intro: strings(value.intro).map((paragraph) => migrateInlineMarks(paragraph).markdown) });
    return { outputs: next === body && target === key ? [] : [{key:target,body:next}], issues };
  }
  if (target === "home/slide.json") {
    const value = object(JSON.parse(body));
    if(value.schema === 2 && target === key) return { outputs:[], issues };
    const featured = Array.isArray(value.featured) ? value.featured.map((item) => { const entry = object(item); return { ...entry, section: entry.section === "photos" ? "album" : entry.section ?? "blog" }; }) : [];
    const next = json({ ...value, schema:2, featured });
    return { outputs: next === body && target === key ? [] : [{key:target,body:next}], issues };
  }
  if (key === "special/christmas/tree.json") {
    const parsed: unknown = JSON.parse(body);
    const wrapped = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? object(parsed) : null;
    const records = Array.isArray(parsed) ? parsed : Array.isArray(wrapped?.treeContent) ? wrapped.treeContent : null;
    if (records === null) { parseTreeBoard(parsed); return { outputs: [], issues }; }
    return { outputs: [{ key, body: json(parseTreeBoard({ messages: records.map((entry,index) => { const old = object(entry); return { id: text(old.uniqueId) || stableId(instant(old.date),`tree:${index}`), from: text(old.from), message: text(old.message), position: old.position, sprite: text(old.sprite), createdAt: instant(old.date), isPublic: old.isPublic === true, neverShowSpoilerWarning: old.neverShowSpoilerWarning === true }; }) })) }], issues };
  }
  return { outputs: target === key ? [] : [{ key: target, body }], issues };
}
