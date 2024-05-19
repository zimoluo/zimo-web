"use client";

import DuplicateIcon from "@/components/assets/entries/DuplicateIcon";
import DownloadIcon from "@/components/assets/sharing/DownloadIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useToast } from "@/components/contexts/ToastContext";
import { maxProfileCount } from "@/lib/themeMaker/profileHelper";
import { isValidThemeDataConfig } from "@/lib/themeMaker/themeConfigTypeGuard";
import { useRef } from "react";

export default function SidebarButtons() {
  const { currentCustomThemeConfig, updateSettings, settings } = useSettings();
  const { appendToast } = useToast();

  const uploadProfileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadButtonClick = () => {
    if (!uploadProfileInputRef || !uploadProfileInputRef.current) {
      return;
    }

    uploadProfileInputRef.current.click();
  };

  const insertProfile = (profile: ThemeDataConfig) => {
    const themeProfilesArray = structuredClone(settings.customThemeData);

    if (settings.customThemeData.length >= maxProfileCount) {
      appendToast({
        title: "Zimo Web",
        description: `Up to ${maxProfileCount} profile${
          maxProfileCount === 1 ? "" : "s"
        } are allowed.`,
      });
      return;
    }

    if (themeProfilesArray.length <= 0) {
      updateSettings({
        customThemeData: [profile],
        customThemeIndex: 0,
      });
      return;
    }

    const updatedProfileArray: ThemeDataConfig[] = [
      ...themeProfilesArray.slice(0, settings.customThemeIndex + 1),
      profile,
      ...themeProfilesArray.slice(
        settings.customThemeIndex + 1,
        themeProfilesArray.length
      ),
    ];

    updateSettings({
      customThemeData: updatedProfileArray,
      customThemeIndex: settings.customThemeIndex + 1,
    });
  };

  const duplicateProfile = () => {
    const duplicatedProfile = structuredClone(currentCustomThemeConfig);
    insertProfile(duplicatedProfile);
  };

  const downloadProfile = () => {
    const jsonString = JSON.stringify(currentCustomThemeConfig);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = "theme-maker-profile.json";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error whilst trying to download theme maker profile:",
        error
      );
    }
  };

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // size in mb
    if (file.size / 1024 / 1024 > 20) {
      appendToast({
        title: "Zimo Web",
        description: "Profile must be within 20 MB.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContents = e.target?.result as string;
        const parsedData = JSON.parse(fileContents);

        if (!isValidThemeDataConfig(parsedData)) {
          throw new Error("Invalid profile config object.");
        }

        insertProfile(parsedData);
      } catch (error) {
        appendToast({
          title: "Zimo Web",
          description: "Invalid theme maker profile.",
        });
        console.log("Error uploading theme maker profile:", error);
      } finally {
        reader.onload = null;
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  return (
    <>
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square"
        onClick={duplicateProfile}
      >
        <DuplicateIcon
          className="w-full h-auto aspect-square"
          strokeWidth={77}
        />
      </button>
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square"
        onClick={downloadProfile}
      >
        <DownloadIcon className="w-full h-auto aspect-square" />
      </button>
      <button
        onClick={uploadButtonClick}
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square"
      >
        <input
          type="file"
          ref={uploadProfileInputRef}
          onChange={handleProfileUpload}
          accept=".json"
          className="w-0 h-0 m-0 p-0 border-none border-0 absolute opacity-0"
        />
        <DownloadIcon className="w-full h-auto aspect-square rotate-180" />
      </button>
    </>
  );
}
