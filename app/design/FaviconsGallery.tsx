import paletteStyle from "./palette.module.css";
import marinaConfig from "@/components/theme/config/marina";
import ConfigFavicon from "@/components/assets/displayFavicon/ConfigFavicon";
import aboutConfig from "@/components/theme/config/about";
import goldConfig from "@/components/theme/config/gold";
import skyConfig from "@/components/theme/config/sky";
import cakeConfig from "@/components/theme/config/cake";
import GlitterFavicon from "@/components/assets/displayFavicon/custom/GlitterFavicon";

interface Props {
  className?: string;
}

export default function FaviconsGallery({ className = "" }: Props) {
  const faviconClass = "w-12 md:w-14";

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
      <GlitterFavicon className={faviconClass} />
      <ConfigFavicon className={faviconClass} customThemeConfig={cakeConfig} />
    </div>
  );
}
