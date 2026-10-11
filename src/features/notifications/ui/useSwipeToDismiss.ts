"use client";

import type { PointerEvent as ReactPointerEvent } from "react";
import { useDragGesture } from "../../../lib/gesture/use-drag-gesture";
import { dismissesOnRelease, swipeOpacity } from "../dismiss";

export type SwipeHandler = (event: ReactPointerEvent<HTMLElement>) => void;

type Swipe = { readonly card: HTMLElement; readonly width: number };

export function useSwipeToDismiss(onDismiss: () => void): SwipeHandler {
  const gesture = useDragGesture<Swipe>({
    axis: "x",

    onStart: (_pointer, element) => {
      element.dataset.dragging = "";
      return { card: element, width: element.getBoundingClientRect().width };
    },

    onMove: (_pointer, swipe, delta) => {
      swipe.card.style.translate = `${delta.x}px 0`;
      const opacity = swipeOpacity(delta.x, swipe.width);
      swipe.card.style.opacity = String(opacity);
      swipe.card.style.filter = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "none" : `blur(${(1 - opacity ** 2.5) * 7.5}px)`;
    },

    onEnd: (_pointer, swipe, delta) => {
      delete swipe.card.dataset.dragging;

      if (dismissesOnRelease(delta.x, swipe.width)) {
        swipe.card.style.translate = ""; swipe.card.style.opacity = ""; swipe.card.style.filter = "";
        onDismiss();
        return;
      }

      swipe.card.style.translate = "";
      swipe.card.style.opacity = "";
      swipe.card.style.filter = "";
    },
  });

  return gesture.onPointerDown;
}
