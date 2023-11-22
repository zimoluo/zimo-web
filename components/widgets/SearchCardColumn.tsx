"use client";

import { restoreDisplayText } from "@/lib/lightMarkUpProcessor";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useFilterSearch } from "../contexts/FilterSearchContext";
import SearchCardWrapper from "./SearchCardWrapper";
import { useSettings } from "../contexts/SettingsContext";

type Props = {
  keywords: FilterSearchKeyword[];
  components: ReactNode[];
};

const INITIAL_DELAY = 0;
const INITIAL_INCREMENT = 160;
const MIN_DELAY = 80;
const decayRate = 0.85;

const processSearchContent = (searchContent: string) => {
  return searchContent
    .trim()
    .split(/[,;，；]+/)
    .map((term) => term.trim())
    .filter(Boolean);
};

const doesMatchTagsFilter = (tags: string[], searchTag: string) => {
  return tags.some((tag) =>
    tag.toLowerCase().startsWith(searchTag.toLowerCase())
  );
};

const doesMatchTextFilter = (text: string, searchTerm: string) => {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

export default function SearchCardColumn({ keywords, components }: Props) {
  const { filterSearchContent } = useFilterSearch();
  const { settings } = useSettings();

  function usePrevious<T>(value: T): T {
    const ref = useRef<T>(value);
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }

  const advancedFilter = (keywords: FilterSearchKeyword) => {
    if (!filterSearchContent.trim()) return true;

    const searchTerms = processSearchContent(filterSearchContent);

    return searchTerms.every((term) => {
      if (term.startsWith("#") && keywords.tags) {
        return doesMatchTagsFilter(keywords.tags || [], term.slice(1));
      }

      return (
        doesMatchTextFilter(keywords.title, term) ||
        (keywords.description &&
          doesMatchTextFilter(restoreDisplayText(keywords.description), term))
      );
    });
  };

  const visibilityArray = keywords.map((keyword) => advancedFilter(keyword));

  const prevVisibilityArray = usePrevious(visibilityArray);

  const timeoutArray = useMemo(() => {
    const arrayLength = visibilityArray.length;
    const timeouts = new Array(arrayLength).fill(0);

    const calculateDelay = (currentDelay: number, decrement: number) => {
      const delay = currentDelay;
      const newDecrement = Math.max(MIN_DELAY, decrement * decayRate);
      const newDelay = currentDelay + newDecrement;
      return [delay, newDelay, newDecrement];
    };

    let currentDelayForVisible = INITIAL_DELAY;
    let currentDelayForNotVisible = INITIAL_DELAY;
    let decrementForVisible = INITIAL_INCREMENT * decayRate;
    let decrementForNotVisible = INITIAL_INCREMENT * decayRate;

    visibilityArray.forEach((isVisible, index) => {
      if (isVisible === prevVisibilityArray[index]) {
        [timeouts[index], currentDelayForVisible, decrementForVisible] =
          calculateDelay(currentDelayForVisible, decrementForVisible);
        currentDelayForNotVisible = INITIAL_DELAY;
        decrementForNotVisible = INITIAL_INCREMENT - decayRate;
      } else {
        [timeouts[index], currentDelayForNotVisible, decrementForNotVisible] =
          calculateDelay(currentDelayForNotVisible, decrementForNotVisible);
        currentDelayForVisible = INITIAL_DELAY;
        decrementForVisible = INITIAL_INCREMENT - decayRate;
      }
    });

    return timeouts;
  }, [visibilityArray]);

  return (
    <div className="grid grid-cols-1">
      {components.map((component, index) => (
        <SearchCardWrapper
          key={index}
          isVisible={visibilityArray[index]}
          timeout={
            settings.instantSearchResult
              ? new Array(visibilityArray.length).fill(0)
              : timeoutArray[index]
          }
          duration={
            settings.instantSearchResult
              ? 0
              : Math.min(
                  280,
                  2800 /
                    visibilityArray.filter(
                      (val, i) => val !== prevVisibilityArray[i]
                    ).length
                )
          }
        >
          {component}
        </SearchCardWrapper>
      ))}
    </div>
  );
}
