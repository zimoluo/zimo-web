import SearchCardColumn from "@/components/widgets/SearchCardColumn";
import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import BlogCard from "./BlogCard";

export default async function BlogEntries() {
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

  const postKeywords: FilterSearchKeyword[] = filteredPosts.map((post) => ({
    title: post.title,
    description: post.description,
    tags: post.tags,
    authors: [post.author],
  }));

  const blogCards = filteredPosts.map((post) => (
    <BlogCard {...post} key={post.slug} showTags={true} />
  ));

  return <SearchCardColumn keywords={postKeywords} components={blogCards} />;
}
