"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isChatGPTDay, isHalloween } from "@/lib/seasonUtil";
import blogStyle from "./blog.module.css";

const imageSets = {
  original: ["mountain", "tower", "eunoe"],
  halloween: [
    "bat",
    "skull",
    "tombstone",
    ...Array.from({ length: 5 }, (_, i) => `pumpkin-${i + 1}`),
  ],
  chatgpt: ["chatgpt"],
};

export default function BlogPainting() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let images = imageSets.original;

    if (isHalloween()) {
      images = imageSets.halloween;
    }

    if (isChatGPTDay()) {
      images = imageSets.chatgpt;
    }

    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  return selectedImage ? (
    <Image
      src={`/theme/animated-background/blog/painting/${selectedImage}.svg`}
      alt="Blog Painting"
      height={0}
      width={0}
      className={`absolute pointer-events-none ${blogStyle.size}`}
      priority={true}
    />
  ) : null;
}
