import ColorPreviewGrid from "./ColorPreviewGrid";
import ThemeEditorFrame from "./ThemeEditorFrame";
import ThemeMakerSidebar from "./ThemeMakerSidebar";
import { ThemeMakerWindowProvider } from "./ThemeMakerWindowContext";
import ThemeMakerWindowWrapper from "./ThemeMakerWindowWrapper";

export default function ThemeMakerWindow() {
  return (
    <div className="w-screen flex justify-center">
      <ThemeMakerWindowProvider>
        <ThemeMakerWindowWrapper>
          <div className="w-full md:h-full md:flex md:flex-row-reverse">
            <ThemeMakerSidebar>
              <ColorPreviewGrid />
            </ThemeMakerSidebar>
            <ThemeEditorFrame />
          </div>
        </ThemeMakerWindowWrapper>
      </ThemeMakerWindowProvider>
    </div>
  );
}
