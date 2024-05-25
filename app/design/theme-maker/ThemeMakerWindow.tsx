import ColorPreviewGrid from "./ColorPreviewGrid";
import ThemeEditorFrame from "./ThemeEditorFrame";
import ThemeMakerSidebar from "./ThemeMakerSidebar";
import ThemeMakerWindowWrapper from "./ThemeMakerWindowWrapper";

export default function ThemeMakerWindow() {
  return (
    <div className="w-screen flex justify-center">
      <ThemeMakerWindowWrapper>
        <div className="w-full md:h-full md:flex md:flex-row-reverse">
          <ThemeMakerSidebar>
            <ColorPreviewGrid />
          </ThemeMakerSidebar>
          <ThemeEditorFrame />
        </div>
      </ThemeMakerWindowWrapper>
    </div>
  );
}
