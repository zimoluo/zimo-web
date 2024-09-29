"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import WindowPicker from "./WindowPicker";

export default function WindowTest() {
  const { appendWindow } = useWindow();

  useEffect(() => {
    appendWindow({
      content: <WindowPicker />,
      contextKey: "test7",
      defaultHeight: 500,
      defaultWidth: 562,
      minWidth: 432,
      minHeight: 400,
      maxWidth: 768,
      maxHeight: 712,
    });
  }, []);

  return null;
}
