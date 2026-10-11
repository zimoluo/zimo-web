"use client";

import { useEffect, useRef, type ButtonHTMLAttributes } from "react";

export function ReactionButton({ onClick, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const animation = useRef<Animation | null>(null);
  useEffect(() => () => animation.current?.cancel(), []);
  return <button {...props} type="button" onClick={(event) => {
    const icon = event.currentTarget.querySelector("svg");
    if (icon && typeof icon.animate === "function" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.current?.cancel();
      const liked = props["aria-pressed"] === true;
      const frames = liked ? [0, -18, 18, -9, 9, 0].map((degrees, index) => ({ rotate: `${degrees}deg`, offset: [0, .15, .45, .6, .8, 1][index] ?? 1 })) : [{ rotate: "0deg", offset: 0 }, { rotate: "-20deg", offset: .2 }, { rotate: "-20deg", offset: .35 }, { rotate: "360deg", offset: 1 }];
      animation.current = icon.animate(frames, { duration: 600, easing: "ease-in-out" });
    }
    onClick?.(event);
  }}>{children}</button>;
}
