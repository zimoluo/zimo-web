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
    <title>Blog | Zimo Web</title>
    <link>${channelLink}</link>
    <description>Blog articles from Zimo Web.</description>
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
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const description = restoreDisplayText(post.description || "");
  const enclosureUrl = post.compatibleCover || post.coverImage;
  const enclosure =
    enclosureUrl &&
    `<enclosure url="${enclosureUrl}" type="${getMimeType(enclosureUrl)}" />`;

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${postUrl}</guid>
      <author>${escapeXml(post.author)}</author>
      ${enclosure || ""}
    </item>
  `;
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
