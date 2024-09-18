"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import MusicPlayerCard from "../widgets/MusicPlayerCard";
import DisplayFavicon from "../assets/DisplayFavicon";
import ThemeEditorFrame from "@/app/design/theme-maker/ThemeEditorFrame";

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
      contextKey: "music-player",
    });
    appendWindow({
      content: (
        <div className="w-full h-full bg-pastel bg-opacity-40 flex items-center justify-center p-1">
          <div
            style={{
              maxHeight: "70%",
              maxWidth: "70%",
              height: "70%",
              width: "70%",
            }}
            className="aspect-square items-center justify-center flex"
          >
            <div className="max-w-full max-h-full w-full h-full">
              <DisplayFavicon className="max-w-full max-h-full aspect-square left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      ),
      defaultHeight: 400,
      defaultWidth: 400,
      minWidth: 200,
      minHeight: 200,
      maxHeight: 600,
      maxWidth: 600,
      contextKey: "favicon",
    });
    appendWindow({
      content: (
        <div className="overflow-y-auto w-full h-full bg-widget-80 md:bg-widget-40 md:backdrop-blur-2xl">
          <ThemeEditorFrame />
        </div>
      ),
      defaultHeight: 360,
      defaultWidth: 620,
      minWidth: 615,
      maxWidth: 1000,
      minHeight: 320,
      maxHeight: 500,
      contextKey: "theme-editor",
    });
  }, []);

  return null;
}
