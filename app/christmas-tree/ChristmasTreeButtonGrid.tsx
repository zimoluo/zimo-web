"use client";

import { useState, useRef, useEffect } from "react";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import ChristmasTreeSelectButton from "./ChristmasTreeSelectButton";

const availableSprites = [
  "cane",
  "bauble",
  "bell1",
  "bell2",
  "bell3",
  "bells",
  "candy",
  "cup",
  "deer",
  "gift",
  "giftbag",
  "gingerbread",
  "glove",
  "hat",
  "sock",
  "headphones",
  "lollipop",
  "mistletoe",
  "ribbon",
  "ring",
  "scarf",
  "snow-globe",
  "snowflake",
  "tag",
];

export default function ChristmasTreeButtonGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollData, setScrollData] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
  });

  const updateScrollData = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setScrollData({ scrollLeft, scrollWidth, clientWidth });
  };

  useEffect(() => {
    window.addEventListener("resize", updateScrollData);

    return () => {
      window.removeEventListener("resize", updateScrollData);
    };
  }, []);

  const showLeftButton = scrollData.scrollLeft > 20;
  const showRightButton =
    scrollData.scrollLeft <
    scrollData.scrollWidth - scrollData.clientWidth - 20;

  const scrollLeft = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative md:h-full">
      <section
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 md:flex-col overflow-auto px-4 py-4 shrink-0 relative h-full scrollbar-hide"
        onScroll={updateScrollData}
      >
        {availableSprites.map((sprite, index) => (
          <ChristmasTreeSelectButton key={index} sprite={sprite} />
        ))}
      </section>

      <button
        onClick={scrollLeft}
        className={`md:hidden absolute left-4 w-9 px-2 h-12 top-1/2 -translate-y-1/2 bg-pastel bg-opacity-50 backdrop-blur-lg shadow-md rounded-xl transition-opacity duration-300 ease-out group ${
          showLeftButton
            ? "opacity-100"
            : "opacity-0 pointer-events-none select-none"
        }`}
      >
        <UpDownSwitchIcon className="-rotate-90 w-full h-auto aspect-square transition-transform ease-out duration-300 group-hover:scale-110" />
      </button>

      <button
        onClick={scrollRight}
        className={`md:hidden absolute right-4 w-9 px-2 h-12 top-1/2 -translate-y-1/2 bg-pastel bg-opacity-50 backdrop-blur-lg shadow-md rounded-xl transition-opacity duration-300 ease-out group ${
          showRightButton
            ? "opacity-100"
            : "opacity-0 pointer-events-none select-none"
        }`}
      >
        <UpDownSwitchIcon className="rotate-90 w-full h-auto aspect-square transition-transform ease-out duration-300 group-hover:scale-110" />
      </button>
    </div>
  );
}
