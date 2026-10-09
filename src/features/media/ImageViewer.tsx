"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { KeyboardEvent } from "react";
import { presentOverlay } from "../overlays";
import type { MediaImage } from "./model";
import { useScrollSnapIndex } from "./use-scroll-snap-index";
import styles from "./media.module.css";

export type ImageViewerProps = {
  readonly images: readonly MediaImage[];
  readonly className?: string;
  readonly fit?: "cover" | "contain";
  readonly sizes?: string;
  readonly priority?: boolean;
  readonly initialIndex?: number;
  readonly lightbox?: boolean;
};

export function ImageViewer({ images, className = "", fit = "cover", sizes = "(min-width: 768px) 720px, 100vw", priority = false, initialIndex = 0, lightbox = false }: ImageViewerProps) {
  const [page, setPage] = useState(initialIndex);
  const [grid, setGrid] = useState(false);
  const [captionHidden, setCaptionHidden] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const identity = useId().replace(/[^a-zA-Z0-9]/g, "");
  const index = Math.min(Math.max(page, 0), Math.max(0, images.length - 1));
  const current = images[index];
  const settled = useCallback((next: number) => setPage(Math.max(0, Math.min(next, images.length - 1))), [images.length]);
  useScrollSnapIndex(track, settled, grid);
  useLayoutEffect(() => {
    if (!grid && track.current !== null) track.current.scrollTo({ left: index * track.current.clientWidth, behavior: "instant" });
  }, [grid, index, initialIndex]);
  const go = (next: number) => {
    const element = track.current;
    if (element === null) return;
    const chosen = Math.max(0, Math.min(next, images.length - 1));
    if (grid) { setPage(chosen); setGrid(false); return; }
    element.scrollTo({ left: chosen * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  const toggleGrid = () => {
    if (images.length < 2) return;
    const update = () => flushSync(() => setGrid((value) => !value));
    if (document.startViewTransition !== undefined && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(update);
    else update();
  };
  const expand = () => {
    if (!lightbox && images.length > 0) presentOverlay({ kind: "lightbox", props: { images, index }, scrim: "dim-blur" });
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest("button, a, input, textarea") !== null) return;
    if (event.key >= "1" && event.key <= "9") { event.preventDefault(); go(event.key === "9" ? images.length - 1 : Number(event.key) - 1); }
    if (event.key === "g") { event.preventDefault(); toggleGrid(); }
    if (event.key === "s") { event.preventDefault(); setCaptionHidden((value) => !value); }
    if (event.key === "p" || event.key === "Enter") { event.preventDefault(); expand(); }
  };
  if (current === undefined) return null;
  return <figure className={`${styles.viewer} ${className}`} data-lightbox={lightbox || undefined}>
    <div ref={track} className={grid ? styles.grid : styles.track} tabIndex={0} role="group" aria-roledescription="carousel" aria-label="Images" onKeyDown={keyDown}>
      {images.map((image, slide) => <div key={`${image.src}-${slide}`} data-index={slide} className={styles.slide} role="group" aria-label={`Image ${slide + 1} of ${images.length}`} style={{ viewTransitionName: `zw-image-${identity}-${slide}`, aspectRatio: `${image.width} / ${image.height}` }}>
        {grid ? <button type="button" className={styles.gridSelect} aria-label={`Show image ${slide + 1}`} onClick={() => go(slide)}>
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading="lazy" style={{ objectFit: fit }} />
        </button> : <>
          <img src={lightbox ? (image.originalSrc ?? image.src) : image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} loading={priority && slide === 0 ? "eager" : "lazy"} fetchPriority={priority && slide === 0 ? "high" : slide === index ? "auto" : "low"} style={{ objectFit: lightbox ? "contain" : fit, objectPosition: `${(image.focus?.x ?? 0.5) * 100}% ${(image.focus?.y ?? 0.5) * 100}%`, backgroundImage: image.placeholder === undefined ? undefined : `url(${image.placeholder})` }} />
          {!captionHidden && image.caption && <p className={`${styles.caption} surface-overlay`}>{image.caption}</p>}
        </>}
      </div>)}
    </div>
    <div className={`${styles.controls} surface-overlay`}>
      <button type="button" aria-label="Previous image" disabled={index === 0 || grid} onClick={() => go(index - 1)}>‹</button>
      <span aria-hidden="true">{index + 1} / {images.length}</span>
      <button type="button" aria-label="Next image" disabled={index === images.length - 1 || grid} onClick={() => go(index + 1)}>›</button>
      {images.length > 1 && <button type="button" aria-pressed={grid} onClick={toggleGrid}>Grid</button>}
      {images.some((image) => image.caption) && <button type="button" aria-pressed={!captionHidden} onClick={() => setCaptionHidden((value) => !value)}>Captions</button>}
      {lightbox ? <a href={current.originalSrc ?? current.src} target="_blank" rel="noreferrer">Original</a> : <button type="button" onClick={expand}>Expand</button>}
    </div>
    <span className="sr-only" aria-live="polite">Image {index + 1} of {images.length}</span>
  </figure>;
}
