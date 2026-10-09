"use client";

import { useId } from "react";
import type { SceneComponentProps } from "../../contract";


export default function RainbowScroll({ quality }: SceneComponentProps) {
  const gradientId = useId();
  return (
    (
      <div className="min-w-[100lvw] min-h-[100lvh] fixed  flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="min-w-full min-h-full fixed  pointer-events-none select-none inset-0 object-cover"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id={gradientId}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 0))",
                }}
              />
              <stop
                offset="12.5%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 40))",
                }}
              />
              <stop
                offset="25%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 80))",
                }}
              />
              <stop
                offset="37.5%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 120))",
                }}
              />
              <stop
                offset="50%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 160))",
                }}
              />
              <stop
                offset="62.5%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 200))",
                }}
              />
              <stop
                offset="75%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 240))",
                }}
              />
              <stop
                offset="87.5%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 280))",
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "oklch(from var(--zw-scene-highlight) l c calc(h + 320))",
                }}
              />
            </linearGradient>
            <style>
              {
                "@keyframes slide{0%,to{transform:translate(0,0)}50%{transform:translate(-50%,-50%)}}"
              }
            </style>
          </defs>
          <path
            fill={`url(#${gradientId})`}
            d="M0 0h2048v2048H0z"
            style={{
              animation: quality === "rich" ? "slide calc(20s / var(--zw-scene-speed, 1)) linear infinite" : "none",
            }}
          />
        </svg>
      </div>
    )
  );
}
