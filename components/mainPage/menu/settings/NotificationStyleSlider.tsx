"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import { useState, useEffect } from "react";
import SettingsSlider from "./SettingsSlider";

export default function NotificationStyleSlider() {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const [notificationStyle, setNotificationStyle] =
    useState<typeof settings.notificationStyle>("disabled");
  const [hasSentNotificationToast, setHasSentNotificationToast] =
    useState(false);

  useEffect(() => {
    if (hasSentNotificationToast) {
      return;
    }
    if (notificationStyle === "disabled") {
      return;
    }

    setHasSentNotificationToast(true);

    appendToast({
      title: "Zimo Web",
      description: `Notification set to ${notificationStyle}.`,
    });
  }, [notificationStyle, appendToast, hasSentNotificationToast]);

  return (
    <SettingsSlider
      setValue={(newValue: string | number) => {
        updateSettings({
          notificationStyle: newValue as typeof settings.notificationStyle,
        });
        setNotificationStyle(newValue as typeof settings.notificationStyle);
        setHasSentNotificationToast(false);
      }}
      values={["disabled", "toast", "banner"]}
      text={["Disabled", "Toast", "Banner"]}
      entry={settings.notificationStyle}
    />
  );
}
