"use client";

import { InlineMarks } from "../../document/components/InlineMarks";
import type { Notification } from "../model/queue";
import { useAutoDismiss } from "./useAutoDismiss";
import { useSwipeToDismiss } from "./useSwipeToDismiss";
import styles from "./notifications.module.css";
import { NotificationIconView } from "./NotificationIconView";

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
      <NotificationIconView
        icon={notification.icon}
        className={`${styles.icon} ${TONE_CLASS[notification.tone]}`}
      />

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
