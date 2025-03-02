"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function RainbowScroll() {
  const { settings } = useSettings();
  return (
    settings.backgroundRichness === "rich" && (
      <div className="min-w-[100lvw] min-h-[100lvh] fixed -z-20 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="min-w-full min-h-full fixed -z-20 pointer-events-none select-none inset-0 object-cover"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="rainbowGradient"
              x1="0%"
              x2="100%"
              y1="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "rgb(255, 153, 153)",
                }}
              />
              <stop
                offset="12.5%"
                style={{
                  stopColor: "rgb(255, 179, 128)",
                }}
              />
              <stop
                offset="25%"
                style={{
                  stopColor: "rgb(255, 255, 128)",
                }}
              />
              <stop
                offset="37.5%"
                style={{
                  stopColor: "rgb(128, 255, 128)",
                }}
              />
              <stop
                offset="50%"
                style={{
                  stopColor: "rgb(128, 179, 255)",
                }}
              />
              <stop
                offset="62.5%"
                style={{
                  stopColor: "rgb(153, 102, 204)",
                }}
              />
              <stop
                offset="75%"
                style={{
                  stopColor: "rgb(204, 153, 255)",
                }}
              />
              <stop
                offset="87.5%"
                style={{
                  stopColor: "rgb(153, 102, 204)",
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "rgb(128, 179, 255)",
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
            fill="url(#rainbowGradient)"
            d="M0 0h2048v2048H0z"
            style={{
              animation: "slide 20s linear infinite",
            }}
          />
        </svg>
      </div>
    )
  );
}
