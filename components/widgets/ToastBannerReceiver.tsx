"use client";

import { useToast } from "../contexts/ToastContext";
import MobileDesktopEntryRenderer from "./MobileDesktopEntryRenderer";
import ToastCardColumnManager from "./ToastCardColumnManager";

export default function ToastBannerReceiver() {
  const { toast, removeGivenToast } = useToast();

  return (
    <MobileDesktopEntryRenderer
      mobile={
        <div className="z-80 fixed left-1/2 -translate-x-1/2 top-0 pointer-events-none">
          <ToastCardColumnManager
            toasts={toast}
            removeToast={removeGivenToast}
            dismissDirection="up"
            slotLimit={1}
          />
        </div>
      }
      desktop={
        <div className="z-80 fixed top-12 left-0 pointer-events-none">
          <ToastCardColumnManager
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
