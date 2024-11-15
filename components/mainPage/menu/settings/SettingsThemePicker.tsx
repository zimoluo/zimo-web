import themePickerStyle from "./settings-theme-picker.module.css";
import { allListedThemes } from "@/components/theme/util/listedThemesMap";
import ThemePickerButton from "./ThemePickerButton";

interface Props {
  className?: string;
  hasRandom?: boolean;
  insertProfile?: boolean;
}

export default function SettingsThemePicker({
  className = "",
  hasRandom = false,
  insertProfile = false,
}: Props) {
  return (
    <section className={`${themePickerStyle.pickerGrid} ${className}`}>
      {allListedThemes.map((theme) => (
        <ThemePickerButton
          theme={theme}
          key={theme}
          insertProfile={insertProfile}
        />
      ))}
      {hasRandom && (
        <ThemePickerButton theme="random" insertProfile={insertProfile} />
      )}
    </section>
  );
}
