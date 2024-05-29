import { allListedThemes } from "@/components/theme/util/listedThemesMap";
import themePickerStyle from "./settings-theme-picker.module.css";
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
