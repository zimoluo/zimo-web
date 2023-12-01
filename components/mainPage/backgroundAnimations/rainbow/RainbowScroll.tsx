"use client";

import { useSettings } from "@/components/contexts/SettingsContext";

export default function RainbowScroll() {
  const { settings } = useSettings();
  return (
    settings.backgroundRichness === "rich" && (
      <svg
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="min-w-screen min-h-screen fixed -z-20 pointer-events-none select-none inset-0 object-cover object-center"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="rainbowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
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
        </defs>
        <rect
          x={-2048}
          y={-2048}
          width={4096}
          height={4096}
          fill="url(#rainbowGradient)"
        >
          <animate
            attributeName="x"
            attributeType="XML"
            values="0;-2048;0"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="0;-2048;0"
            dur="10s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    )
  );
}
