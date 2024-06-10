"use client";

import DisplayFavicon from "@/components/assets/DisplayFavicon";
import { themeKeyMap } from "@/components/theme/util/themeKeyMap";
import ClickToSpinButton from "@/components/widgets/ClickToSpinButton";
import { useState } from "react";

interface Props {
  faviconList: (ThemeKey | ThemeDataConfig)[];
  className?: string;
}

export default function GalleryClickableFavicon({
  faviconList,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);

  const switchTheme = () => {
    if (index === faviconList.length - 1) {
      setIndex(0);
    } else if (index > faviconList.length - 1) {
      setIndex(Math.min(faviconList.length - 1, 1));
    } else {
      setIndex(index + 1);
    }
  };

  const selectedFavicon = faviconList[index] ?? faviconList[0];
  const faviconThemeConfig: ThemeDataConfig =
    typeof selectedFavicon === "object"
      ? selectedFavicon
      : themeKeyMap[selectedFavicon];

  return (
    <div className={`rounded-full shadow-lg ${className}`}>
      <ClickToSpinButton
        className="w-full h-auto aspect-square"
        onClick={switchTheme}
      >
        <DisplayFavicon
          customThemeConfig={faviconThemeConfig}
          className="w-full h-auto aspect-square"
        />
      </ClickToSpinButton>
    </div>
  );
}
