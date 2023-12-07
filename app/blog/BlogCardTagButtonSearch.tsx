"use client";

import { useFilterSearch } from "@/components/contexts/FilterSearchContext";

interface Props {
  tag: string;
}

export default function BlogCardTagButtonSearch({ tag }: Props) {
  const { updateFilterSearchContent } = useFilterSearch();
  return (
    <button
      className="mr-1.5"
      onClick={(e) => {
        e.preventDefault();
        updateFilterSearchContent(`#${tag}`);
      }}
    >
      <span className="inline-block bg-saturated rounded-full px-2 py-0.25 md:py-0.5 text-xs md:text-sm font-bold text-light transition-transform duration-300 ease-in-out hover:scale-105 text-center">
        {tag}
      </span>
    </button>
  );
}
