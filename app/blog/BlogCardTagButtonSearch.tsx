"use client";

import { useFilterSearch } from "@/components/contexts/FilterSearchContext";
import BlogCardTagButtonRender from "./BlogCardTagButtonRender";

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
      <BlogCardTagButtonRender tag={tag} />
    </button>
  );
}
