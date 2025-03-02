"use client";

import { ReactNode, useEffect, useState } from "react";
import SearchBar from "@/components/widgets/SearchBar";
import { readAllEntriesOnClient } from "@/lib/dataLayer/client/clientEntryReader";
import LoadingScreen from "@/components/widgets/LoadingScreen";
import SearchCardColumn from "@/components/widgets/SearchCardColumn";

interface Props<T> {
  isMainPage?: boolean;
  title: string;
  entryType: string;
  entryFormat: "json" | "markdown";
  fields: string[];
  filterUnlisted?: boolean;
  createKeywords: (entry: T) => FilterSearchKeyword;
  createCard: (entry: T) => ReactNode;
  searchPromptKeyword?: string;
}

export default function EntryWindowMenu<
  T extends { unlisted?: boolean; slug: string }
>({
  isMainPage = false,
  title,
  entryType,
  entryFormat,
  fields,
  filterUnlisted = true,
  createKeywords,
  createCard,
  searchPromptKeyword,
}: Props<T>) {
  const [entries, setEntries] = useState<ReactNode[] | null>(null);
  const [keywords, setKeywords] = useState<FilterSearchKeyword[] | null>(null);

  const readEntries = async () => {
    const entries = (await readAllEntriesOnClient(
      entryType,
      entryFormat,
      fields
    )) as T[];

    const filteredEntries = filterUnlisted
      ? entries.filter((entry) => !entry.unlisted)
      : entries;

    const entryKeywords: FilterSearchKeyword[] =
      filteredEntries.map(createKeywords);

    const entryCards = filteredEntries.map((entry) => createCard(entry));

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
          <h2 className="text-center -mt-3 mb-7 text-2xl font-bold">{title}</h2>
        )}
        <nav className="mb-8 flex items-center md:justify-end">
          <div className="w-full">
            <SearchBar promptKeyword={searchPromptKeyword} />
          </div>
        </nav>
        <SearchCardColumn keywords={keywords} components={entries} />
      </div>
    </div>
  );
}
