"use client";

import { ReactNode, useEffect, useState } from "react";
import SearchBar from "@/components/widgets/SearchBar";
import { readAllEntriesOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import SearchCardColumn from "@/components/widgets/SearchCardColumn";
import ProjectsWindowCard from "./ProjectsWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function ProjectsWindowMenu({ isMainPage = false }: Props) {
  const [entries, setEntries] = useState<ReactNode[] | null>(null);
  const [keywords, setKeywords] = useState<FilterSearchKeyword[] | null>(null);

  const readEntries = async () => {
    const entries = (await readAllEntriesOnClient("projects/entries", "json", [
      "title",
      "slug",
      "description",
      "links",
      "date",
      "authors",
      "faviconFormat",
      "content",
      "images",
      "unlisted",
    ])) as ProjectsEntry[];

    const filteredEntries = entries.filter((entry) => !(entry as any).unlisted);

    const entryKeywords: FilterSearchKeyword[] = filteredEntries.map(
      (post) => ({
        title: post.title,
        authors: post.authors,
      })
    );

    const blogCards = filteredEntries.map((entry) => (
      <ProjectsWindowCard {...entry} key={entry.slug} />
    ));

    setEntries(blogCards);
    setKeywords(entryKeywords);
  };

  useEffect(() => {
    readEntries();
  }, []);

  if (!entries || !keywords) {
    return <LoadingScreen className="bg-widget-90" />;
  }

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-full h-full px-7 pt-14 pb-6 overflow-y-auto">
        {isMainPage && (
          <h2 className="text-center -mt-3 mb-7 text-2xl font-bold">
            Projects Entries
          </h2>
        )}
        <nav className="mb-8 flex items-center md:justify-end">
          <div className="w-full">
            <SearchBar promptKeyword="album post" />
          </div>
        </nav>
        <SearchCardColumn
          keywords={keywords}
          components={entries}
          cardHeight="9rem"
        />
      </div>
    </div>
  );
}
