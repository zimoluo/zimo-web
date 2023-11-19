"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  isVisible: boolean;
  timeout: number;
  duration?: number;
};

export default function SearchCardWrapper({
  children,
  isVisible,
  timeout,
  duration = 280,
}: Props) {
  const [displayMaxHeight, setDisplayMaxHeight] = useState("18.75rem");
  const [scale, setScale] = useState("1");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAnimation = () => {
      if (isVisible) {
        setScale("1");
        setDisplayMaxHeight("18.75rem");
      } else {
        setScale("0.85");
        setDisplayMaxHeight("0rem");
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
    <div
      style={defaultStyle}
      className="overflow-hidden px-4 -mx-4"
      ref={cardRef}
    >
      <div className="my-4">{children}</div>
    </div>
  );
}
