"use client";

import { useEffect, useState } from "react";

export default function ClickingCircle() {
  const [position, setPosition] = useState({ left: "50%", top: "50%" });

  const handleClick = () => {
    const circleSize = Math.min(window.innerHeight, window.innerWidth) * 0.3;

    const maxX = window.innerWidth - circleSize;
    const maxY = window.innerHeight - circleSize;
    const minX = circleSize;
    const minY = circleSize;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;

    const xPercent = (x / window.innerWidth) * 100;
    const yPercent = (y / window.innerHeight) * 100;

    setPosition({ left: `${xPercent}%`, top: `${yPercent}%` });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      className="bg-primary rounded-full fixed select-none pointer-events-none -z-10 aspect-square w-auto -translate-x-1/2 -translate-y-1/2"
      style={{
        left: position.left,
        top: position.top,
        height: "min(30vh, 30vw)",
        transition: "left 600ms ease-in-out, top 600ms ease-in-out",
      }}
    />
  );
}
