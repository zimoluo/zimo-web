"use client";

import { useShallow } from "zustand/react/shallow";
import { selectActive, useNotifications } from "../store";
import { NotificationCard } from "./NotificationCard";
import styles from "./notifications.module.css";

export function NotificationLayer() {
  const active = useNotifications(useShallow(selectActive));
  const dismiss = useNotifications((state) => state.dismiss);

  const urgent = active.some((notification) => notification.tone === "danger");

  return (
    <section
      className={styles.layer}
      role="region"
      aria-label="Notifications"
      aria-live={urgent ? "assertive" : "polite"}
      aria-relevant="additions"
    >
      {active.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onDismiss={dismiss}
        />
      ))}
    </section>
  );
}
