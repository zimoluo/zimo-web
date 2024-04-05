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

export default function NotificationStylePicker({ className = "" }: Props) {
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
    <div className={`flex flex-col w-full ${className}`}>
      <div
        className="flex items-center cursor-pointer h-14 md:h-16"
        onClick={() => {
          pickStyle("banner");
        }}
      >
        <div className="flex-grow h-full flex items-center">
          <ToastCard
            title="Zimo Web"
            description="Notification text."
            className={`${notificationStylePickerStyle.card} text-sm md:text-sm`}
          />
        </div>
        <div className="ml-4 flex items-center">
          <p
            className={`text-sm md:text-base mr-3 ${
              settings.notificationStyle === "banner" ? "font-bold" : ""
            }`}
          >
            Banner
          </p>
          <RadioButton
            state={settings.notificationStyle === "banner"}
            onClick={() => {
              pickStyle("banner");
            }}
          />
        </div>
      </div>
      <div
        className="flex items-center cursor-pointer h-14 md:h-16"
        onClick={() => {
          pickStyle("toast");
        }}
      >
        <div className="flex-grow h-full flex items-center">
          <p className="text-neutral-50 text-opacity-90 bg-neutral-800 bg-opacity-70 px-4 py-1.5 rounded-3xl overflow-hidden text-sm">
            Notification text.
          </p>
        </div>
        <div className="ml-4 flex items-center">
          <p
            className={`text-sm md:text-base mr-3 ${
              settings.notificationStyle === "toast" ? "font-bold" : ""
            }`}
          >
            Toast
          </p>
          <RadioButton
            state={settings.notificationStyle === "toast"}
            onClick={() => {
              pickStyle("toast");
            }}
          />
        </div>
      </div>
      <div
        className="flex items-center cursor-pointer h-14 md:h-16"
        onClick={() => {
          pickStyle("disabled");
        }}
      >
        <div className="flex-grow h-full flex items-center"></div>
        <div className="ml-4 flex items-center">
          <p
            className={`text-sm md:text-base mr-3 ${
              settings.notificationStyle === "disabled" ? "font-bold" : ""
            }`}
          >
            Disabled
          </p>
          <RadioButton
            state={settings.notificationStyle === "disabled"}
            onClick={() => {
              pickStyle("disabled");
            }}
          />
        </div>
      </div>
    </div>
  );
}
