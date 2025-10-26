"use client";

import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { ReactNode } from "react";
import { useFilterSearch } from "../contexts/FilterSearchContext";

interface Props {
  keywords: FilterSearchKeyword[];
  components: ReactNode[];
}

const processSearchContent = (searchContent: string) => {
  return searchContent
    .trim()
    .split(/[,;，；]+/)
    .map((term) => term.trim())
    .filter(Boolean);
};

const doesMatchListFilter = (list: string[], searchTerm: string) => {
  return list.some((member) =>
    member.toLowerCase().startsWith(searchTerm.toLowerCase())
  );
};

const doesMatchTextFilter = (text: string, searchTerm: string) => {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export default function SearchCardColumn({ keywords, components }: Props) {
  const { filterSearchContent } = useFilterSearch();

  const advancedFilter = (keywords: FilterSearchKeyword) => {
    if (!filterSearchContent.trim()) return true;

    const searchTerms = processSearchContent(filterSearchContent);

    return searchTerms.every((term) => {
      if (term.startsWith("#") && keywords.tags) {
        return doesMatchListFilter(keywords.tags || [], term.slice(1).trim());
      }

      if (term.startsWith(":") && keywords.authors) {
        return doesMatchListFilter(
          keywords.authors || [],
          term.slice(1).trim()
        );
      }

      return (
        doesMatchTextFilter(keywords.title, term) ||
        (keywords.description &&
          doesMatchTextFilter(restoreDisplayText(keywords.description), term))
      );
    });
  };

  const visibilityArray = keywords.map((keyword) => advancedFilter(keyword));

  return (
    <div className="grid grid-cols-1 gap-6">
      {components.map(
        (component, index) =>
          visibilityArray[index] && <div key={index}>{component}</div>
      )}
    </div>
  );
}
