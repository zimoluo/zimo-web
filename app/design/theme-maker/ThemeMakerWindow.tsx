import ColorPreviewGrid from "./ColorPreviewGrid";
import ThemeEditorFrame from "./ThemeEditorFrame";
import ThemeMakerSidebar from "./ThemeMakerSidebar";
import windowStyle from "./window.module.css";

export default function ThemeMakerWindow() {
  return (
    <div className="w-screen flex justify-center">
      <div
        className={`mt-16 md:my-18 ${windowStyle.sizing} bg-widget-80 md:bg-widget-40 md:rounded-3xl md:shadow-xl md:backdrop-blur-xl md:overflow-hidden`}
      >
        <div className="w-full md:h-full md:flex md:flex-row-reverse">
          <ThemeMakerSidebar>
            <ColorPreviewGrid />
          </ThemeMakerSidebar>
          <ThemeEditorFrame />
        </div>
      </div>
    </div>
  );
}
