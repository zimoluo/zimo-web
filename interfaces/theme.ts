type ThemeAvailable = "photos" | "projects";

type ThemeColor = "orange" | "teal";

type ThemeBackground = "photos" | "projects";

interface ThemeInterface {
  color: ThemeColor;
  background?: ThemeBackground | null;
}
