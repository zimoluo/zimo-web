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

// Helper function to get initial state safely on the client
const getInitialState = (): BallPosition => {
  // just in case of SSR. although the animated background engine should only run on client
  if (typeof window === "undefined") {
    return { x: 0, y: 0, dx: 1, dy: 1, speed: 120 };
  }

  return {
    x: randomIntFromRange(
      5 + ballDimension,
      window.innerWidth - ballDimension - 5
    ),
    y: randomIntFromRange(
      5 + ballDimension,
      window.innerHeight - ballDimension - 5
    ),
    dx: randomIntFromRange(0, 1) * 2 - 1, // -1 or 1
    dy: randomUniform(0.8, 1.25),
    speed: randomUniform(120, 150),
  };
};

export default function BouncingCircle() {
  // Use a lazy initializer function for useState
  // This runs only once on mount and ensures `window` is available
  const [ballPosition, setBallPosition] =
    useState<BallPosition>(getInitialState);
  const lastTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updatePosition = (deltaTime: number) => {
    setBallPosition((prevPosition) => {
      let newX =
        prevPosition.x + prevPosition.dx * prevPosition.speed * deltaTime;
      let newY =
        prevPosition.y + prevPosition.dy * prevPosition.speed * deltaTime;
      let newDx = prevPosition.dx;
      let newDy = prevPosition.dy;

      if (newX > window.innerWidth - ballDimension) {
        newX = window.innerWidth - ballDimension;
        newDx *= -1;
      } else if (newX < 0) {
        newX = 0;
        newDx *= -1;
      }

      if (newY > window.innerHeight - ballDimension) {
        newY = window.innerHeight - ballDimension;
        newDy *= -1;
      } else if (newY < 0) {
        newY = 0;
        newDy *= -1;
      }

      return { ...prevPosition, x: newX, y: newY, dx: newDx, dy: newDy };
    });
  };

  const adjustPositionForWindowSize = useCallback(() => {
    setBallPosition((prevPosition) => {
      let newX = prevPosition.x;
      let newY = prevPosition.y;

      if (newX > window.innerWidth - ballDimension) {
        newX = window.innerWidth - ballDimension;
      } else if (newX < 0) {
        newX = 0;
      }

      if (newY > window.innerHeight - ballDimension) {
        newY = window.innerHeight - ballDimension;
      } else if (newY < 0) {
        newY = 0;
      }

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

        // Prevents massive jumps when tab loses focus.
        // Cap at around 60fps
        const clampedDeltaTime = Math.min(deltaTime, 0.1);

        updatePosition(clampedDeltaTime);
      }
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // runs only once

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
