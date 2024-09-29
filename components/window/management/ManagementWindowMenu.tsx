"use client";

import { ReactNode, useEffect, useState } from "react";
import SearchBar from "@/components/widgets/SearchBar";
import { readAllEntriesOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import SearchCardColumn from "@/components/widgets/SearchCardColumn";
import ManagementWindowCard from "./ManagementWindowCard";

interface Props {
  isMainPage?: boolean;
}

export default function ManagementWindowMenu({ isMainPage = false }: Props) {
  const [entries, setEntries] = useState<ReactNode[] | null>(null);
  const [keywords, setKeywords] = useState<FilterSearchKeyword[] | null>(null);

  const readEntries = async () => {
    const entries = (await readAllEntriesOnClient("about/text", "markdown", [
      "title",
      "date",
      "slug",
      "content",
      "description",
      "unlisted",
    ])) as PostEntry[];

    const filteredEntries = entries.filter((entry) => !(entry as any).unlisted);

    const entryKeywords: FilterSearchKeyword[] = filteredEntries.map(
      (post) => ({
        title: post.title,
        description: post.description,
      })
    );

    const entryCards = filteredEntries.map((entry) => (
      <ManagementWindowCard {...entry} key={entry.slug} />
    ));

    setEntries(entryCards);
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
            Management Articles
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
          cardHeight="12rem"
        />
      </div>
    </div>
  );
}
