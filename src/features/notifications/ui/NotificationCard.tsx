"use client";

import { InlineMarks } from "../../document/components/InlineMarks";
import type { Notification } from "../model/queue";
import { useAutoDismiss } from "./useAutoDismiss";
import { useSwipeToDismiss } from "./useSwipeToDismiss";
import styles from "./notifications.module.css";

const TONE_ICON: Readonly<Record<Notification["tone"], string>> = {
  neutral: "M12 8v8m0 0h.01",
  success: "M5 13l4 4L19 7",
  warning: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  danger: "M12 9v4m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
};

const TONE_CLASS: Readonly<Record<Notification["tone"], string>> = {
  neutral: "text-text",
  success: "text-accent",
  warning: "text-accent",
  danger: "text-brand",
};

export type NotificationCardProps = {
  readonly notification: Notification;
  readonly onDismiss: (id: Notification["id"]) => void;
};

export function NotificationCard({
  notification,
  onDismiss,
}: NotificationCardProps) {
  const dismiss = (): void => {
    onDismiss(notification.id);
  };

  const timer = useAutoDismiss(notification.duration, dismiss);
  const onPointerDown = useSwipeToDismiss(dismiss);

  return (
    <div
      className={`${styles.card} surface-overlay shadow-md text-sm`}
      data-exiting={notification.exiting === true ? "" : undefined}
      onPointerDown={onPointerDown}
      onPointerEnter={timer.pause}
      onPointerLeave={timer.resume}
      onFocusCapture={timer.pause}
      onBlurCapture={timer.resume}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${styles.icon} ${TONE_CLASS[notification.tone]}`}
      >
        <path d={TONE_ICON[notification.tone]} />
      </svg>

      <div className={styles.text}>
        <p className={styles.title}>
          <InlineMarks>{notification.title}</InlineMarks>
        </p>

        {notification.body !== undefined && (
          <p className={`${styles.body} text-text-muted`}>
            <InlineMarks>{notification.body}</InlineMarks>
          </p>
        )}

        {notification.action !== undefined && (
          <a className={`${styles.action} text-accent`} href={notification.action.href}>
            {notification.action.label}
          </a>
        )}
      </div>

      <button
        type="button"
        className={`${styles.close} text-text`}
        onClick={dismiss}
        aria-label={`Dismiss: ${notification.title}`}
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
  );
}
