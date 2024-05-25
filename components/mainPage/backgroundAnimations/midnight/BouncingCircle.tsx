"use client";

import { randomIntFromRange, randomUniform } from "@/lib/generalHelper";
import React, { useState, useEffect, useCallback } from "react";

interface BallPosition {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

const ballDimension = 180;

export default function BouncingCircle() {
  const [ballPosition, setBallPosition] = useState<BallPosition>({
    x: randomIntFromRange(
      5 + ballDimension,
      window.innerWidth - ballDimension - 5
    ),
    y: randomIntFromRange(
      5 + ballDimension,
      window.innerHeight - ballDimension - 5
    ),
    dx: randomIntFromRange(0, 1) * 2 - 1,
    dy: randomUniform(0.8, 1.25),
    speed: randomUniform(1.8, 2.2),
  });

  const updatePosition = () => {
    setBallPosition((prevPosition) => {
      let newX = prevPosition.x + prevPosition.dx * prevPosition.speed;
      let newY = prevPosition.y + prevPosition.dy * prevPosition.speed;
      let newDx = prevPosition.dx;
      let newDy = prevPosition.dy;

      if (newX > window.innerWidth - ballDimension || newX < 0) newDx *= -1;
      if (newY > window.innerHeight - ballDimension || newY < 0) newDy *= -1;

      return { ...prevPosition, x: newX, y: newY, dx: newDx, dy: newDy };
    });
  };

  const adjustPositionForWindowSize = useCallback(() => {
    setBallPosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;

      if (newX > window.innerWidth - ballDimension)
        newX = window.innerWidth - ballDimension;
      if (newY > window.innerHeight - ballDimension)
        newY = window.innerHeight - ballDimension;

      return { ...prevPosition, x: newX, y: newY };
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustPositionForWindowSize);
    return () =>
      window.removeEventListener("resize", adjustPositionForWindowSize);
  }, [adjustPositionForWindowSize]);

  useEffect(() => {
    const handle = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(handle);
  }, [ballPosition]);

  return (
    <div
      aria-hidden="true"
      className="rounded-full fixed -z-10 select-none pointer-events-none"
      style={{
        width: `${ballDimension / 16}rem`,
        height: `${ballDimension / 16}rem`,
        left: `${ballPosition.x / 16}rem`,
        top: `${ballPosition.y / 16}rem`,
        backgroundColor: "rgb(249 250 251)",
      }}
    />
  );
}
