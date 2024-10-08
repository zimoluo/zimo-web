import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import BlogCard from "./BlogCard";

interface Props {
  slug: string;
  showTags?: boolean;
}

export default async function BlogCardFetcher({
  slug,
  showTags = false,
}: Props) {
  const blogData = (await fetchEntryBySlug(slug, "blog/text", "markdown", [
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
  ])) as PostData;

  return <BlogCard {...blogData} showTags={showTags} />;
}
