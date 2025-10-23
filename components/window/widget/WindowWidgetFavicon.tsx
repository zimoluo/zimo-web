"use client";

import CrossIcon from "@/components/assets/CrossIcon";
import DisplayFavicon from "@/components/assets/DisplayFavicon";
import InvertedCogIcon from "@/components/assets/toast/InvertedCogIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useTheme } from "@/components/contexts/ThemeContext";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useWindow } from "@/components/contexts/WindowContext";
import { allListedThemes } from "@/components/theme/util/listedThemesMap";
import { themeKeyMap } from "@/components/theme/util/themeKeyMap";
import ClickToSpinButton from "@/components/widgets/ClickToSpinButton";
import { useEffect, useState } from "react";
import windowWidgetFaviconStyle from "./window-widget-favicon.module.css";
import { cloneDeep } from "lodash";
import colorConvert from "color-convert";
import { getOptimizedThemeConfigForFaviconOnly } from "@/lib/themeMaker/faviconHelper";

const { rgb } = colorConvert;

const filteredThemes = allListedThemes.filter(
  (theme) => !["plainLight", "plainGray", "plainDark", "eep"].includes(theme)
);

const getThemeConfig = (theme: ThemeKey | ThemeDataConfig | null) =>
  theme ? (typeof theme === "string" ? themeKeyMap[theme] : theme) : undefined;

interface Props {
  presetCustomFavicon?: ThemeKey | ThemeDataConfig | null;
}

const GlowIndicator = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-2.5 h-2.5 ${
      windowWidgetFaviconStyle.glow
    } transition-opacity duration-300 ease-out ${
      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-75"
    }`}
  />
);

const FaviconButton = ({
  config,
  onClick,
  isActive,
}: {
  config: ThemeKey | ThemeDataConfig | null;
  onClick: () => void;
  isActive: boolean;
}) => (
  <div className="w-full h-full relative group">
    <GlowIndicator isActive={isActive} />
    <button
      className="w-full h-full rounded-full bg-light shadow relative grid"
      onClick={onClick}
    >
      <DisplayFavicon
        customThemeConfig={getThemeConfig(config)}
        className="w-full h-full"
      />
    </button>
  </div>
);

export default function WindowWidgetFavicon({
  presetCustomFavicon = null,
}: Props) {
  const { themeConfig } = useTheme();
  const { settings } = useSettings();
  const { modifyWindowSaveProps, isActiveWindow } = useWindowAction();
  const { saveWindows } = useWindow();

  const [showFaviconSelector, setShowFaviconSelector] = useState(false);
  const [customFavicon, setCustomFavicon] =
    useState<typeof presetCustomFavicon>(presetCustomFavicon);

  const modifyFavicon = (config: typeof presetCustomFavicon) => {
    setCustomFavicon(config);
    modifyWindowSaveProps({ presetCustomFavicon: config });
    saveWindows();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isActiveWindow) {
      return;
    }

    if (event.key === "Escape") {
      setShowFaviconSelector(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActiveWindow]);

  return (
    <div className="w-full h-full relative rounded-full bg-none bg-transparent">
      <ClickToSpinButton className="rounded-full w-full h-full bg-none border-none border-0 relative">
        <DisplayFavicon
          className="w-full h-full rounded-full"
          innerClassName="rounded-full"
          customThemeConfig={getThemeConfig(customFavicon)}
        />
      </ClickToSpinButton>
      <button
        className="absolute top-0 right-0 w-9 h-9 flex items-center justify-center translate-x-1/2 -translate-y-1/2 group"
        onClick={() => setShowFaviconSelector((prev) => !prev)}
      >
        <InvertedCogIcon
          className={`w-8 h-8 absolute transition-all duration-300 ease-out pointer-events-none group-hover:scale-110 ${
            showFaviconSelector
              ? "opacity-90 rotate-[120deg] translate-y-0"
              : "opacity-0 rotate-0 translate-y-1 group-hover:opacity-30 group-hover:rotate-[120deg] group-hover:translate-y-0"
          }`}
          color={`#${rgb.hex(themeConfig.palette.saturated)}`}
        />
      </button>
      <div
        className={`${
          showFaviconSelector
            ? "opacity-100 duration-300"
            : "opacity-0 pointer-events-none select-none invisible duration-200"
        } ease-out absolute translate-x-full -translate-y-1/2 -right-10 top-20 w-52 ${
          windowWidgetFaviconStyle.box
        } backdrop-blur-[6px] rounded-3xl shadow-xl`}
      >
        <div className="w-full h-full relative overflow-y-auto p-5">
          <div className="grid grid-cols-4 gap-5">
            <FaviconButton
              config={null}
              onClick={() => modifyFavicon(null)}
              isActive={customFavicon === null}
            />
          </div>
          <hr className="w-full h-0 border-t border-saturated border-opacity-30 my-5" />
          <div className="grid grid-cols-4 gap-5">
            {settings.customThemeData.map((config, index) => (
              <FaviconButton
                key={index}
                config={config}
                onClick={() =>
                  modifyFavicon(
                    getOptimizedThemeConfigForFaviconOnly(cloneDeep(config))
                  )
                }
                isActive={false}
              />
            ))}
          </div>
          <hr className="w-full h-0 border-t border-saturated border-opacity-30 my-5" />
          <div className="grid grid-cols-4 gap-5">
            {filteredThemes.map((themeKey, index) => (
              <FaviconButton
                key={index}
                config={themeKey}
                onClick={() => modifyFavicon(themeKey)}
                isActive={customFavicon === themeKey}
              />
            ))}
          </div>
        </div>
        <button
          className="absolute top-4 right-4 w-3 h-3"
          onClick={() => setShowFaviconSelector(false)}
        >
          <CrossIcon className="w-full h-full transition-transform duration-300 ease-out hover:scale-110" />
        </button>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none rounded-3xl border-reflect-saturated -translate-y-full" />
      </div>
    </div>
  );
}
