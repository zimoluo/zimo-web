"use client";

import { useSettings } from "@/components/contexts/SettingsContext";
import pickerStyle from "./background-picker.module.css";
import Image from "next/image";
import NoSignIcon from "@/components/assets/entries/NoSignIcon";

interface Props {
  animationKey: ThemeAnimatedBackgroundKey | null;
}

// Function that simply maps to itself since theme key are animation key are the same in practice
const getThemeKeyFromAnimationKey = (
  animationKey: ThemeAnimatedBackgroundKey
): ThemeKey => {
  return animationKey as ThemeKey;
};

export default function AnimatedBackgroundPickerButton({
  animationKey,
}: Props) {
  const { updateSettings, currentCustomThemeConfig, settings } = useSettings();

  const setAnimatedBackground = () => {
    if (
      (animationKey === null &&
        !currentCustomThemeConfig.animatedBackgroundKey) ||
      animationKey === currentCustomThemeConfig.animatedBackgroundKey
    ) {
      return;
    }

    const newThemeConfig = structuredClone(currentCustomThemeConfig);
    if (animationKey === null) {
      delete newThemeConfig.animatedBackgroundKey;
    } else {
      newThemeConfig.animatedBackgroundKey = animationKey;
    }

    const newThemeConfigArray = structuredClone(settings.customThemeData);
    newThemeConfigArray[settings.customThemeIndex] = newThemeConfig;

    updateSettings({ customThemeData: newThemeConfigArray });
  };

  const isSelected =
    (!currentCustomThemeConfig.animatedBackgroundKey &&
      animationKey === null) ||
    currentCustomThemeConfig.animatedBackgroundKey === animationKey;

  return (
    <button
      className="relative rounded-xl group"
      onClick={setAnimatedBackground}
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          pickerStyle.selected
        } transition-all duration-300 ease-in-out rounded-lg w-0 h-0 select-none pointer-events-none ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        aria-hidden="true"
      />
      <div
        className={`${
          animationKey ? pickerStyle.ring : "bg-pastel bg-opacity-80"
        } transition-all duration-300 rounded-xl overflow-hidden ease-in-out relative shadow-lg ${
          isSelected ? "opacity-100" : "opacity-75"
        }`}
      >
        {animationKey ? (
          <Image
            src={`/theme/picker/${getThemeKeyFromAnimationKey(
              animationKey
            )}.svg`}
            alt={`Use ${animationKey} animated background`}
            height={40}
            width={40}
            className="h-auto aspect-square w-full"
            draggable="false"
            priority={true}
          />
        ) : (
          <div className="h-auto aspect-square w-full flex items-center justify-center">
            <NoSignIcon className="w-2/5 h-auto aspect-square" />
          </div>
        )}
      </div>
    </button>
  );
}
