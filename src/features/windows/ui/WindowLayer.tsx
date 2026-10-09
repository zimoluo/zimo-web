"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import type { SnapCandidate } from "../geometry/solve-snap";
import type { Viewport } from "../geometry/types";
import { zIndexOf } from "../model";
import type { WindowId } from "../model";
import { selectOrder, useWindows } from "../store";
import { insetsFrom, viewportOf } from "../viewport";
import { useSettings } from "../../settings";
import { migrateWindowLayout } from "../migrate";
import { definitionLookup } from "../definitions";
import { WindowFrame } from "./WindowFrame";
import styles from "./windows.module.css";

export type WindowLayerProps = {
  readonly snapToWindows?: boolean;
  readonly snapToViewport?: boolean;
};

export function WindowLayer({
  snapToWindows,
  snapToViewport,
}: WindowLayerProps) {
  const settingsSnap = useSettings((state) => state.windows.snapping);
  const settingsViewportSnap = useSettings((state) => state.windows.snapToViewport);
  const restoreOnLoad = useSettings((state) => state.windows.restoreOnLoad);
  const order = useWindows(useShallow(selectOrder));
  const layer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!useSettings.getState().windows.restoreOnLoad) return;
    try {
      if (localStorage.getItem("zw.windows") !== null) { void useWindows.persist.rehydrate(); return; }
      const legacy = localStorage.getItem("websiteSettings");
      if (legacy === null) return;
      const settings: unknown = JSON.parse(legacy);
      if (typeof settings !== "object" || settings === null || !("windowSaveData" in settings)) return;
      if ("disableWindowSaving" in settings && settings.disableWindowSaving === true) return;
      const result = migrateWindowLayout(settings.windowSaveData);
      if (result.layout === null) return;
      localStorage.setItem("zw.windows.legacy-backup", JSON.stringify(settings.windowSaveData));
      localStorage.setItem("zw.windows.migration-report", JSON.stringify({ issues: result.issues, count: result.layout.windows.length }));
      useWindows.getState().hydrate(result.layout, { width: window.innerWidth, height: window.innerHeight }, definitionLookup);
    } catch {}
  }, [restoreOnLoad]);

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
          snapToWindows={snapToWindows ?? settingsSnap}
          snapToViewport={snapToViewport ?? settingsViewportSnap}
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

const FrameSlot = memo(function FrameSlot({
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
});
