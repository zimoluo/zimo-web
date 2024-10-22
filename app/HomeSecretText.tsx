"use client";

import { useToast } from "@/components/contexts/ToastContext";
import WindowTransformer from "@/components/window/widget/WindowTransformer";
import { useEffect, useState } from "react";

const isDebugMode = false;

export default function HomeSecretText() {
  const [titleName, setTitleName] = useState("Zimo");
  const { appendToast } = useToast();

  useEffect(() => {
    if (Math.random() < 0.01127) {
      const nameChoices = ["Kawarage", "Eunoe", "ZIMO"];
      setTitleName(nameChoices[Math.floor(Math.random() * nameChoices.length)]);
    }
  }, []);

  return isDebugMode ? (
    <WindowTransformer>
      <button
        className="p-2 rounded-xl border-2 border-saturated border-opacity-75 bg-widget-100 inline-block"
        onClick={() => {
          appendToast({
            title: "Toast Test",
            description: "This is a test toast.",
          });
        }}
      >
        Toast
      </button>
    </WindowTransformer>
  ) : (
    titleName
  );
}
