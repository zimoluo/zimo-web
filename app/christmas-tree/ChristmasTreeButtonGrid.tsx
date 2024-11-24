"use client";

import { useState, useRef, useEffect } from "react";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import ChristmasTreeSelectButton from "./ChristmasTreeSelectButton";
import spriteStyle from "./sprite.module.css";
import { useDragAndTouch } from "@/lib/helperHooks";

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
  const scrollBarRef = useRef<HTMLDivElement>(null);

  const spontaneousScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [scrollData, setScrollData] = useState({
    scrollLeft: 0,
    scrollWidth: 0,
    clientWidth: 0,
  });

  const [draggingData, setDraggingData] = useState({
    startPos: 0,
    scrollPos: 0,
    touchIdentifier: null as number | null,
  });

  const updateScrollData = () => {
    if (!scrollContainerRef.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setScrollData({ scrollLeft, scrollWidth, clientWidth });
    handleScroll();
  };

  useEffect(() => {
    window.addEventListener("resize", updateScrollData);

    updateScrollData();

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
      left: Math.max(-200, -scrollData.scrollLeft),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({
      left: Math.min(
        200,
        scrollData.scrollWidth - scrollData.clientWidth - scrollData.scrollLeft
      ),
      behavior: "smooth",
    });
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientPos = "touches" in e ? e.changedTouches[0].clientX : e.clientX;
    setDraggingData({
      startPos: clientPos,
      scrollPos: scrollData.scrollLeft,
      touchIdentifier: "touches" in e ? e.changedTouches[0].identifier : null,
    });
    setIsDragging(true);

    if (spontaneousScrollTimeoutRef.current) {
      clearTimeout(spontaneousScrollTimeoutRef.current);
    }
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (scrollContainerRef.current === null) {
      return;
    }

    if (scrollBarRef.current === null) {
      return;
    }

    const clientPos =
      "touches" in e
        ? Array.from(e.touches).find(
            (touch) => touch.identifier === draggingData.touchIdentifier
          )?.clientX ?? e.touches[0].clientX
        : e.clientX;
    const { startPos, scrollPos } = draggingData;
    const deltaPos = clientPos - startPos;

    scrollContainerRef.current.scrollTo({
      left:
        scrollPos +
        (deltaPos * (scrollData.scrollWidth - scrollData.clientWidth)) /
          scrollBarRef.current.clientWidth,
      behavior: "auto",
    });
  };

  const handleScroll = () => {
    if (isDragging) {
      return;
    }

    setIsDragging(true);
    spontaneousScrollTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 400);
  };

  const { handleStartDragging, handleStartTouching } = useDragAndTouch({
    onMove: handleDragMove,
    onStart: handleDragStart,
    onFinish: () => setIsDragging(false),
  });

  useEffect(() => {
    return () => {
      if (spontaneousScrollTimeoutRef.current) {
        clearTimeout(spontaneousScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full md:w-auto md:h-full flex flex-col md:flex-row">
      <section
        ref={scrollContainerRef}
        className={`flex gap-4 md:gap-6 md:flex-col overflow-auto px-4 py-4 shrink-0 h-min md:h-full ${spriteStyle.noScrollbar}`}
        onScroll={updateScrollData}
      >
        {availableSprites.map((sprite, index) => (
          <ChristmasTreeSelectButton key={index} sprite={sprite} />
        ))}
      </section>
      <div className="flex md:flex-col px-4 gap-2 items-center">
        <button
          onClick={scrollLeft}
          className={`md:hidden w-9 p-2.5 h-9 bg-light bg-opacity-80 backdrop-blur-lg shadow-md rounded-xl transition-opacity duration-300 ease-out group ${
            showLeftButton ? "" : "pointer-events-none select-none"
          }`}
        >
          <UpDownSwitchIcon
            className={`-rotate-90 w-full h-auto aspect-square transition-all ease-out duration-300 ${
              showLeftButton ? "group-hover:scale-110" : "opacity-30"
            }`}
          />
        </button>

        <div
          className={`flex-grow h-full flex items-center px-4 group ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleStartDragging}
          onTouchStart={handleStartTouching}
        >
          <div
            className={`w-full relative h-4 transition-colors duration-300 ease-out rounded-xl ${
              isDragging
                ? spriteStyle.dragBarColorDragging
                : spriteStyle.dragBarColorIdle
            } backdrop-blur-lg shadow-md`}
            ref={scrollBarRef}
          >
            <div
              style={{
                left: `${
                  (scrollData.scrollLeft /
                    (scrollData.scrollWidth - scrollData.clientWidth)) *
                  100
                }%`,
              }}
              className={`absolute h-8 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 shadow-md rounded-xl ${
                spriteStyle.dragBarTransition
              } ${
                isDragging
                  ? "scale-110 border-opacity-100"
                  : "group-hover:scale-105 border-opacity-80"
              } ${
                isDragging
                  ? spriteStyle.dragButtonDragging
                  : spriteStyle.dragButtonIdle
              } group-hover:bg-opacity-100 border border-pastel`}
            />
          </div>
        </div>

        <button
          onClick={scrollRight}
          className={`md:hidden w-9 p-2.5 h-9 bg-light bg-opacity-80 backdrop-blur-lg shadow-md rounded-xl group ${
            showRightButton ? "" : "pointer-events-none select-none"
          }`}
        >
          <UpDownSwitchIcon
            className={`rotate-90 w-full h-auto aspect-square transition-all ease-out duration-300 ${
              showRightButton ? "group-hover:scale-110" : "opacity-30"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
