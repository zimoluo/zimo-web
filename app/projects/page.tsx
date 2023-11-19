import ReadingLayout from "@/components/widgets/ReadingLayout";
import WindowDisplay from "@/components/widgets/WindowDisplay";
import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import ManagementHeader from "../management/[slug]/ManagementHeader";
import ReadingContentProcessor from "@/components/widgets/ReadingContentProcessor";
import parseCustomMarkdown from "@/lib/markdownParser";

export default async function Home() {
  const post = (await fetchEntryBySlug(
    "understanding-website-settings",
    "about/text",
    "markdown",
    ["title", "date", "slug", "content", "description"]
  )) as ArticleCardDisplay & { content: string; slug: string };

  return (
    <div className="w-screen h-screen">
      <WindowDisplay
        imageData={{
          url: [
            "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/posts/spooky-halloween-update/images/bg-2.svg",
          ],
          aspectRatio: "3:4",
          text: ["test"],
        }}
        display={
          <>
            <ManagementHeader {...post} />
            <div className="my-10 border-saturated border-t opacity-50" />
            <ReadingContentProcessor>
              {parseCustomMarkdown(post.content)}
            </ReadingContentProcessor>
          </>
        }
      />
    </div>
  );
}
