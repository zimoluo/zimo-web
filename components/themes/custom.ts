import { useSettings } from "../contexts/SettingsContext";

const { settings } = useSettings();

const themeConfig: ThemeInterface = {
  palette: "gold",
  displayFavicon: "gold",
  siteThemeColor: "#f9d986",
  animatedBackground: "gold",
};

export default themeConfig;
