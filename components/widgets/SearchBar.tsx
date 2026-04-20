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

  const isSearchValueEmpty = !searchValue.trim();

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
      <div className="relative w-full rounded-full bg-light/65 backdrop-blur-sm shadow-lg border-reflect-light">
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder={`Search ${promptKeyword}...`}
          className="w-full py-2 pl-3 pr-9 rounded-full overflow-hidden bg-none bg-transparent placeholder:text-saturated placeholder:text-opacity-70"
        />
      </div>
      <div
        className={`absolute right-0 p-2.5 ${isSearchValueEmpty ? "pointer-events-none select-none" : ""}`}
      >
        <SearchBarIcon
          className={`h-5 w-5 aspect-square relative ${
            isSearchValueEmpty
              ? "opacity-100 scale-100"
              : "opacity-0 scale-50 blur-[4px]"
          } transition-[opacity,transform,filter] duration-200 ease-out`}
        />
        <button
          className="w-6 h-6 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={() => {
            setSearchValue("");
            setFilterSearchContent("");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
            className={`transition-[opacity,transform,filter] duration-200 ease-out ${
              isSearchValueEmpty
                ? "opacity-0 scale-50 blur-[4px]"
                : "opacity-100 scale-100"
            }`}
          >
            <path
              d="M400 800c220.914 0 400-179.086 400-400S620.914 0 400 0 0 179.086 0 400s179.086 400 400 400Zm113.282-574.533c17.085-17.085 44.787-17.085 61.872 0 17.085 17.086 17.085 44.787 0 61.872L462.183 400.311l112.97 112.971c17.086 17.086 17.086 44.787 0 61.872-17.084 17.086-44.786 17.086-61.87 0L400.31 462.183l-112.972 112.97c-17.085 17.086-44.786 17.086-61.872 0-17.085-17.084-17.085-44.786 0-61.87L338.44 400.31 225.467 287.34c-17.085-17.086-17.085-44.787 0-61.872s44.787-17.086 61.872 0l112.972 112.971 112.971-112.972Z"
              style={{
                fillRule: "evenodd",
                strokeWidth: 0,
              }}
              transform="translate(112 112)"
              className="fill-saturated"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
