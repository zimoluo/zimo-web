import ColorPreviewGrid from "./ColorPreviewGrid";
import ColorPreviewWrapper from "./ColorPreviewWrapper";
import ThemeEditorFrame from "./ThemeEditorFrame";
import windowStyle from "./window.module.css";

export default function ThemeMakerWindow() {
  return (
    <div className="w-screen flex justify-center">
      <div
        className={`mt-16 md:my-18 ${windowStyle.sizing} bg-widget-80 md:rounded-3xl md:shadow-xl md:backdrop-blur md:overflow-hidden`}
      >
        <div className="w-full md:h-full md:flex md:flex-row-reverse">
          <ColorPreviewWrapper>
            <ColorPreviewGrid />
          </ColorPreviewWrapper>
          <ThemeEditorFrame />
        </div>
      </div>
    </div>
  );
}
