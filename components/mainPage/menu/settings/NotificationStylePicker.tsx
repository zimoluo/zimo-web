"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import RadioButton from "./RadioButton";
import notificationStylePickerStyle from "./notification-style-picker.module.css";
import ToastCard from "@/components/widgets/ToastCard";
import { useNextRenderEffect } from "@/lib/helperHooks";
import { useToast } from "@/components/contexts/ToastContext";

interface Props {
  className?: string;
}

interface NotificationOptionProps {
  style: "banner" | "toast" | "disabled";
  children?: React.ReactNode;
}

const NotificationOption = ({ style, children }: NotificationOptionProps) => {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const pickStyle = (style: "banner" | "toast" | "disabled") => {
    if (settings.notificationStyle === style) return;

    updateSettings({ notificationStyle: style });
    sendOutToast();
  };

  const sendOutToast = useNextRenderEffect(() => {
    appendToast({
      title: "Settings",
      description: `Notification set to ${settings.notificationStyle}.`,
      icon: "settings",
    });
  }, [settings.notificationStyle]);

  return (
    <div
      className="flex items-center cursor-pointer h-14 md:h-16"
      onClick={() => {
        if (settings.notificationStyle !== style) {
          pickStyle(style);
        }
      }}
    >
      <div className="flex-grow h-full flex items-center">{children}</div>
      <div className="ml-4 flex items-center">
        <p
          className={`text-sm md:text-base mr-3 ${
            settings.notificationStyle === style ? "font-bold" : ""
          }`}
        >
          {style.charAt(0).toUpperCase() + style.slice(1)}
        </p>
        <RadioButton
          state={settings.notificationStyle === style}
          onClick={() => pickStyle(style)}
        />
      </div>
    </div>
  );
};

export default function NotificationStylePicker({ className = "" }: Props) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <NotificationOption style="banner">
        <ToastCard
          title="Settings"
          icon="settings"
          description="Notification text."
          className={`${notificationStylePickerStyle.card} text-sm md:text-sm`}
        />
      </NotificationOption>
      <NotificationOption style="toast">
        <p className="text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-70 px-4 py-1.5 rounded-3xl overflow-hidden text-sm">
          Notification text.
        </p>
      </NotificationOption>
      <NotificationOption style="disabled" />
    </div>
  );
}
