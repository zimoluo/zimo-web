"use client";

import { useWindow } from "@/components/contexts/WindowContext";
import BlogWindowFrame from "@/components/widgets/BlogWindowFrame";
import { useEffect, useState } from "react";

const isDebugMode = true;

export default function HomeSecretText() {
  const [titleName, setTitleName] = useState("Zimo");
  const { appendWindow } = useWindow();

  useEffect(() => {
    if (Math.random() < 0.01127) {
      const nameChoices = ["Kawarage", "Eunoe", "ZIMO"];
      setTitleName(nameChoices[Math.floor(Math.random() * nameChoices.length)]);
    }
  }, []);

  return isDebugMode ? (
    <button
      className="p-2 rounded-xl border-2 border-saturated border-opacity-75 bg-widget-100 inline-block"
      onClick={() => {
        appendWindow({
          content: <BlogWindowFrame slug="welcome-to-zimo-web" />,
          defaultHeight: 600,
          defaultWidth: 400,
          minWidth: 300,
        });
      }}
    >
      Toast
    </button>
  ) : (
    titleName
  );
}
