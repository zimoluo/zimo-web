"use client";

import { exitSurface } from "../../../lib/motion/exit-surface";
import { WINDOW_BAR_HEIGHT, WINDOW_BAR_OVERHANG, windowBarOffset, resizeViewport } from "../chrome";

import { Suspense, createElement, useCallback, useEffect, useMemo, useRef } from "react";
import { registerWindowElement } from "../element-registry";
import { definitionOf, windowComponent } from "../definitions";
import type { KnownWindowId } from "../definitions";
import { zIndexOf } from "../model";
import type { WindowId, WindowInstance, WindowsState } from "../model";
import { selectMinimized, useWindows } from "../store";
import { WindowIdentityProvider } from "../window-identity";
import { getWindowElement } from "../element-registry";
import { solveDrag, solveResize } from "../geometry/solve-resize";
import { useSettings } from "../../settings";
import type { CSSProperties, KeyboardEvent } from "react";
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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const identity = useMemo(() => ({ id: instance.id, contentRef }), [instance.id]);
  const resizeBehavior = useSettings((state) => state.windows.resizeBehavior);
  useEffect(() => {
    const opener = document.activeElement;
    const frame = getWindowElement(instance.id);
    frame?.focus();
    return () => { if (opener instanceof HTMLElement && opener.isConnected) opener.focus(); };
  }, [instance.id]);
  const keyboardMove = (event: KeyboardEvent<HTMLButtonElement>) => {
    const delta = { x: event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0, y: event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0 };
    if (delta.x === 0 && delta.y === 0) return;
    event.preventDefault();
    const amount = event.shiftKey ? 10 : 1;
    const input = { start: useWindows.getState().instances[instance.id]?.rect ?? instance.rect, delta: {x: delta.x * amount, y: delta.y * amount}, viewport: readViewport() };
    const rect = event.altKey && definition !== undefined
      ? solveResize({ ...input, viewport: resizeViewport(input.viewport), edge: { horizontal: 1, vertical: 1 }, constraints: definition.geometry, anchor: "corner", lockAspect: false })
      : solveDrag({ ...input, dragBarHeight: WINDOW_BAR_HEIGHT, dragBarOffset: windowBarOffset(input.start.height), grabMargin: Math.min(input.start.width, input.start.width / 2 + 80) });
    commitRect(instance.id, rect);
  };

  const attach = useCallback(
    (element: HTMLDivElement | null) => {
      registerWindowElement(instance.id, element);

    },
    [instance.id],
  );

  const environment = useMemo<GestureEnvironment>(
    () => ({
      id: instance.id,
      group: instance.group,
      orderIndex,
      constraints:
        definition?.geometry ?? { defaultSize: { width: 400, height: 300 } },
      anchor: resizeBehavior,
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
      resizeBehavior,
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
      className={`${styles.frame} surface-widget ${chrome.shadow === false ? "" : "shadow-xl"} ${chrome.edgeHighlight === true ? "surface-edge" : ""}`}
      style={{
        zIndex,
        translate: `${instance.rect.x}px ${instance.rect.y}px`,
        width: `${instance.rect.width}px`,
        height: `${instance.rect.height}px`,
        "--zw-window-radius": chrome.cornerRadius === undefined ? undefined : `${chrome.cornerRadius}px`,
        overflow: "visible",
        contain: "layout",
      } as CSSProperties}
      data-minimized={minimized ? "" : undefined}
      role="dialog"
      aria-label={definition.title}
      aria-modal={false}
      inert={minimized}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "Escape" && useWindows.getState().order.at(-1) === instance.id) { event.preventDefault(); event.stopPropagation(); exitSurface(getWindowElement(instance.id), () => close(instance.id)); }
      }}
      onFocusCapture={() => focus(instance.id)}
      onPointerDownCapture={() => {
        focus(instance.id);
      }}
    >
      <div className={`${styles.bar} text-text`}>
        <button type="button" className={`${styles.title} surface-widget surface-edge`} aria-label={`Move ${definition.title}; Alt and arrow keys resize`} onPointerDown={onBarPointerDown} onKeyDown={keyboardMove}>{definition.title}</button>
        {definition.geometry.allowFullscreen && <button type="button" className={`${styles.maximize} surface-widget surface-edge`} aria-label={`Maximize ${definition.title}`} onClick={() => {
          const viewport = readViewport();
          commitRect(instance.id, { x: viewport.insets.left, y: viewport.insets.top, width: viewport.width - viewport.insets.left - viewport.insets.right, height: viewport.height - viewport.insets.top - viewport.insets.bottom - WINDOW_BAR_OVERHANG });
        }}>□</button>}

        <button
          type="button"
          className={`${styles.close} surface-widget surface-edge`}
          aria-label={`Close ${definition.title}`}
          onClick={() => {
            exitSurface(getWindowElement(instance.id), () => close(instance.id));
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

      <div className={styles.content} ref={contentRef} style={{ overflow: chrome.overflow === "visible" ? "visible" : "auto" }}>
        <WindowIdentityProvider identity={identity}>
        <Suspense fallback={<div className="size-full surface-widget" />}>
          {createElement(
            windowComponent(instance.definitionId as KnownWindowId),
            instance.props,
          )}
        </Suspense>
        </WindowIdentityProvider>
      </div>

      {RESIZE_EDGES.map((handle) => (
        <ResizeHandle key={handle.key} environment={environment} handle={handle} />
      ))}
    </div>
  );
}

export const frameZIndex = (state: WindowsState, id: WindowId): number =>
  zIndexOf(state, id);
