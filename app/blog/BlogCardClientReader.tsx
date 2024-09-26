import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";

interface Props {
  slug: string;
  showTags?: boolean;
}

export default function BlogCardClientReader({
  slug,
  showTags = false,
}: Props) {
  const [entry, setEntry] = useState<PostData | null>(null);

  const fetchEntry = async () => {
    const entry = await readEntryOnClient(slug, "blog/text", "markdown", [
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
    ]);
    setEntry(entry as PostData);
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  if (!entry) {
    return null;
  }

  return <BlogCard {...entry} showTags={showTags} />;
}
