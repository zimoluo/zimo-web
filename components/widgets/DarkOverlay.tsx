import React, { useEffect } from "react";

export default function DarkOverlay() {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl z-50 select-none" />
  );
}
