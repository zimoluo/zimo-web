"use client";

import DuplicateIcon from "@/components/assets/entries/DuplicateIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import ChangeToCustomThemeButton from "./ChangeToCustomThemeButton";
import EnterFullPageSingleArrow from "@/components/assets/entries/EnterFullPageSingleArrow";
import ExportIcon from "@/components/assets/entries/ExportIcon";
import ImageUploadButton from "./ImageUploadButton";
import FallingStarsIcon from "@/components/assets/entries/FallingStarsIcon";
import { clampValue, randomIntFromRange } from "@/lib/generalHelper";
import { intelligentlyGenerateThemeConfig } from "@/lib/themeMaker/colorHelper";
import { rgb, hsv } from "color-convert";
import { optimizeExportedProfile } from "@/lib/themeMaker/profileOptimizeTool";
import ImportProfileButton from "./ImportProfileButton";
import { useTheme } from "@/components/contexts/ThemeContext";
import PresetConfigButton from "./PresetConfigButton";

export default function SidebarButtons() {
  const { currentCustomThemeConfig, updateSettings, settings } = useSettings();
  const { insertThemeProfile } = useTheme();

  const isFullscreen = settings.expandThemeMakerWindow;

  const duplicateProfile = () => {
    const duplicatedProfile = structuredClone(currentCustomThemeConfig);
    insertThemeProfile(duplicatedProfile);
  };

  const generateRandomConfig = () => {
    const randomColor: ColorTriplet = [
      randomIntFromRange(0, 255),
      randomIntFromRange(0, 255),
      randomIntFromRange(0, 255),
    ];

    const tweakedColor = hsv.rgb(
      rgb.hsv(randomColor).map((channel, index) => {
        const maxFluctuation = Math.round(channel * 0.08);
        const fluctuation = randomIntFromRange(-maxFluctuation, maxFluctuation);

        return clampValue(channel + fluctuation, 0, index === 0 ? 359 : 100);
      }) as ColorTriplet
    );

    const generatedConfig = intelligentlyGenerateThemeConfig(
      randomColor,
      tweakedColor,
      8
    );

    insertThemeProfile(generatedConfig);
  };

  const downloadProfile = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    let exportedConfig = currentCustomThemeConfig;
    if (event.shiftKey || settings.optimizeProfileExport) {
      exportedConfig = optimizeExportedProfile(exportedConfig);
    }

    const jsonString = JSON.stringify(exportedConfig);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");
      link.href = url;

      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const filename = `Theme Maker Profile ${hours}-${minutes}-${seconds}.json`;

      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error whilst trying to download theme maker profile:",
        error
      );
    }
  };

  return (
    <>
      <ChangeToCustomThemeButton />
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square hidden md:block shrink-0"
        onClick={() =>
          updateSettings({ expandThemeMakerWindow: !isFullscreen })
        }
      >
        <div className="w-full h-auto aspect-square relative scale-85">
          <div className="w-full h-auto aspect-square absolute top-0 left-0 rotate-0">
            <EnterFullPageSingleArrow
              className={`w-full h-auto aspect-square transition-transform duration-500 ease-in-out ${
                isFullscreen
                  ? "rotate-180 -translate-x-[58%] -translate-y-[58%]"
                  : ""
              }`}
            />
          </div>
          <div className="w-full h-auto aspect-square absolute top-0 left-0 rotate-90">
            <EnterFullPageSingleArrow
              className={`w-full h-auto aspect-square transition-transform duration-500 ease-in-out ${
                isFullscreen
                  ? "rotate-180 -translate-x-[58%] -translate-y-[58%]"
                  : ""
              }`}
            />
          </div>
          <div className="w-full h-auto aspect-square absolute top-0 left-0 rotate-180">
            <EnterFullPageSingleArrow
              className={`w-full h-auto aspect-square transition-transform duration-500 ease-in-out ${
                isFullscreen
                  ? "rotate-180 -translate-x-[58%] -translate-y-[58%]"
                  : ""
              }`}
            />
          </div>
          <div className="w-full h-auto aspect-square absolute top-0 left-0 -rotate-90">
            <EnterFullPageSingleArrow
              className={`w-full h-auto aspect-square transition-transform duration-500 ease-in-out ${
                isFullscreen
                  ? "rotate-180 -translate-x-[58%] -translate-y-[58%]"
                  : ""
              }`}
            />
          </div>
        </div>
      </button>
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
        onClick={duplicateProfile}
      >
        <DuplicateIcon
          className="w-full h-auto aspect-square"
          strokeWidth={77}
        />
      </button>
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
        onClick={generateRandomConfig}
      >
        <FallingStarsIcon className="w-full h-auto aspect-square scale-105" />
      </button>
      <PresetConfigButton />
      <ImageUploadButton />
      <button
        className="transition-transform hover:scale-110 duration-300 ease-in-out w-7 h-auto aspect-square shrink-0"
        onClick={downloadProfile}
      >
        <ExportIcon className="w-full h-auto aspect-square" />
      </button>
      <ImportProfileButton />
    </>
  );
}
