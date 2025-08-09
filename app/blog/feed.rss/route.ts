import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { baseUrl } from "@/lib/constants/navigationFinder";

const RSS_ITEMS_LIMIT: number | false = false;

export async function GET() {
  const allPosts = (await fetchAllEntries("blog/text", "markdown", [
    "title",
    "date",
    "author",
    "slug",
    "coverImage",
    "description",
    "compatibleCover",
    "lastEditedDate",
    "unlisted",
  ])) as PostEntry[];

  const filteredPosts = allPosts.filter((post) => !(post as any).unlisted);
  const feedPosts =
    RSS_ITEMS_LIMIT === false
      ? filteredPosts
      : filteredPosts.slice(0, RSS_ITEMS_LIMIT);

  const channelLink = new URL("blog", baseUrl).toString();

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${sanitizeXmlText("Blog | Zimo Web")}</title>
    <link>${sanitizeXmlText(channelLink)}</link>
    <description>${sanitizeXmlText(
      "Blog articles from Zimo Web."
    )}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${feedPosts.map((post) => createItem(post)).join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}

function createItem(post: PostEntry): string {
  const postUrl = new URL(
    encodeURIComponent(post.slug),
    new URL("blog/", baseUrl)
  ).toString();

  const description = restoreDisplayText(post.description || "");

  const enclosureRaw = post.compatibleCover || post.coverImage;
  const enclosureResolved = enclosureRaw
    ? new URL(enclosureRaw, baseUrl).toString()
    : undefined;

  const enclosure =
    enclosureResolved &&
    `<enclosure url="${sanitizeXmlAttr(
      enclosureResolved
    )}" type="${sanitizeXmlAttr(getMimeType(enclosureResolved))}" />`;

  return `
    <item>
      <title>${sanitizeXmlText(post.title || "")}</title>
      <link>${sanitizeXmlText(postUrl)}</link>
      <description>${sanitizeXmlText(description)}</description>
      <pubDate>${safeRfc2822Date(post.lastEditedDate || post.date)}</pubDate>
      <guid>${sanitizeXmlText(postUrl)}</guid>
      <author>${sanitizeXmlText(post.author || "")}</author>
      ${enclosure || ""}
    </item>
  `;
}

function sanitizeXmlText(value: string): string {
  return escapeXml(removeInvalidXmlChars(value));
}

function sanitizeXmlAttr(value: string): string {
  return escapeXml(removeInvalidXmlChars(value));
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function removeInvalidXmlChars(input: string): string {
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function safeRfc2822Date(input?: string): string {
  const d = input ? new Date(input) : undefined;
  return d && !isNaN(d.getTime()) ? d.toUTCString() : new Date().toUTCString();
}

function getMimeType(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

export const dynamic = "force-static";
export const revalidate = 3600;
