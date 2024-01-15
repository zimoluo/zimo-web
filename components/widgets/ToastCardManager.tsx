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
  slotLimit = 5,
  dismissDirection = "left",
}: Props) {
  const [activeToasts, setActiveToasts] = useState<ToastEntry[]>([]);

  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  useEffect(() => {
    if (!(activeToasts.length < slotLimit) || !(toasts.length > 0)) {
      return;
    }

    const updatedToasts = [...activeToasts, toasts[0]];

    setActiveToasts(updatedToasts);
    removeToast(0);
  }, [toasts, activeToasts, slotLimit, removeToast]);

  const deactivateToast = (index: number) => {
    let newActiveToasts = [...activeToasts];
    if (toastsRef.current.length > 0) {
      newActiveToasts.splice(index, 1);
      newActiveToasts.push(toastsRef.current[0]);
      removeToast(0);
    } else {
      newActiveToasts.splice(index, 1);
    }
    setActiveToasts(newActiveToasts);
  };

  return (
    <div>
      {activeToasts.map((toast, index) =>
        toast ? (
          <div key={toast.id || index}>
            <ToastCardMember
              dismissDirection={dismissDirection}
              onDismiss={() => deactivateToast(index)}
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
