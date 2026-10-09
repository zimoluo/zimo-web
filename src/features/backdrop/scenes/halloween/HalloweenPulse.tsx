"use client";
import { useEffect, useRef } from "react";
import { settingsStore } from "../../../settings";
import type { SceneComponentProps } from "../../contract";
import styles from "./halloween.module.css";
const EVENTS = ["bats", "pumpkin", "witch"] as const;
export default function HalloweenPulse({ quality }: SceneComponentProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {

    if (quality !== "rich") return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let audio: HTMLAudioElement | undefined;
    const interval = setInterval(() => {
      const host = root.current;
      if (host === null) return;
      const index = Math.floor(Math.random() * EVENTS.length);
      const name = EVENTS[index] ?? "bats";
      const image = host.querySelector<HTMLElement>(`[data-event="${name}"]`);
      if (image === null) return;
      image.style.opacity = "1";
      if (settingsStore.getState().sound.enabled) {
        audio?.pause();
        audio = new Audio(`/special/halloween-event/${name}.${name === "pumpkin" ? "mp3" : "wav"}`);
        void audio.play().catch(() => undefined);
      }
      const timer = setTimeout(() => { image.style.opacity = "0"; timers.delete(timer); }, 9000);
      timers.add(timer);
    }, 16000);
    return () => { clearInterval(interval); for (const timer of timers) clearTimeout(timer); audio?.pause(); };
  }, [quality]);
  return <div ref={root}>
    {EVENTS.map((name) => <span key={name} data-event={name} className={styles[name]} style={{ position: "fixed", inset: 0, opacity: 0, backgroundColor: "var(--zw-scene-accent)", maskImage: `url(/special/halloween-event/${name}.svg)`, maskSize: "cover" }} />)}
  </div>;
}
