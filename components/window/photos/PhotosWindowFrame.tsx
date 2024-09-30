"use client";

import { useRef, useState } from "react";
import ExpandMenuButton from "@/components/widgets/ExpandMenuButton";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import { EntryWindowProvider } from "@/components/contexts/EntryWindowContext";
import WindowSlideMenuWrapper from "../WindowSlideMenuWrapper";
import PhotosWindowMenu from "./PhotosWindowMenu";

interface Props {
  presetSlug?: string;
}

export default function PhotosWindowFrame({ presetSlug = "1" }: Props) {
  const [slug, setSlug] = useState<string>(presetSlug);
  const [isMenuOpen, setIsMenuOpen] = useState(!presetSlug);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <EntryWindowProvider {...{ slug, setSlug, isMenuOpen, setIsMenuOpen }}>
      <FilterSearchProvider>
        <WindowSlideMenuWrapper direction="right" menuButtonRef={menuButtonRef}>
          <PhotosWindowMenu isMainPage={!slug} />
        </WindowSlideMenuWrapper>
        <div
          className={`absolute z-10 top-4 right-4 h-6 w-6 flex items-center justify-center transition-opacity duration-300 delay-200 ease-out ${
            slug ? "opacity-100" : "opacity-0 pointer-events-none select-none"
          }`}
        >
          <ExpandMenuButton
            className="relative"
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            buttonRef={menuButtonRef}
          />
        </div>
      </FilterSearchProvider>
    </EntryWindowProvider>
  );
}
