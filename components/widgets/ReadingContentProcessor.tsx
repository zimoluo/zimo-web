"use client";

import { ReactNode, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useSettings } from "@/components/contexts/SettingsContext";

type Props = {
  children?: ReactNode;
  isBlog?: boolean;
};

export default function ReadingContentProcessor({
  children,
  isBlog = false,
}: Props) {
  const { settings } = useSettings();

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".regular-article-module pre code"
    );
    elements.forEach((element) => {
      hljs.highlightElement(element as HTMLElement);
    });
  }, []);

  return (
    <section
      className={`${
        settings.disableSerifFont || !isBlog ? "font-sans" : "font-serif"
      }`}
    >
      {children}
    </section>
  );
}
