"use client";

import { useToast } from "../contexts/ToastContext";
import MobileDesktopEntryRenderer from "./MobileDesktopEntryRenderer";
import ToastCardManager from "./ToastCardManager";

export default function ToastBannerReceiver() {
  const { toast, removeGivenToast } = useToast();

  return (
    <MobileDesktopEntryRenderer
      mobile={
        <div className="z-50 fixed left-1/2 -translate-x-1/2 top-4 md:hidden">
          <ToastCardManager
            toasts={toast}
            removeToast={removeGivenToast}
            dismissDirection="up"
            slotLimit={1}
          />
        </div>
      }
      desktop={
        <div className="z-50 fixed top-12 left-4 hidden md:block">
          <ToastCardManager
            toasts={toast}
            removeToast={removeGivenToast}
            dismissDirection="left"
            slotLimit={3}
          />
        </div>
      }
    />
  );
}
