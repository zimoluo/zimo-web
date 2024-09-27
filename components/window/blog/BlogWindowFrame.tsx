"use client";

import { useRef, useState } from "react";
import BlogWindowMenu from "./BlogWindowMenu";
import BlogWindowLoader from "./BlogWindowLoader";
import ExpandMenuButton from "@/components/widgets/ExpandMenuButton";
import { BlogWindowProvider } from "@/components/contexts/BlogWindowContext";
import BlogWindowMenuWrapper from "./BlogWindowMenuWrapper";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";

interface Props {
  presetSlug?: string;
}

export default function BlogWindowFrame({ presetSlug = "" }: Props) {
  const [slug, setSlug] = useState<string>(presetSlug);
  const [isMenuOpen, setIsMenuOpen] = useState(!presetSlug);

  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <BlogWindowProvider {...{ slug, setSlug, isMenuOpen, setIsMenuOpen }}>
      <FilterSearchProvider>
        <BlogWindowMenuWrapper menuRef={menuRef}>
          <BlogWindowMenu isMainPage={!slug} />
        </BlogWindowMenuWrapper>
        <div
          className={`absolute z-10 top-4 left-4 h-6 w-6 transition-opacity duration-300 delay-200 ease-out ${
            slug ? "opacity-100" : "opacity-0 pointer-events-none select-none"
          }`}
          ref={menuRef}
        >
          <ExpandMenuButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
        {slug && <BlogWindowLoader slug={slug} />}
      </FilterSearchProvider>
    </BlogWindowProvider>
  );
}
