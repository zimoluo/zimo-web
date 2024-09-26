"use client";

import { useRef, useState } from "react";
import BlogWindowMenu from "./BlogWindowMenu";
import BlogWindowLoader from "./BlogWindowLoader";
import ExpandMenuButton from "./ExpandMenuButton";
import { BlogWindowProvider } from "../contexts/BlogWindowContext";
import blogWindowStyle from "./blog-window.module.css";

interface Props {
  presetSlug?: string;
}

export default function BlogWindowFrame({ presetSlug = "" }: Props) {
  const [slug, setSlug] = useState<string>(presetSlug);
  const [isMenuOpen, setIsMenuOpen] = useState(!presetSlug);

  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <BlogWindowProvider {...{ slug, setSlug, isMenuOpen, setIsMenuOpen }}>
      <aside
        aria-hidden={!isMenuOpen}
        ref={menuRef}
        className={`fixed top-0 left-0 z-10 h-full ${
          slug ? blogWindowStyle.menuWidth : "w-full"
        } bg-widget-40 shadow-lg backdrop-blur-2xl transition-all duration-200 ease-out ${
          isMenuOpen
            ? `backdrop-blur-2xl translate-x-0`
            : "-translate-x-full invisible"
        }`}
      >
        <BlogWindowMenu />
      </aside>
      <div
        className={`absolute z-10 top-3 left-4 h-6 w-6 transition-opacity duration-300 ease-out ${
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
    </BlogWindowProvider>
  );
}
