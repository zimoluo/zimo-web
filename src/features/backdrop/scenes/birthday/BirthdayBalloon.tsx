"use client";
import { useEffect, useRef } from "react";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import styles from "./balloons.module.css";
const BALLOON_PATH = "M30.68 0c16.92 0 30.6 16.34 30.6 36.51 0 18.62-11.67 39.94-26.77 42.22l2.94 5.1c1.85 3.21.81 4.09-2.36 4.09h-1.93c6.04 15.27 6.56 18.68.65 33.95 0 .54-.46 1-1 1h-2.97c-.54 0-1-.46-1-1 5.99-15.27 5.32-18.68-.65-33.95h-3.32c-2.4.04-2.24-2.28-1.24-3.9l3.28-5.29C11.74 76.52 0 55.17 0 36.51 0 16.34 13.71 0 30.6 0h.08zm5.51 12.16a1.749 1.749 0 1 1 1.66-3.08c2.93 1.58 5.86 3.92 8.42 6.57 2.64 2.73 4.89 5.8 6.32 8.7a1.747 1.747 0 0 1-3.13 1.55c-1.28-2.58-3.31-5.34-5.71-7.83-2.31-2.4-4.95-4.51-7.56-5.91z";

export default function BirthdayBalloon() {
  const runtime = useSceneRuntime();
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (node === null) return;
    const animations = new Set<Animation>();
    let interval = 0;
    let alive = true;
    const add = () => {
      if (node.childElementCount >= 180) return;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", BALLOON_PATH);
      path.setAttribute("fill", `hsl(${327.92 + Math.random() * 144.36} 100% 80.2%)`);
      path.setAttribute("fill-rule", "evenodd");
      svg.appendChild(path);
      svg.setAttribute("viewBox", "0 0 61.27 122.88");
      svg.setAttribute("aria-hidden", "true");
      svg.classList.add(styles.balloon ?? "");
      svg.style.left = `${5 + Math.random() * 90}%`;
      const height = node.getBoundingClientRect().height;
      svg.style.width = `${height * (.08 + Math.random() * .04)}px`;
      node.appendChild(svg);
      const motion = svg.animate([{bottom:`-${height * (.4 + Math.random() * .2)}px`},{bottom:`${height * 1.2}px`}], {duration:(10 + Math.random() * 6) * 1000,easing:"linear",fill:"forwards"});
      motion.playbackRate = Number(runtime.input.params.speed ?? 1);
      animations.add(motion);
      void motion.finished.then(() => { if (alive) { animations.delete(motion); svg.remove(); } }).catch(() => undefined);
    };
    const apply = () => {
      window.clearInterval(interval);
      const speed = Number(runtime.input.params.speed ?? 1);
      for (const motion of animations) motion.updatePlaybackRate(speed);
      interval = window.setInterval(add, Number(runtime.input.params.spawnInterval ?? 1500) / speed);
    };
    const reset = () => {
      for (const motion of animations) motion.cancel();
      animations.clear(); node.replaceChildren();
      for (let i = 0; i < 5; i++) add();
      apply();
    };
    reset();
    runtime.listeners.add(apply);
    const observer = new ResizeObserver(reset); observer.observe(node);
    return () => {
      alive = false; window.clearInterval(interval); observer.disconnect(); runtime.listeners.delete(apply);
      for (const motion of animations) motion.cancel();
      animations.clear(); node.replaceChildren();
    };
  }, [runtime]);
  return <div ref={host} className={styles.field} aria-hidden="true" />;
}
