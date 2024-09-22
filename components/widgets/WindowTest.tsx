"use client";

import { useEffect } from "react";
import { useWindow } from "../contexts/WindowContext";
import ImageViewer from "./ImageViewer";
import MusicPlayerCard from "./MusicPlayerCard";

export default function WindowTest() {
  const { appendWindow } = useWindow();

  useEffect(() => {
    appendWindow({
      content: (
        <ImageViewer
          defaultDimension={false}
          className="h-full w-auto"
          aspectRatio="2.1:1"
          url={[
            "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/posts/infinity-update/images/gallery.png",
            "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/posts/infinity-update/images/eep.png",
            "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/posts/infinity-update/images/vibrant.png",
          ]}
        />
      ),
      contextKey: "test",
      defaultHeight: "fit",
      defaultWidth: 600,
      minWidth: 300,
    });
    appendWindow({
      content: (
        <MusicPlayerCard url="https://zimo-web-bucket.s3.us-east-2.amazonaws.com/blog/audio/at-the-speed-of-light.mp3" />
      ),
      contextKey: "test2",
      defaultHeight: "fit",
      defaultWidth: 600,
      minWidth: 300,
    });
  }, []);

  return null;
}
