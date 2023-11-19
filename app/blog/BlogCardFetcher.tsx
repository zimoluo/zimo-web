import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";
import BlogCard from "./BlogCard";

interface Props {
  slug: string;
}

export default async function BlogCardFetcher({ slug }: Props) {
  const blogData = (await fetchEntryBySlug(slug, "blog/text", "markdown", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "tags",
  ])) as PostData;

  return <BlogCard {...blogData} />;
}
