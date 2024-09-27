"use client";

import { ReactNode, useEffect, useState } from "react";
import SearchBar from "@/components/widgets/SearchBar";
import { readAllEntriesOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import SearchCardColumn from "@/components/widgets/SearchCardColumn";
import BlogWindowCard from "./BlogWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function BlogWindowMenu({ isMainPage = false }: Props) {
  const [entries, setEntries] = useState<ReactNode[] | null>(null);
  const [keywords, setKeywords] = useState<FilterSearchKeyword[] | null>(null);

  const readEntries = async () => {
    const entries = (await readAllEntriesOnClient("blog/text", "markdown", [
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

    const filteredEntries = entries.filter((entry) => !(entry as any).unlisted);

    const entryKeywords: FilterSearchKeyword[] = filteredEntries.map(
      (post) => ({
        title: post.title,
        description: post.description,
        tags: post.tags,
        authors: [post.author],
      })
    );

    const blogCards = filteredEntries.map((entry) => (
      <BlogWindowCard {...entry} key={entry.slug} showTags={true} />
    ));

    setEntries(blogCards);
    setKeywords(entryKeywords);
  };

  useEffect(() => {
    readEntries();
  }, []);

  if (!entries || !keywords) {
    return <LoadingScreen className="bg-widget-80" />;
  }

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full h-full px-7 pt-14 pb-6 overflow-y-auto">
        {isMainPage && (
          <h2 className="text-center -mt-3 mb-7 text-2xl font-bold">
            Blog Articles
          </h2>
        )}
        <nav className="mb-8 flex items-center md:justify-end">
          <div className="w-full">
            <SearchBar />
          </div>
        </nav>
        <SearchCardColumn
          keywords={keywords}
          components={entries}
          cardHeight="15rem"
        />
      </div>
    </div>
  );
}
