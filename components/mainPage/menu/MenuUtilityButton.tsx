"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import { useUser } from "@/components/contexts/UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import {
  clearSessionToken,
  deleteUserAccount,
} from "@/lib/dataLayer/client/accountStateCommunicator";
import { useState } from "react";

type Props = {
  utility: MenuUtility;
  needsConfirm?: boolean;
};

const utilityTextMap: Record<string, string> = {
  logOut: "Log Out",
  resetSettings: "Reset Settings to Default",
  deleteAccount: "Delete My Account",
};

const utilityToastMap: Record<string, ToastEntry | null> = {
  logOut: null,
  resetSettings: {
    title: "Zimo Web",
    description: "All settings have been reset.",
  },
  deleteAccount: null,
};

export default function MenuUtilityButton({
  utility,
  needsConfirm = false,
}: Props) {
  const { user, setUser } = useUser();
  const { appendToast } = useToast();
  const { updateSettings } = useSettings();
  const [isInvoked, setIsInvoked] = useState(false);
  const [isInvokedVisible, setIsInvokedVisible] = useState(false);
  const [isImmediatelyTriggered, setIsImmediatelyTriggered] = useState(false);

  const utilityFunctionMap: { [key: string]: () => void } = {
    logOut,
    resetSettings,
    deleteAccount,
  };

  function resetSettings() {
    const { syncSettings, ...defaultSettingsWithoutSync } = defaultSettings;
    updateSettings(defaultSettingsWithoutSync);
  }

  async function logOut(): Promise<void> {
    await clearSessionToken();
    setUser(null);
  }

  async function deleteAccount(): Promise<void> {
    const sub = user?.sub;
    const state = user?.state;
    if (!sub) return;
    if (!state || state === "banned") {
      appendToast({
        title: "Zimo Web",
        description: "Banned users cannot delete their account.",
      });
      return;
    }
    await deleteUserAccount(sub);
    await clearSessionToken();
    await logOut();
  }

  function performAction() {
    utilityFunctionMap[utility]();
    if (utilityToastMap[utility]) {
      appendToast(utilityToastMap[utility] as ToastEntry);
    }
  }

  function evaluateClick() {
    if (!needsConfirm) {
      performAction();
      return;
    }

    if (isImmediatelyTriggered || isInvoked || isInvokedVisible) return;

    setIsImmediatelyTriggered(true);
    setTimeout(() => {
      setIsInvoked(true);
    }, 300);
    setTimeout(() => {
      setIsInvokedVisible(true);
    }, 320);
  }

  function restoreInvocation() {
    if (!isImmediatelyTriggered || !isInvoked || !isInvokedVisible) return;

    setIsInvokedVisible(false);
    setTimeout(() => {
      setIsInvoked(false);
    }, 300);
    setTimeout(() => {
      setIsImmediatelyTriggered(false);
    }, 320);
  }

  function confirmAction() {
    performAction();
    restoreInvocation();
  }

  return (
    <button
      onClick={evaluateClick}
      className="w-full h-10 my-2 text-base md:text-lg"
    >
      <div
        className={`${needsConfirm && isInvoked ? "hidden" : ""} ${
          needsConfirm && isImmediatelyTriggered ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300 ease-in-out`}
      >
        {utilityTextMap[utility]}
      </div>
      {needsConfirm && (
        <div
          className={`${
            isInvoked ? "" : "hidden pointer-events-none select-none"
          } ${
            isInvokedVisible ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300 ease-in-out flex items-center justify-center h-full`}
        >
          <div
            className="w-1/2"
            role={isInvoked ? "button" : undefined}
            onClick={isInvoked ? restoreInvocation : () => {}}
          >
            Cancel
          </div>
          <div className="border-primary border-x-0.6 h-2/3 opacity-20 shrink-0" />
          <div
            className="w-1/2"
            role={isInvoked ? "button" : undefined}
            onClick={isInvoked ? confirmAction : () => {}}
          >
            Confirm
          </div>
        </div>
      )}
    </button>
  );
}
