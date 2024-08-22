"use client";

import { Suspense } from "react";
import SearchBar from "./SearchBar";
import { useSearchParams } from "next/navigation";

interface Props {
  promptKeyword?: string;
}

export default function SearchBarUrlParameter({
  promptKeyword = "blog article",
}: Props) {
  const searchParams = useSearchParams();
  const paramKeyword = searchParams.get("keyword") ?? "";

  return (
    <Suspense>
      <SearchBar
        promptKeyword={promptKeyword}
        initialSearchValue={paramKeyword}
      />
    </Suspense>
  );
}
