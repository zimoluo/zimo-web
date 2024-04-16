import themePickerStyle from "./settings-theme-picker.module.css";
import { allListedThemes } from "@/components/themeUtil/listedThemesMap";
import ThemePickerButton from "./ThemePickerButton";

interface Props {
  className?: string;
}

export default function SettingsThemePicker({ className = "" }: Props) {
  return (
    <section className={`${themePickerStyle["picker-grid"]} ${className}`}>
      {allListedThemes.map((theme) => (
        <ThemePickerButton theme={theme} />
      ))}
      <ThemePickerButton theme="random" />
    </section>
  );
}
