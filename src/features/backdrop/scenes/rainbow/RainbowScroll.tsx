"use client";

import { authoredPaint } from "../../host/authored-shading";
import { artworkCss } from "../../host/artwork";
import { useId } from "react";
import type { SceneComponentProps } from "../../contract";


const colors = [[255,153,153],[255,179,128],[255,255,128],[128,255,128],[128,179,255],[153,102,204],[204,153,255],[153,102,204],[128,179,255]].map(([r,g,b]) => artworkCss(authoredPaint("rainbow", "highlight", [r!/255,g!/255,b!/255])));

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
                  stopColor: colors[0],
                }}
              />
              <stop
                offset="12.5%"
                style={{
                  stopColor: colors[1],
                }}
              />
              <stop
                offset="25%"
                style={{
                  stopColor: colors[2],
                }}
              />
              <stop
                offset="37.5%"
                style={{
                  stopColor: colors[3],
                }}
              />
              <stop
                offset="50%"
                style={{
                  stopColor: colors[4],
                }}
              />
              <stop
                offset="62.5%"
                style={{
                  stopColor: colors[5],
                }}
              />
              <stop
                offset="75%"
                style={{
                  stopColor: colors[6],
                }}
              />
              <stop
                offset="87.5%"
                style={{
                  stopColor: colors[7],
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: colors[8],
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
