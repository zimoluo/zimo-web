"use client";

import { useEffect, useState } from "react";
import { useFilterSearch } from "../contexts/FilterSearchContext";
import SearchBarIcon from "../images/entries/SearchBarIcon";

interface Props {
  promptKeyword?: string;
}

export default function SearchBar({ promptKeyword = "blog article" }: Props) {
  const {
    shouldSearchBarUpdate,
    setShouldSearchBarUpdate,
    filterSearchContent,
    setFilterSearchContent,
  } = useFilterSearch();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (shouldSearchBarUpdate) {
      setSearchValue(filterSearchContent);
      setShouldSearchBarUpdate(false);
    }
  }, [shouldSearchBarUpdate]);

  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
    if (!event.target.value.trim()) {
      setSearchValue("");
      setFilterSearchContent("");
    }
  };

  const confirmSearch = () => {
    setFilterSearchContent(searchValue.trim());
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      confirmSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={`Search ${promptKeyword}...`}
        className={`w-full py-2 px-3 border rounded-full overflow-hidden bg-widget-60 backdrop-blur-lg border-soft border-opacity-75 border-menu-entry shadow-lg placeholder:text-saturated placeholder:text-opacity-70`}
      />
      <button className="absolute right-3" onClick={confirmSearch}>
        <SearchBarIcon className="h-5 w-auto aspect-square" />
      </button>
    </div>
  );
}
