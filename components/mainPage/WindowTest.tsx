"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import MusicPlayerCard from "../widgets/MusicPlayerCard";
import FaviconEditorArea from "@/app/design/theme-maker/FaviconEditorArea";
import GradientEditor from "@/app/design/theme-maker/GradientEditor";

export default function WindowTest() {
  const { appendWindow } = useWindow();

  useEffect(() => {
    appendWindow({
      content: (
        <MusicPlayerCard url="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/at-the-speed-of-light.mp3" />
      ),
      defaultHeight: "fit",
      defaultWidth: 600,
      uniqueKey: "a",
    });
    appendWindow({
      content: <FaviconEditorArea />,
      defaultHeight: "fit",
      defaultWidth: 600,
      uniqueKey: "b",
    });
    appendWindow({
      content: <GradientEditor />,
      defaultHeight: "fit",
      defaultWidth: 900,
      uniqueKey: "c",
    });
  }, []);

  return null;
}
