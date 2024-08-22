"use client";

import { useEffect, useState } from "react";
import { useFilterSearch } from "../contexts/FilterSearchContext";
import SearchBarIcon from "../assets/entries/SearchBarIcon";

interface Props {
  promptKeyword?: string;
  initialSearchValue?: string;
}

export default function SearchBar({
  promptKeyword = "blog article",
  initialSearchValue = "",
}: Props) {
  const {
    shouldSearchBarUpdate,
    setShouldSearchBarUpdate,
    filterSearchContent,
    setFilterSearchContent,
  } = useFilterSearch();
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  useEffect(() => {
    if (initialSearchValue === "") {
      return;
    }
    setSearchValue(initialSearchValue.trim());
    confirmSearch();
  }, [initialSearchValue]);

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
        className="w-full py-2 pl-3 pr-10 border rounded-full overflow-hidden bg-transparent bg-widget-70 backdrop-blur-lg border-soft border-opacity-75 shadow-lg placeholder:text-saturated placeholder:text-opacity-70"
      />
      <button className="absolute right-0.5 p-2.5" onClick={confirmSearch}>
        <SearchBarIcon className="h-5 w-auto aspect-square transition-transform duration-300 ease-in-out hover:scale-110" />
      </button>
    </div>
  );
}
