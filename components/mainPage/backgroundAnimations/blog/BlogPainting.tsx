"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { isHalloween } from "@/lib/seasonUtil";
import blogStyle from "./blog.module.css";

export default function BlogPainting() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageSets = {
    original: ["mountain", "tower", "eunoe"],
    halloween: [
      "bat",
      "skull",
      "tombstone",
      ...Array.from({ length: 5 }, (_, i) => `pumpkin-${i + 1}`),
    ],
  };

  useEffect(() => {
    let images = imageSets.original;

    if (isHalloween()) {
      images = imageSets.halloween;
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
      className={`absolute pointer-events-none ${blogStyle["painting-size"]}`}
      priority={true}
    />
  ) : null;
}
