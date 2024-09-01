"use client";

import { useEffect } from "react";

interface Props {
  opacity?: number;
}

export default function DarkOverlay({ opacity = 0.5 }: Props) {
  useEffect(() => {
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
      className="fixed inset-0 backdrop-blur-xl z-50 select-none"
      style={{ backgroundColor: `rgb(0 0 0 / ${opacity})` }}
    />
  );
}
