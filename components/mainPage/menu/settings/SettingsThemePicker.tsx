import themePickerStyle from "./settings-theme-picker.module.css";
import { allListedThemes } from "@/components/themeUtil/listedThemesMap";
import ThemePickerButton from "./ThemePickerButton";

interface Props {
  className?: string;
}

export default function SettingsThemePicker({ className = "" }: Props) {
  return (
    <section className={`${themePickerStyle.pickerGrid} ${className}`}>
      {allListedThemes.map((theme) => (
        <ThemePickerButton theme={theme} key={theme} />
      ))}
      <ThemePickerButton theme="random" />
    </section>
  );
}
