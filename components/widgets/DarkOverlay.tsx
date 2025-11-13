"use client";

import { useEffect, useState } from "react";

interface Props {
  opacity?: number;
  fadesIn?: boolean;
}

export default function DarkOverlay({ opacity = 0.25, fadesIn = true }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    document.body.style.overflow = "hidden";

    const handleMutation = (mutations: any) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          document.body.style.overflow = "hidden";
        }
      }
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { attributes: true });

    return () => {
      document.body.style.overflow = "";
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed -inset-1/2 backdrop-blur-[24px] z-50 select-none transition-opacity duration-150 ${
        fadesIn && !mounted ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: `rgb(0 0 0 / ${opacity})` }}
    />
  );
}
