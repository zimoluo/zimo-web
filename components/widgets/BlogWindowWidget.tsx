"use client";

import BlogReader from "@/app/blog/[slug]/BlogReader";
import { getCoverSrc } from "@/lib/blog/helper";
import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export default function BlogWindowWidget({ slug }: Props) {
  const [post, setPost] = useState<PostEntry | null>(null);

  const readEntry = async () => {
    const entry = (await readEntryOnClient(slug, "blog/text", "markdown", [
      "title",
      "date",
      "slug",
      "author",
      "content",
      "coverImage",
      "description",
      "authorId",
      "displayCover",
      "tags",
      "lastEditedDate",
      "compatibleCover",
      "unlisted",
    ])) as PostEntry;

    setPost({
      ...entry,
      coverImage: getCoverSrc(entry.coverImage, entry.slug) || "data:null;,",
      slug,
    });
  };

  useEffect(() => {
    readEntry();
  }, []);

  if (!post) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <BlogReader {...post} />
    </div>
  );
}
