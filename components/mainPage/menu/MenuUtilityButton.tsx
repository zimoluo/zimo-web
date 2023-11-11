"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import { useUser } from "@/components/contexts/UserContext";
import { defaultSettings } from "@/lib/constants/defaultSettings";
import {
  clearSessionToken,
  deleteUserAccount,
} from "@/lib/dataLayer/client/accountStateCommunicator";
import { removeAllCachedUserData } from "@/lib/dataLayer/client/commentClientLogic";

type Props = {
  utility: MenuUtility;
};

export default function MenuUtilityButton({ utility }: Props) {
  const { user, setUser } = useUser();
  const { updateSettings } = useSettings();

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

  return (
    <button
      onClick={utilityFunctionMap[utility]}
      className="w-full h-10 my-2 font-normal text-base md:text-lg"
    >
      {utilityTextMap[utility]}
    </button>
  );
}
