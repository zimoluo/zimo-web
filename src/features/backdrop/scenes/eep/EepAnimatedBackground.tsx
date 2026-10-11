"use client";
import { useEffect, useRef } from "react";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import styles from "./filter.module.css";
export default function EepAnimatedBackground() {
  const anchor = useRef<HTMLSpanElement>(null);
  const runtime = useSceneRuntime();
  useEffect(() => {
    const stack = anchor.current?.closest<HTMLElement>("[data-scope]");
    if (!stack) return;
    const contained = stack.dataset.scope === "contained";
    const parent = contained ? stack.parentElement : document.body;
    if (!parent) return;
    const overlay = document.createElement("div");
    overlay.className = styles.rainbow ?? "";
    overlay.dataset.eepFilter = contained ? "contained" : "viewport";
    overlay.setAttribute("aria-hidden", "true");
    const apply = () => {
      overlay.style.setProperty("--zw-scene-speed", String(runtime.input.params.speed ?? 1));
      overlay.style.setProperty("--zw-eep-saturation", runtime.input.quality === "rich" ? "1.5" : "1");
      overlay.style.animationPlayState = runtime.input.quality === "still" ? "paused" : "running";
      overlay.style.opacity = String(runtime.input.params.opacity ?? 1);
    };
    apply(); parent.appendChild(overlay); runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); overlay.remove(); };
  }, [runtime]);
  return <span ref={anchor} aria-hidden="true" />;
}
