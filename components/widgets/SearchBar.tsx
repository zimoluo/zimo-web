"use client";

import { useEffect, useState } from "react";
import { useFilterSearch } from "../contexts/FilterSearchContext";
import SearchBarIcon from "../assets/entries/SearchBarIcon";

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
      return;
    }

    setFilterSearchContent(event.target.value.trim());
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        placeholder={`Search ${promptKeyword}...`}
        className="w-full py-2 pl-3 pr-10 border rounded-full overflow-hidden bg-transparent bg-widget-70 backdrop-blur-lg border-saturated border-opacity-70 shadow-lg placeholder:text-saturated placeholder:text-opacity-70"
      />
      <div className="absolute right-0.5 p-2.5">
        <SearchBarIcon className="h-5 w-auto aspect-square" />
      </div>
    </div>
  );
}
