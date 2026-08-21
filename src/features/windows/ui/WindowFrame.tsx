"use client";

import { Suspense, createElement, useCallback, useMemo } from "react";
import { registerWindowElement, writeRect } from "../element-registry";
import { definitionOf, windowComponent } from "../definitions";
import type { KnownWindowId } from "../definitions";
import { zIndexOf } from "../model";
import type { WindowId, WindowInstance, WindowsState } from "../model";
import { selectMinimized, useWindows } from "../store";
import type { SnapCandidate } from "../geometry/solve-snap";
import type { Rect, Viewport } from "../geometry/types";
import { RESIZE_EDGES, useWindowDrag, useWindowResize } from "../use-window-gestures";
import type { GestureEnvironment } from "../use-window-gestures";
import styles from "./windows.module.css";

export type WindowFrameProps = {
  readonly instance: WindowInstance;
  readonly zIndex: number;
  readonly orderIndex: number;
  readonly readViewport: () => Viewport;
  readonly readOthers: () => readonly SnapCandidate[];
  readonly snapToWindows: boolean;
  readonly snapToViewport: boolean;
};

const ResizeHandle = ({
  environment,
  handle,
}: {
  readonly environment: GestureEnvironment;
  readonly handle: (typeof RESIZE_EDGES)[number];
}) => {
  const onPointerDown = useWindowResize(environment, handle.edge);

  return (
    <div
      className={styles.handle}
      data-edge={handle.key}
      style={{ cursor: handle.cursor }}
      onPointerDown={onPointerDown}
      role="separator"
      aria-label={`Resize from the ${handle.label}`}
    />
  );
};

export function WindowFrame({
  instance,
  zIndex,
  orderIndex,
  readViewport,
  readOthers,
  snapToWindows,
  snapToViewport,
}: WindowFrameProps) {
  const focus = useWindows((state) => state.focus);
  const close = useWindows((state) => state.close);
  const commitRect = useWindows((state) => state.commitRect);
  const minimized = useWindows(selectMinimized);

  const definition = definitionOf(instance.definitionId);

  const attach = useCallback(
    (element: HTMLDivElement | null) => {
      registerWindowElement(instance.id, element);
      if (element !== null) writeRect(instance.id, instance.rect);
    },
    [instance.id, instance.rect],
  );

  const environment = useMemo<GestureEnvironment>(
    () => ({
      id: instance.id,
      group: instance.group,
      orderIndex,
      constraints:
        definition?.geometry ?? { defaultSize: { width: 400, height: 300 } },
      anchor: "adaptive",
      snapToWindows,
      snapToViewport,
      readRect: (): Rect =>
        (useWindows.getState() as WindowsState).instances[instance.id]?.rect ??
        instance.rect,
      readViewport,
      readOthers,
      commit: (rect) => {
        commitRect(instance.id, rect);
      },
      onFocus: () => {
        focus(instance.id);
      },
    }),
    [
      commitRect,
      definition,
      focus,
      instance.group,
      instance.id,
      instance.rect,
      orderIndex,
      readOthers,
      readViewport,
      snapToViewport,
      snapToWindows,
    ],
  );

  const onBarPointerDown = useWindowDrag(environment);

  if (definition === undefined) return null;

  const chrome = definition.chrome;

  return (
    <div
      ref={attach}
      className={`${styles.frame} surface-window ${chrome.shadow === false ? "" : "shadow-xl"} ${chrome.edgeHighlight === true ? "surface-edge" : ""}`}
      style={{
        zIndex,
        translate: `${instance.rect.x}px ${instance.rect.y}px`,
        width: `${instance.rect.width}px`,
        height: `${instance.rect.height}px`,
      }}
      data-minimized={minimized ? "" : undefined}
      role="dialog"
      aria-label={definition.title}
      tabIndex={-1}
      onPointerDownCapture={() => {
        focus(instance.id);
      }}
    >
      <div className={`${styles.bar} text-text`} onPointerDown={onBarPointerDown}>
        <span className={styles.title}>{definition.title}</span>

        <button
          type="button"
          className="size-6 grid place-items-center rounded-full opacity-70 hover:opacity-100"
          aria-label={`Close ${definition.title}`}
          onClick={() => {
            close(instance.id);
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="size-3.5"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <Suspense fallback={<div className="size-full surface-panel" />}>
          {createElement(
            windowComponent(instance.definitionId as KnownWindowId),
            instance.props,
          )}
        </Suspense>
      </div>

      {RESIZE_EDGES.map((handle) => (
        <ResizeHandle key={handle.key} environment={environment} handle={handle} />
      ))}
    </div>
  );
}

export const frameZIndex = (state: WindowsState, id: WindowId): number =>
  zIndexOf(state, id);
