"use client";

import { Suspense, createElement, useCallback, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { overlayComponent, overlayTitle } from "../registry";
import type { Overlay, Scrim } from "../model";
import styles from "./overlays.module.css";

export type OverlayDialogProps = {
  readonly overlay: Overlay;
  readonly scrim: Scrim;
  readonly onDismiss: () => void;
  readonly onExpand: () => void;
};

export function OverlayDialog({
  overlay,
  scrim,
  onDismiss,
  onExpand,
}: OverlayDialogProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const element = dialog.current;
    if (element === null || element.open) return;
    element.showModal();
  }, []);

  const onBackdropClick = useCallback(
    (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) onDismiss();
    },
    [onDismiss],
  );

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-scrim={scrim}
      aria-label={overlayTitle(overlay.kind)}
      onClose={onDismiss}
      onClick={onBackdropClick}
    >
      <div className={`${styles.body} surface-overlay shadow-xl`}>
        <Suspense
          fallback={<div className={`${styles.skeleton} surface-panel`} />}
        >
          {createElement(overlayComponent(overlay.kind), overlay.props)}
        </Suspense>

        <div className={styles.cluster}>
          {overlay.expandTo !== undefined && (
            <Link
              href={overlay.expandTo}
              className={`${styles.clusterButton} surface-widget text-text`}
              aria-label="Open as a page"
              onClick={onExpand}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="size-4"
              >
                <path d="M14 4h6v6M20 4l-8 8M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
              </svg>
            </Link>
          )}

          <button
            type="button"
            className={`${styles.clusterButton} surface-widget text-text`}
            aria-label="Close"
            onClick={onDismiss}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-4"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </dialog>
  );
}
