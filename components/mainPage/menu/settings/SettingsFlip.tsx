"use client";

import SettingsFlipButton from "@/components/assets/settings/SettingsFlipButton";
import SettingsFlipButtonHalloween from "@/components/assets/settings/SettingsFlipButtonHalloween";
import flipStyle from "./settings-flip.module.css";

interface Props {
  onClick: (status: boolean) => void;
  state: boolean;
  appearance?: SettingsFlipAppearance;
  className?: string;
  defaultDimension?: boolean;
}

const appearanceMap = {
  normal: SettingsFlipButton,
  halloween: SettingsFlipButtonHalloween,
};

export default function SettingsFlip({
  onClick,
  state = false,
  appearance = "normal",
  defaultDimension = true,
  className = "",
}: Props) {
  function flip() {
    onClick(!state);
  }

  const ButtonSprite = appearanceMap[appearance];

  return (
    <button
      className={`w-auto relative rounded-full overflow-hidden shadow-lg select-none shrink-0 border-reflect-primary ${
        defaultDimension ? "h-9" : ""
      } ${className}`}
      onClick={flip}
    >
      <div
        className={`pointer-events-none select-none h-full aspect-video w-auto object-fill rounded-full ${flipStyle.baseColor}`}
      />
      <div
        className={`h-full w-auto aspect-video object-fill rounded-full absolute top-0 left-0 pointer-events-none select-none bg-saturated bg-opacity-90 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          state ? "opacity-60" : "opacity-0"
        }`}
      />
      <ButtonSprite
        className={`h-full w-auto aspect-square rounded-full absolute top-0 left-0 pointer-events-none select-none transition-transform duration-200 ease-out ${
          state ? flipStyle.on : flipStyle.off
        } rounded-full`}
      />
    </button>
  );
}
