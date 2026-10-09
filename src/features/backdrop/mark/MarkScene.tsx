"use client";
import { useEffect, useId, useSyncExternalStore } from "react";
import { useSettings } from "../../settings";
import { CSS_MARK_PALETTE, GALLERY_PATHS } from "./motif";
import { primaryMarkSlot } from "./primary-slot";
import styles from "./mark-scene.module.css";
export function MarkScene({ sceneId, themeId, primary = false, className }: {
  readonly sceneId: string; readonly themeId: string; readonly primary?: boolean; readonly className?: string;
}) {
  const id = useId();
  const fullMotion = useSettings((state) => state.motion.backdrop === "full");
  const owner = useSyncExternalStore(primaryMarkSlot.subscribe, primaryMarkSlot.read, () => null);
  useEffect(() => {

    if (!primary) return;
    return primaryMarkSlot.acquire(id);
  }, [id, primary]);
  const live = owner === id && primary && fullMotion;
  const dimensional = sceneId === "gallery-3d" || sceneId === "gallery3D";
  return <span className={`${styles.root} ${className ?? ""}`} data-mark-scene={sceneId} data-theme-id={themeId} data-live={live} data-dimensional={dimensional} aria-hidden="true">
    <span className={styles.frame}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="256" height="256">
      <g transform={dimensional ? "translate(35 55) scale(0.92 0.88)" : undefined}>
        {dimensional && <path d={GALLERY_PATHS[0]} transform="translate(0 28)" fill={CSS_MARK_PALETTE.stroke} />}
        <path d={GALLERY_PATHS[0]} fill={CSS_MARK_PALETTE.base} />
        <path d={GALLERY_PATHS[1]} fill={CSS_MARK_PALETTE.highlight} />
        <path d={GALLERY_PATHS[2]} fill={CSS_MARK_PALETTE.accent} />
        <path d={GALLERY_PATHS[3]} fill="none" stroke={CSS_MARK_PALETTE.stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="36" />
      </g>
    </svg></span>
  </span>;
}
