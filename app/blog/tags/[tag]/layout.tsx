import ArticleListLayout from "@/components/widgets/ArticleListLayout";
import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";
import { ReactNode } from "react";
import BlogCard from "../../BlogCard";

interface Props {
  params: { tag: string };
  children?: ReactNode;
}

export async function generateStaticParams() {
  const allPosts = await fetchAllEntries("blog/text", "markdown", [
    "unlisted",
    "tags",
  ]);

  const filteredPosts = allPosts.filter((post) => !post.unlisted);

  let uniqueTags: Set<string> = new Set();
  filteredPosts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => uniqueTags.add(tag));
    }
  });

  const uniqueTagsArray = Array.from(uniqueTags);

  return uniqueTagsArray.map((tag) => {
    return {
      tag: tag as string,
    };
  });
}

export default async function BlogTagLayout({ params, children }: Props) {
  const { tag } = params;

  const decodedTag = decodeURIComponent(tag);

  const allPosts = await fetchAllEntries("blog/text", "markdown", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "coverImage",
    "description",
    "authorId",
    "unlisted",
    "tags",
  ]);

  const filteredPosts = allPosts.filter(
    (post) => post.tags?.includes(decodedTag) && !post.unlisted
  );

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
    />
  ));

  return (
    <ArticleListLayout
      title={decodedTag}
      subtitle={`Topic  ·  ${allPosts.length} article${
        allPosts.length === 1 ? "" : "s"
      }`}
      components={blogCards}
      keywords={postKeywords}
      searchBarPromptKeyword="topic article"
    />
  );
}

export const revalidate = 24;
