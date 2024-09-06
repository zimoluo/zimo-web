"use client";

import { useState, useEffect, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  isVisible: boolean;
  timeout: number;
  duration?: number;
  cardHeight?: string;
};

export default function SearchCardWrapper({
  children,
  isVisible,
  timeout,
  duration = 280,
  cardHeight = "18.75rem",
}: Props) {
  const [displayMaxHeight, setDisplayMaxHeight] = useState(cardHeight);
  const [scale, setScale] = useState("1");

  useEffect(() => {
    const handleAnimation = () => {
      if (isVisible) {
        setScale("1");
        setDisplayMaxHeight(cardHeight);
      } else {
        setScale("0.85");
        setDisplayMaxHeight("0px");
      }
    };

    const timer = setTimeout(handleAnimation, timeout);
    return () => clearTimeout(timer);
  }, [isVisible, timeout]);

  const defaultStyle = {
    maxHeight: displayMaxHeight,
    transition: `max-height ${duration / 1000}s ease-in-out, transform ${
      duration / 1000
    }s ease-in-out`,
    transform: `scale(${scale})`,
  };

  return (
    <div style={defaultStyle} className="overflow-hidden px-4 -mx-4">
      <div className="my-4">{children}</div>
    </div>
  );
}
