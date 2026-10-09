"use client";
import type { SceneComponentProps } from "../../contract";
import styles from "./balloons.module.css";
const BALLOON_PATH = "M30.68 0c16.92 0 30.6 16.34 30.6 36.51 0 18.62-11.67 39.94-26.77 42.22l2.94 5.1c1.85 3.21.81 4.09-2.36 4.09h-1.93c6.04 15.27 6.56 18.68.65 33.95 0 .54-.46 1-1 1h-2.97c-.54 0-1-.46-1-1 5.99-15.27 5.32-18.68-.65-33.95h-3.32c-2.4.04-2.24-2.28-1.24-3.9l3.28-5.29C11.74 76.52 0 55.17 0 36.51 0 16.34 13.71 0 30.6 0h.08z";
export default function BirthdayBalloon({ params }: SceneComponentProps) {
  const interval = Number(params.spawnInterval ?? 1500) / 1000;
  return <>{Array.from({ length: 12 }, (_, i) => <svg key={`balloon-${i}`} viewBox="0 0 61.27 122.88" className={styles.balloon} style={{ left: `${5 + i * 8}%`, animationDelay: `-${i * interval}s`, animationDuration: `${interval * 12}s`, width: `${8 + i%4}vh` }}><path d={BALLOON_PATH} fill={i%2 === 0 ? "var(--zw-scene-accent, var(--zw-role-accent))" : "var(--zw-scene-highlight, var(--zw-role-brand))"} /></svg>)}</>;
}
