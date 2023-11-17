"use client";

import { ReactNode, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { useSettings } from "@/components/contexts/SettingsContext";

type Props = {
  children?: ReactNode;
};

export default function BlogContentProcessor({ children }: Props) {
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
      className={`${settings.disableSerifFont ? "font-sans" : "font-serif"}`}
    >
      {children}
    </section>
  );
}
