import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { baseUrl } from "@/lib/constants/navigationFinder";

export async function GET() {
  const allPosts = (await fetchAllEntries("blog/text", "markdown", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "lastEditedDate",
    "tags",
    "unlisted",
  ])) as PostEntry[];

  const filteredPosts = allPosts.filter((post) => !(post as any).unlisted);

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Blog | Zimo Web</title>
    <link>${baseUrl}</link>
    <description>Blog articles from Zimo Web.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${filteredPosts
      .map(
        (post) => `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${baseUrl}/blog/${post.slug}</link>
        <description>${escapeXml(
          restoreDisplayText(post.description || "")
        )}</description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <guid>${baseUrl}/blog/${post.slug}</guid>
      </item>
    `
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
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

export const dynamic = "force-static";
export const revalidate = 3600;
