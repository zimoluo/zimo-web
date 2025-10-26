"use client";

import { useSettings } from "../contexts/SettingsContext";
import { useToast } from "../contexts/ToastContext";
import MobileDesktopEntryRenderer from "./MobileDesktopEntryRenderer";
import ToastCardColumnManager from "./ToastCardColumnManager";

export default function ToastBannerReceiver() {
  const { toast, removeGivenToast } = useToast();
  const { settings } = useSettings();

  return (
    <MobileDesktopEntryRenderer
      mobile={
        <div className="z-80 fixed left-1/2 -translate-x-1/2 top-[37px] sm:top-[41px] pointer-events-none">
          <ToastCardColumnManager
            toasts={toast}
            removeToast={removeGivenToast}
            dismissDirection="up"
            slotLimit={1}
          />
        </div>
      }
      desktop={
        <div className="z-80 fixed top-[70px] left-0 pointer-events-none">
          <ToastCardColumnManager
            toasts={toast}
            removeToast={removeGivenToast}
            dismissDirection="left"
            slotLimit={settings.toastBannerLimit}
          />
        </div>
      }
    />
  );
}
