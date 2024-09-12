"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import MusicPlayerCard from "../widgets/MusicPlayerCard";
import FaviconEditorArea from "@/app/design/theme-maker/FaviconEditorArea";
import DisplayFavicon from "../assets/DisplayFavicon";

export default function WindowTest() {
  const { appendWindow } = useWindow();

  useEffect(() => {
    appendWindow({
      content: (
        <MusicPlayerCard url="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/at-the-speed-of-light.mp3" />
      ),
      defaultHeight: "fit",
      defaultWidth: 600,
      minWidth: 400,
      maxWidth: 1000,
      uniqueKey: "a",
    });
    appendWindow({
      content: <FaviconEditorArea />,
      defaultHeight: "fit",
      defaultWidth: 600,
      uniqueKey: "b",
      minWidth: 576,
      maxWidth: 1000,
      allowOverflow: true,
    });
    appendWindow({
      content: (
        <div className="w-full h-full bg-pastel bg-opacity-40 flex items-center justify-center">
          <div
            style={{
              maxHeight: "70%",
              maxWidth: "70%",
              height: "70%",
              width: "70%",
            }}
            className="aspect-square"
          >
            <DisplayFavicon className="w-full h-full aspect-square flex items-center justify-center object-contain" />
          </div>
        </div>
      ),
      defaultHeight: 600,
      defaultWidth: 600,
      minWidth: 200,
      minHeight: 200,
      maxHeight: 1600,
      maxWidth: 1600,
      uniqueKey: "c",
    });
  }, []);

  return null;
}
