import themePickerStyle from "./settings-theme-picker.module.css";
import { allListedThemes } from "@/components/themeUtil/listedThemesMap";
import ThemePickerButton from "./ThemePickerButton";

interface Props {
  isExternal?: boolean;
}

export default function SettingsThemePicker({ isExternal = false }: Props) {
  return (
    <section
      className={`${themePickerStyle["picker-grid"]} ${
        isExternal ? "" : "md:justify-end"
      }`}
    >
      {allListedThemes.map((theme) => (
        <ThemePickerButton theme={theme} />
      ))}
      <ThemePickerButton theme="random" />
    </section>
  );
}
