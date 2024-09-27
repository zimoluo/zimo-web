"use client";

import { ReactNode, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useBlogWindow } from "../contexts/BlogWindowContext";

type Props = {
  children?: ReactNode;
  isBlog?: boolean;
  slug: string;
};

export default function WindowReadingSettingsApplier({
  children,
  isBlog = false,
  slug,
}: Props) {
  const { settings } = useSettings();
  const { contentRef } = useBlogWindow();

  useEffect(() => {
    if (contentRef && contentRef.current) {
      const elements = contentRef.current.querySelectorAll(
        ".regular-article-module pre code"
      );
      elements.forEach((element) => {
        hljs.highlightElement(element as HTMLElement);
      });
    }
  }, [contentRef, slug]);

  return (
    <section
      className={`${
        settings.disableSerifFont || !isBlog ? "font-main" : "font-serif"
      }`}
    >
      {children}
    </section>
  );
}
