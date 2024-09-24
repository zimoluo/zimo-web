"use client";

import ArticleCard from "./ArticleCard";
import { sectionDirectoryMap, sectionMethodMap } from "./ArticleCardFetcher";
import { useEffect, useState } from "react";
import { readEntryOnClient } from "@/lib/dataLayer/client/clientEntryReader";

export default function ArticleCardClientReader({
  section,
  slug,
  omitSectionType = false,
  useCalendarDate = false,
  className = "",
}: ArticleCardData & { className?: string }) {
  const [entry, setEntry] = useState<
    (ArticleCardDisplay & { lastEditedDate?: string }) | null
  >(null);

  const fetchEntry = async () => {
    const entry = await readEntryOnClient(
      slug,
      sectionDirectoryMap[section],
      sectionMethodMap[section],
      ["title", "description", "date", "lastEditedDate"]
    );
    setEntry(entry as ArticleCardDisplay);
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  if (!entry) {
    return null;
  }

  return (
    <ArticleCard
      section={section}
      slug={slug}
      title={entry.title}
      description={entry.description || ""}
      date={entry.lastEditedDate || entry.date}
      omitSectionType={omitSectionType}
      useCalendarDate={useCalendarDate}
      className={className}
    />
  );
}
