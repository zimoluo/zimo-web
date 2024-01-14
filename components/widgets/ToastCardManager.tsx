"use client";

import { useMemo } from "react";
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
  slotLimit = 3,
  dismissDirection = "left",
}: Props) {
  const toastStateArray: boolean[] = useMemo(() => {
    return Array.from(
      { length: toasts.length },
      (_, index) => index < slotLimit
    );
  }, [toasts.length, slotLimit]);

  return (
    <div>
      {toasts.map((toast, index) => (
        <div key={index}>
          <ToastCardMember
            dismissDirection={dismissDirection}
            isActive={toastStateArray[index]}
            deactivateToast={() => {
              removeToast(index);
            }}
          >
            <ToastCard {...toast} />
          </ToastCardMember>
        </div>
      ))}
    </div>
  );
}
