"use client";

import { useState, useEffect, useRef } from "react";
import ToastCard from "./ToastCard";
import ToastCardMember from "./ToastCardMember";

interface Props {
  toasts: ToastEntry[];
  removeToast: (index: number) => void;
  slotLimit?: number;
  dismissDirection?: "up" | "down" | "left" | "right";
}

export default function ToastCardManager({
  toasts,
  removeToast,
  slotLimit = 8,
  dismissDirection = "left",
}: Props) {
  const [activeToasts, setActiveToasts] = useState<(ToastEntry | null)[]>(
    new Array(slotLimit).fill(null)
  );

  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  useEffect(() => {
    const nonNullToasts = activeToasts.filter((toast) => toast !== null);
    if (!(nonNullToasts.length < slotLimit) || !(toasts.length > 0)) {
      return;
    }

    const updatedToasts = [...activeToasts];
    const firstNullIndex = updatedToasts.indexOf(null);

    if (firstNullIndex === -1) {
      return;
    }

    updatedToasts[firstNullIndex] = toasts[0];
    setActiveToasts(updatedToasts);
    removeToast(0);
  }, [toasts, activeToasts, slotLimit, removeToast]);

  const deactivateToast = (index: number) => {
    let newActiveToasts = [...activeToasts];
    if (toastsRef.current.length > 0) {
      newActiveToasts[index] = toastsRef.current[0];
      removeToast(0);
      console.log(newActiveToasts);
    } else {
      newActiveToasts[index] = null;
    }
    setActiveToasts(newActiveToasts);
  };

  return (
    <div>
      {activeToasts.map((toast, index) =>
        toast ? (
          <div
            key={`${toast.title}-${index}${
              toast.description ? `-${toast.description}` : ""
            }`}
          >
            <ToastCardMember
              dismissDirection={dismissDirection}
              deactivateToast={() => deactivateToast(index)}
            >
              <ToastCard {...toast} />
            </ToastCardMember>
          </div>
        ) : (
          <div
            key={`null-${index}`}
            className="pointer-events-none select-none w-0 h-0"
          />
        )
      )}
    </div>
  );
}
