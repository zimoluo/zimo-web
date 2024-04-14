"use client";

import { enrichTextContent } from "@/lib/lightMarkUpProcessor";
import { ReactNode, useEffect, useRef, useState } from "react";
import ExpandCollapseIcon from "../assets/comment/ExpandCollapseIcon";

interface Props {
  title: string;
  content: ReactNode;
  className?: string;
}

export default function ExpandCollapseEntry({
  title,
  content,
  className = "",
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
    <section className={`text-base ${className}`}>
      <div
        className="w-full flex items-center mt-4 cursor-pointer"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <h3>{enrichTextContent(title)}</h3>
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
      <div style={columnStyle} ref={columnRef} className="mb-4 text-base">
        <div className="my-4">{content}</div>
      </div>
    </section>
  );
}
