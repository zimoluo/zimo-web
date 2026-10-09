"use client";

import { useEffect } from "react";
import { settingsStore } from "../../settings";
import { useNotifications } from "../store";
import { NotificationLayer } from "./NotificationLayer";

export function NotificationHost() {
  useEffect(() => settingsStore.subscribe(
    (state) => state.notifications,
    (preferences) => useNotifications.getState().configure(
      preferences.limit, preferences.style !== "off",
    ),
    { fireImmediately: true },
  ), []);
  return <NotificationLayer />;
}
