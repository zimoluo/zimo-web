"use client";
import { useEffect, useRef } from "react";
import styles from "./blog.module.css";
const SETS = { original: ["mountain", "tower", "eunoe"], halloween: ["bat", "skull", "tombstone", "pumpkin-1", "pumpkin-2", "pumpkin-3", "pumpkin-4", "pumpkin-5"], chatgpt: ["chatgpt"] } as const;
export default function BlogPainting() {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {

    const date = new Date();
    const month = date.getMonth() + 1; const day = date.getDate();
    const choices = month === 10 && day >= 28 ? SETS.halloween : month === 11 && day === 30 ? SETS.chatgpt : SETS.original;
    const selected = choices[Math.floor(Math.random() * choices.length)] ?? "mountain";
    if (image.current !== null) {
      const source = `/theme/animated-background/blog/painting/${selected}.svg`;
      image.current.dataset.paletteSrc = source;
      image.current.src = source;
    }
  }, []);


  return <img ref={image} src="/theme/animated-background/blog/painting/mountain.svg" data-palette-src="/theme/animated-background/blog/painting/mountain.svg" alt="" className={styles.size} style={{ position: "absolute" }} />;
}
