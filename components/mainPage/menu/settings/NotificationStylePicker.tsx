"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import RadioButton from "./RadioButton";
import notificationPreviewStyle from "./notification-preview.module.css";
import { useNextRenderEffect } from "@/lib/helperHooks";
import { useToast } from "@/components/contexts/ToastContext";
import NotificationPreview from "./NotificationPreview";

interface Props {
  className?: string;
}

interface NotificationOptionProps {
  style: NotificationStyle;
  children?: React.ReactNode;
}

const NotificationOption = ({ style, children }: NotificationOptionProps) => {
  const { settings, updateSettings } = useSettings();
  const { appendToast } = useToast();

  const pickStyle = (style: NotificationStyle) => {
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
      className={`flex flex-col md:flex-row flex-grow md:flex-grow-0 justify-center items-center cursor-pointer md:h-20 ${notificationPreviewStyle.container}`}
      onClick={() => {
        if (settings.notificationStyle !== style) {
          pickStyle(style);
        }
      }}
    >
      <div className="flex-grow h-full flex items-center mb-2 md:mb-0">
        {children}
      </div>
      <div className="md:ml-4 flex flex-col md:flex-row items-center">
        <p
          className={`text-sm md:text-base md:mr-3 mb-1 md:mb-0 ${
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
    <div
      className={`grid grid-cols-3 md:flex md:flex-col w-full md:gap-4 ${className}`}
    >
      {["banner", "toast", "disabled"].map((style) => (
        <NotificationOption key={style} style={style as NotificationStyle}>
          <NotificationPreview
            className="h-20 md:h-full w-12 md:w-32"
            mode={style as NotificationStyle}
          />
        </NotificationOption>
      ))}
    </div>
  );
}
