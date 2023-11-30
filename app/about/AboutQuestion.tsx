"use client";

import { useEffect, useRef, useState } from "react";
import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import ExpandCollapseIcon from "@/components/images/comment/ExpandCollapseIcon";

type Props = {
  question: string;
  description: string;
  index?: number;
};

export default function AboutQuestion({
  question,
  description,
  index = 0,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const columnRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0rem");

  useEffect(() => {
    const handleResize = () => {
      if (columnRef.current) {
        const height = columnRef.current.scrollHeight;
        setMaxHeight(`${height / 16}rem`);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [columnRef]);

  const columnStyle = {
    overflow: "hidden",
    maxHeight: isExpanded ? maxHeight : "0rem",
    transition: "max-height 0.3s ease-out",
  };

  return (
    <section
      className={`${
        index !== 0 ? "border-t" : ""
      } border-saturated border-opacity-20 text-base md:text-lg`}
    >
      <div
        className="w-full flex items-center mt-4 cursor-pointer"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <h2>{enrichTextContent(question)}</h2>
        <div className="flex-grow flex items-center justify-end ml-6 md:ml-10 flex-shrink-0">
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <ExpandCollapseIcon
              className={`h-5 md:h-6 w-auto aspect-square transition-transform duration-300 hover:scale-110 ${
                isExpanded ? "-rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
      </div>
      <div
        style={columnStyle}
        ref={columnRef}
        className="mb-4 text-base md:text-lg text-saturated text-opacity-90"
      >
        <p className="my-4">{enrichTextContent(description)}</p>
      </div>
    </section>
  );
}
