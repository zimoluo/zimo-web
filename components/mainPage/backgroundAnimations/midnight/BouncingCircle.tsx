"use client";

import { randomIntFromRange, randomUniform } from "@/lib/generalHelper";
import { useState, useEffect, useCallback, useRef } from "react";

interface BallPosition {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number; // pixels per second
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
    speed: randomUniform(180, 220),
  });

  const lastTimeRef = useRef<number | null>(null);

  const updatePosition = (deltaTime: number) => {
    setBallPosition((prevPosition) => {
      let newX =
        prevPosition.x + prevPosition.dx * prevPosition.speed * deltaTime;
      let newY =
        prevPosition.y + prevPosition.dy * prevPosition.speed * deltaTime;
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
    const loop = (time: number) => {
      if (lastTimeRef.current != null) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        updatePosition(deltaTime);
      }
      lastTimeRef.current = time;
      requestAnimationFrame(loop);
    };
    const handle = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="rounded-full fixed -z-10 select-none pointer-events-none"
      style={{
        width: `${ballDimension}px`,
        height: `${ballDimension}px`,
        left: `${ballPosition.x}px`,
        top: `${ballPosition.y}px`,
        backgroundColor: "rgb(249 250 251)",
      }}
    />
  );
}
