"use client";

import SettingsFlipButton from "@/components/images/settings/SettingsFlipButton";
import SettingsFlipButtonHalloween from "@/components/images/settings/SettingsFlipButtonHalloween";
import flipStyle from "./settings-flip.module.css";

interface Props {
  onClick: (status: boolean) => void;
  state: boolean;
  appearance?: "normal" | "halloween";
}

const appearanceMap = {
  normal: SettingsFlipButton,
  halloween: SettingsFlipButtonHalloween,
};

export default function SettingsFlip({
  onClick,
  state = false,
  appearance = "normal",
}: Props) {
  function flip() {
    onClick(!state);
  }

  const ButtonSprite = appearanceMap[appearance];

  return (
    <button
      className="h-8 md:h-10 w-auto relative rounded-full overflow-hidden shadow-lg select-none shrink-0"
      onClick={flip}
    >
      <div
        className={`pointer-events-none select-none h-8 md:h-10 aspect-video w-auto object-fill rounded-full ${flipStyle["base-color"]}`}
      />
      <div
        className={`h-8 md:h-10 w-auto aspect-video object-fill rounded-full absolute top-0 left-0 pointer-events-none select-none bg-saturated bg-opacity-90 backdrop-blur-sm transition-opacity duration-200 ease-out ${
          state ? "opacity-60" : "opacity-0"
        }`}
      />
      <ButtonSprite
        className={`h-8 md:h-10 w-auto aspect-square rounded-full absolute top-0 left-0 pointer-events-none select-none transition-transform duration-200 ease-out ${
          state ? flipStyle["flip-on"] : "translate-x-0"
        } rounded-full`}
      />
    </button>
  );
}
