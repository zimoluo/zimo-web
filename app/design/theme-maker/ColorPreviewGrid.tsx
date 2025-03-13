import ColorBlock from "../ColorBlock";
import previewStyle from "./color-preview.module.css";

export default function ColorPreviewGrid() {
  return (
    <div className={`flex flex-col ${previewStyle.sizing}`}>
      <figure className="h-1/2 grid grid-cols-1 grid-rows-4">
        <ColorBlock className="bg-primary text-light text-xl">
          Primary
        </ColorBlock>
        <ColorBlock className="bg-saturated text-light text-xl">
          Secondary
        </ColorBlock>
        <ColorBlock className="bg-pastel text-primary text-xl">
          Neutral
        </ColorBlock>
        <ColorBlock className="bg-light text-primary text-xl">
          Contrast
        </ColorBlock>
      </figure>
      <figure className="h-1/2 grid grid-cols-2">
        <ColorBlock className="bg-widget-100 text-primary p-6 text-xl backdrop-blur-2xl">
          Widget
        </ColorBlock>
        <ColorBlock className="bg-page text-primary p-6 text-xl backdrop-blur-2xl">
          Backdrop
        </ColorBlock>
      </figure>
    </div>
  );
}
