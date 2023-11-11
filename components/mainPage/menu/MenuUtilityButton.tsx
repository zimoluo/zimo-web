"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useUser } from "@/components/contexts/UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import {
  clearSessionToken,
  deleteUserAccount,
} from "@/lib/dataLayer/client/accountStateCommunicator";
import { removeAllCachedUserData } from "@/lib/dataLayer/client/commentClientLogic";
import { useState } from "react";

type Props = {
  utility: MenuUtility;
  needsConfirm?: boolean;
};

export default function MenuUtilityButton({
  utility,
  needsConfirm = false,
}: Props) {
  const { user, setUser } = useUser();
  const { updateSettings } = useSettings();
  const [isInvoked, setIsInvoked] = useState(false);
  const [isInvokedVisible, setIsInvokedVisible] = useState(false);
  const [isImmediatelyTriggered, setIsImmediatelyTriggered] = useState(false);

  const utilityFunctionMap: { [key: string]: () => void } = {
    logOut,
    resetSettings,
    deleteAccount,
    clearCachedUserData,
  };

  const utilityTextMap: { [key: string]: string } = {
    logOut: "Log Out",
    resetSettings: "Reset Settings to Default",
    deleteAccount: "Delete My Account",
    clearCachedUserData: "Clear Cached User Data",
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
    if (!state || state === "banned") return;
    await deleteUserAccount(sub);
    await logOut();
  }

  async function clearCachedUserData(): Promise<void> {
    removeAllCachedUserData();
  }

  function evaluateClick() {
    if (!needsConfirm) {
      utilityFunctionMap[utility]();
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
    utilityFunctionMap[utility]();
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
            onClick={isInvoked ? confirmAction : () => {}}
          >
            Confirm
          </div>
          <div className="border-primary border-x-0.6 h-2/3 opacity-20 shrink-0" />
          <div
            className="w-1/2"
            role={isInvoked ? "button" : undefined}
            onClick={isInvoked ? restoreInvocation : () => {}}
          >
            Cancel
          </div>
        </div>
      )}
    </button>
  );
}
