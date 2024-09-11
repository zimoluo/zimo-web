"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import MusicPlayerCard from "../widgets/MusicPlayerCard";
import FaviconEditorArea from "@/app/design/theme-maker/FaviconEditorArea";
import TableOfContents from "../widgets/TableOfContents";

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
      minWidth: 576,
      maxWidth: 1000,
    });
    appendWindow({
      content: <TableOfContents sections={[{ id: "awa", title: "bwb" }]} />,
      defaultHeight: "fit",
      defaultWidth: "fit",
      uniqueKey: "c",
    });
  }, []);

  return null;
}
