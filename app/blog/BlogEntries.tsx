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
    "tags",
    "unlisted",
  ])) as PostEntry[];

  const filteredPosts = allPosts.filter((post) => !(post as any).unlisted);

  const postKeywords = filteredPosts.map((post) => ({
    title: post.title,
    description: post.description,
    tags: post.tags,
  }));

  const blogCards = filteredPosts.map((post) => (
    <BlogCard
      key={post.slug}
      slug={post.slug}
      title={post.title}
      date={post.date}
      coverImage={post.coverImage}
      author={post.author}
      authorId={post.authorId}
      description={post.description}
      content={post.content}
      tags={post.tags}
      isWithinSearchContext={true}
    />
  ));

  return <SearchCardColumn keywords={postKeywords} components={blogCards} />;
}
