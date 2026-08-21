import ColorBlock from "../ColorBlock";
import previewStyle from "./color-preview.module.css";

export default function ColorPreviewGrid() {
  return (
    <div className={`flex flex-col ${previewStyle.sizing}`}>
      <figure className="h-1/2 grid grid-cols-1 grid-rows-4">
        <ColorBlock className="bg-text text-panel text-xl">
          Primary
        </ColorBlock>
        <ColorBlock className="bg-text-muted text-panel text-xl">
          Secondary
        </ColorBlock>
        <ColorBlock className="bg-fill text-text text-xl">
          Neutral
        </ColorBlock>
        <ColorBlock className="bg-panel text-text text-xl">
          Contrast
        </ColorBlock>
      </figure>
      <figure className="h-1/2 grid grid-cols-2">
        <ColorBlock className="surface-widget surface-widget-100 text-text p-6 text-xl">
          Widget
        </ColorBlock>
        <ColorBlock className="surface-page text-text p-6 text-xl">
          Backdrop
        </ColorBlock>
      </figure>
    </div>
  );
}
