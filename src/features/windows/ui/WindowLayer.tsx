"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import type { SnapCandidate } from "../geometry/solve-snap";
import type { Viewport } from "../geometry/types";
import { zIndexOf } from "../model";
import type { WindowId } from "../model";
import { selectOrder, useWindows } from "../store";
import { insetsFrom, viewportOf } from "../viewport";
import { WindowFrame } from "./WindowFrame";
import styles from "./windows.module.css";

export type WindowLayerProps = {
  readonly snapToWindows?: boolean;
  readonly snapToViewport?: boolean;
};

export function WindowLayer({
  snapToWindows = true,
  snapToViewport = true,
}: WindowLayerProps) {
  const order = useWindows(useShallow(selectOrder));
  const layer = useRef<HTMLDivElement | null>(null);
  const [, forceMeasure] = useState(0);

  useEffect(() => {
    const onResize = (): void => {
      forceMeasure((count) => count + 1);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const readViewport = useCallback(
    (): Viewport =>
      viewportOf(
        { width: window.innerWidth, height: window.innerHeight },
        insetsFrom(layer.current),
      ),
    [],
  );

  const readOthers = useCallback((): readonly SnapCandidate[] => {
    const state = useWindows.getState();

    return state.order.flatMap((id, index) => {
      const instance = state.instances[id];
      return instance === undefined
        ? []
        : [
            {
              id,
              rect: instance.rect,
              group: instance.group,
              orderIndex: index,
            },
          ];
    });
  }, []);

  return (
    <div ref={layer} className={styles.layer}>
      {order.map((id: WindowId, index) => (
        <FrameSlot
          key={id}
          id={id}
          orderIndex={index}
          readViewport={readViewport}
          readOthers={readOthers}
          snapToWindows={snapToWindows}
          snapToViewport={snapToViewport}
        />
      ))}
    </div>
  );
}

type FrameSlotProps = {
  readonly id: WindowId;
  readonly orderIndex: number;
  readonly readViewport: () => Viewport;
  readonly readOthers: () => readonly SnapCandidate[];
  readonly snapToWindows: boolean;
  readonly snapToViewport: boolean;
};

function FrameSlot({
  id,
  orderIndex,
  readViewport,
  readOthers,
  snapToWindows,
  snapToViewport,
}: FrameSlotProps) {
  const instance = useWindows((state) => state.instances[id]);
  const zIndex = useWindows((state) => zIndexOf(state, id));

  if (instance === undefined) return null;

  return (
    <WindowFrame
      instance={instance}
      zIndex={zIndex}
      orderIndex={orderIndex}
      readViewport={readViewport}
      readOthers={readOthers}
      snapToWindows={snapToWindows}
      snapToViewport={snapToViewport}
    />
  );
}
