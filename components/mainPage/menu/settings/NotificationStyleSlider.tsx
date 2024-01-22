"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import SettingsSlider from "./SettingsSlider";
import { useNextRenderEffect } from "@/lib/helperHooks";

export default function NotificationStyleSlider() {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const sendOutToast = useNextRenderEffect(() => {
    appendToast({
      title: "Settings",
      description: `Notification set to ${settings.notificationStyle}.`,
      icon: "settings",
    });
  }, [settings.notificationStyle]);

  return (
    <SettingsSlider
      setValue={(newValue: string | number) => {
        updateSettings({
          notificationStyle: newValue as typeof settings.notificationStyle,
        });
        sendOutToast();
      }}
      values={["disabled", "toast", "banner"]}
      text={["Disabled", "Toast", "Banner"]}
      entry={settings.notificationStyle}
    />
  );
}
