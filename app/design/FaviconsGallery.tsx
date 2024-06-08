import paletteStyle from "./palette.module.css";
import marinaConfig from "@/components/theme/config/marina";
import ConfigFavicon from "@/components/assets/displayFavicon/ConfigFavicon";
import aboutConfig from "@/components/theme/config/about";
import goldConfig from "@/components/theme/config/gold";
import skyConfig from "@/components/theme/config/sky";
import birthdayConfig from "@/components/theme/config/birthday";
import glitterConfig from "@/components/theme/config/glitter";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  const faviconClass = "w-12 md:w-14 rounded-full shadow-lg";

  return (
    <div
      className={`${paletteStyle.favicons} items-center justify-center ${className}`}
    >
      <ConfigFavicon className={faviconClass} customThemeConfig={aboutConfig} />
      <ConfigFavicon className={faviconClass} customThemeConfig={goldConfig} />
      <ConfigFavicon className={faviconClass} customThemeConfig={skyConfig} />
      <ConfigFavicon
        className={faviconClass}
        customThemeConfig={marinaConfig}
      />
      <ConfigFavicon
        className={faviconClass}
        customThemeConfig={glitterConfig}
      />
      <ConfigFavicon
        className={faviconClass}
        customThemeConfig={birthdayConfig}
      />
    </div>
  );
}
