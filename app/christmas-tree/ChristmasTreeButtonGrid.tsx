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
  "bell",
  "ribbon",
  "candy",
  "lollipop",
  "letter",
  "snow-globe",
  "card",
  "giftbag",
  "shopping-bag",
  "tag",
  "cup",
  "gingerbread",
  "deer",
  "gift",
  "sweater",
  "scarf",
  "glove",
  "hat",
  "sock",
  "headphones",
  "lights",
  "mistletoe",
  "ring",
  "snowflake",
];

export default function ChristmasTreeButtonGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  const spontaneousScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [isWideScreen, setIsWideScreen] = useState(false);

  const [scrollData, setScrollData] = useState({
    scrollStart: 0,
    scrollAmount: 0,
    clientAmount: 0,
  });

  const [draggingData, setDraggingData] = useState({
    startPos: 0,
    scrollPos: 0,
    touchIdentifier: null as number | null,
  });

  const [isMounted, setIsMounted] = useState(false);

  const updateScrollData = () => {
    if (!scrollContainerRef.current) {
      return;
    }

    const {
      scrollLeft,
      scrollWidth,
      clientWidth,
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollContainerRef.current;
    setScrollData({
      scrollStart: window.innerWidth >= 768 ? scrollTop : scrollLeft,
      scrollAmount: window.innerWidth >= 768 ? scrollHeight : scrollWidth,
      clientAmount: window.innerWidth >= 768 ? clientHeight : clientWidth,
    });
    handleScroll();
  };

  useEffect(() => {
    const updateScrollDataAndSetIsWideScreen = () => {
      updateScrollData();
      setIsWideScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", updateScrollDataAndSetIsWideScreen);

    updateScrollDataAndSetIsWideScreen();
    setIsDragging(false);
    if (spontaneousScrollTimeoutRef.current) {
      clearTimeout(spontaneousScrollTimeoutRef.current);
    }

    setIsMounted(true);

    return () => {
      window.removeEventListener("resize", updateScrollDataAndSetIsWideScreen);

      if (spontaneousScrollTimeoutRef.current) {
        clearTimeout(spontaneousScrollTimeoutRef.current);
      }
    };
  }, []);

  const showLeftButton = scrollData.scrollStart > 20;
  const showRightButton =
    scrollData.scrollStart <
    scrollData.scrollAmount - scrollData.clientAmount - 20;

  const scrollLeft = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({
      left:
        window.innerWidth >= 768
          ? undefined
          : Math.max(-200, -scrollData.scrollStart),
      top:
        window.innerWidth >= 768
          ? Math.max(-200, -scrollData.scrollStart)
          : undefined,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) {
      return;
    }
    scrollContainerRef.current.scrollBy({
      left:
        window.innerWidth >= 768
          ? undefined
          : Math.min(
              200,
              scrollData.scrollAmount -
                scrollData.clientAmount -
                scrollData.scrollStart
            ),
      top:
        window.innerWidth >= 768
          ? Math.min(
              200,
              scrollData.scrollAmount -
                scrollData.clientAmount -
                scrollData.scrollStart
            )
          : undefined,
      behavior: "smooth",
    });
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientPos =
      "touches" in e
        ? e.changedTouches[0][window.innerWidth >= 768 ? "clientY" : "clientX"]
        : e[window.innerWidth >= 768 ? "clientY" : "clientX"];
    setDraggingData({
      startPos: clientPos,
      scrollPos: scrollData.scrollStart,
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
          )?.[window.innerWidth >= 768 ? "clientY" : "clientX"] ??
          e.touches[0][window.innerWidth >= 768 ? "clientY" : "clientX"]
        : e[window.innerWidth >= 768 ? "clientY" : "clientX"];
    const { startPos, scrollPos } = draggingData;
    const deltaPos = clientPos - startPos;

    scrollContainerRef.current.scrollTo({
      left:
        window.innerWidth >= 768
          ? undefined
          : scrollPos +
            (deltaPos * (scrollData.scrollAmount - scrollData.clientAmount)) /
              scrollBarRef.current.clientWidth,
      top:
        window.innerWidth >= 768
          ? scrollPos +
            (deltaPos * (scrollData.scrollAmount - scrollData.clientAmount)) /
              scrollBarRef.current.clientHeight
          : undefined,
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

  return (
    <div className="w-full md:w-auto md:h-full flex flex-col md:flex-row md:pr-4 pb-2 md:pb-0 select-none">
      <section
        ref={scrollContainerRef}
        className={`flex gap-4 md:gap-6 md:flex-col overflow-auto px-4 py-4 shrink-0 h-min md:h-full ${spriteStyle.noScrollbar}`}
        onScroll={updateScrollData}
      >
        {availableSprites.map((sprite, index) => (
          <ChristmasTreeSelectButton key={index} sprite={sprite} />
        ))}
      </section>

      <div className="flex md:flex-col px-4 py-0 md:py-4 md:px-0 gap-2 items-center">
        <button
          onClick={scrollLeft}
          className={`w-9 md:w-8 p-2.5 aspect-square h-9 md:h-8 bg-light/65 backdrop-blur-sm shadow-lg rounded-full border-reflect-light transition-opacity duration-300 ease-out group ${
            showLeftButton ? "" : "pointer-events-none select-none"
          }`}
        >
          <UpDownSwitchIcon
            className={`-rotate-90 md:rotate-0 md:translate-y-[-1px] w-full h-auto aspect-square transition-all ease-out duration-300 ${
              showLeftButton ? "group-hover:scale-110" : "opacity-30"
            }`}
          />
        </button>

        <div
          className={`flex-grow w-full h-full flex md:flex-col items-center px-5 py-0 md:py-5 md:px-0 touch-none group ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleStartDragging}
          onTouchStart={handleStartTouching}
        >
          <div
            className={`w-full md:w-4 relative h-4 md:h-full transition-colors duration-300 ease-out rounded-xl ${
              isDragging
                ? spriteStyle.dragBarColorDragging
                : spriteStyle.dragBarColorIdle
            } backdrop-blur-lg shadow-md outline-1 outline outline-pastel/15`}
            ref={scrollBarRef}
          >
            <div
              style={{
                left: !isMounted
                  ? undefined
                  : isWideScreen
                  ? "50%"
                  : `${Math.min(
                      // need to clamp the value cuz webkit goes wild sometimes
                      100,
                      Math.max(
                        0,
                        (scrollData.scrollStart /
                          (scrollData.scrollAmount - scrollData.clientAmount)) *
                          100
                      )
                    )}%`,
                top: !isMounted
                  ? undefined
                  : isWideScreen
                  ? `${Math.min(
                      100,
                      Math.max(
                        0,
                        (scrollData.scrollStart /
                          (scrollData.scrollAmount - scrollData.clientAmount)) *
                          100
                      )
                    )}%`
                  : "50%",
              }}
              className={`absolute h-8 md:h-7 -translate-x-1/2 -translate-y-1/2 w-6 md:w-7 shadow-md rounded-xl ${
                spriteStyle.dragBarTransition
              } ${
                isDragging
                  ? "scale-110 border-opacity-100"
                  : "group-hover:scale-105 border-opacity-80"
              } ${
                isDragging
                  ? spriteStyle.dragButtonDragging
                  : spriteStyle.dragButtonIdle
              } group-hover:bg-opacity-100 border border-pastel ${
                isMounted ? "" : "top-1/2 left-0 md:top-0 md:left-1/2"
              }`}
            />
          </div>
        </div>

        <button
          onClick={scrollRight}
          className={`w-9 md:w-8 p-2.5 aspect-square h-9 md:h-8 bg-light/65 backdrop-blur-sm border-reflect-light shadow-lg rounded-full group ${
            showRightButton ? "" : "pointer-events-none select-none"
          }`}
        >
          <UpDownSwitchIcon
            className={`rotate-90 md:rotate-180 md:translate-y-[1px] w-full h-auto aspect-square transition-all ease-out duration-300 ${
              showRightButton ? "group-hover:scale-110" : "opacity-30"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
