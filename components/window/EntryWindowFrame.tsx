"use client";

import { useRef, useState } from "react";
import ExpandMenuButton from "@/components/widgets/ExpandMenuButton";
import { FilterSearchProvider } from "@/components/contexts/FilterSearchContext";
import { EntryWindowProvider } from "@/components/contexts/EntryWindowContext";
import WindowSlideMenuWrapper from "./WindowSlideMenuWrapper";

interface Props {
  presetSlug?: string;
  MenuComponent: React.ComponentType<{ isMainPage: boolean }>;
  LoaderComponent: React.ComponentType<{ slug: string }>;
  direction?: "left" | "right";
}

export default function EntryWindowFrame({
  presetSlug = "",
  MenuComponent,
  LoaderComponent,
  direction = "left",
}: Props) {
  const [slug, setSlug] = useState<string>(presetSlug);
  const [isMenuOpen, setIsMenuOpen] = useState(!presetSlug);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const buttonPosition = direction === "left" ? "left-4" : "right-4";

  return (
    <EntryWindowProvider {...{ slug, setSlug, isMenuOpen, setIsMenuOpen }}>
      <FilterSearchProvider>
        <WindowSlideMenuWrapper
          direction={direction}
          menuButtonRef={menuButtonRef}
          className="z-10"
        >
          <MenuComponent isMainPage={!slug} />
        </WindowSlideMenuWrapper>
        <div
          className={`absolute z-10 top-4 ${buttonPosition} h-6 w-6 flex items-center justify-center transition-opacity duration-300 delay-200 ease-out ${
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
        {slug && <LoaderComponent slug={slug} />}
      </FilterSearchProvider>
    </EntryWindowProvider>
  );
}
