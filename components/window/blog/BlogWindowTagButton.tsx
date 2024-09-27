"use client";

import { useBlogWindow } from "@/components/contexts/BlogWindowContext";
import { useFilterSearch } from "@/components/contexts/FilterSearchContext";

interface Props {
  tag: string;
}

export default function BlogWindowTagButton({ tag }: Props) {
  const { setIsMenuOpen } = useBlogWindow();
  const { updateFilterSearchContent } = useFilterSearch();

  return (
    <button
      className="mr-1.5"
      onClick={() => {
        setIsMenuOpen(true);
        updateFilterSearchContent(`#${tag}`);
      }}
    >
      <span className="inline-block bg-saturated opacity-70 rounded-full px-2 my-0.5 py-0.5 text-sm font-bold text-light transition-transform duration-300 ease-in-out hover:scale-105 text-center">
        {tag}
      </span>
    </button>
  );
}
