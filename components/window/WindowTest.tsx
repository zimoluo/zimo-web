"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import BlogWindowFrame from "./blog/BlogWindowFrame";

export default function WindowTest() {
  const { appendWindow } = useWindow();

  useEffect(() => {
    appendWindow({
      content: <BlogWindowFrame />,
      contextKey: "test4",
      defaultHeight: 620,
      defaultWidth: 460,
      minWidth: 416,
      minHeight: 420,
      maxWidth: 960,
      maxHeight: 760,
    });
    appendWindow({
      content: <BlogWindowFrame />,
      contextKey: "test5",
      defaultHeight: 600,
      defaultWidth: 440,
      minWidth: 416,
      minHeight: 420,
      maxWidth: 960,
      maxHeight: 760,
    });
  }, []);

  return null;
}
