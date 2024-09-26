"use client";

import { ReactNode, useEffect, useState } from "react";
import { FilterSearchProvider } from "../contexts/FilterSearchContext";
import blogWindowStyle from "./blog-window.module.css";
import SearchBar from "./SearchBar";
import { readAllEntriesOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "./LoadingScreen";
import SearchCardColumn from "./SearchCardColumn";
import BlogWindowCard from "./BlogWindowCard";

interface Props {
  hasTitle?: boolean;
}

export default function BlogWindowMenu({ hasTitle = false }: Props) {
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
    <FilterSearchProvider>
      <div className="w-full h-full flex justify-center items-start">
        <div
          className={`w-full h-full p-8 overflow-y-auto ${blogWindowStyle.menuEntry}`}
        >
          <nav className="mb-8 flex items-center md:justify-end">
            <div className={`w-full ${blogWindowStyle.menuEntry}`}>
              <SearchBar />
            </div>
          </nav>
          <SearchCardColumn keywords={keywords} components={entries} />
        </div>
      </div>
    </FilterSearchProvider>
  );
}
