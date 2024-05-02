import ColorBlock from "../ColorBlock";
import previewStyle from "./color-preview.module.css";

export default function ColorPreviewGrid() {
  return (
    <div className={`flex flex-col ${previewStyle.sizing}`}>
      <figure
        className={`h-1/2 grid grid-cols-3 md:grid-cols-1 md:grid-rows-6`}
      >
        <ColorBlock className="bg-primary text-light text-xl">
          Primary
        </ColorBlock>
        <ColorBlock className="bg-saturated text-light text-xl">
          Secondary
        </ColorBlock>
        <ColorBlock className="bg-middle text-light text-xl">Accent</ColorBlock>
        <ColorBlock className="bg-soft text-primary text-xl">Soft</ColorBlock>
        <ColorBlock className="bg-pastel text-primary text-xl">
          Neutral
        </ColorBlock>
        <ColorBlock className="bg-light text-primary text-xl">
          Contrast
        </ColorBlock>
      </figure>
      <figure className={`h-1/2 grid grid-cols-2`}>
        <ColorBlock className="bg-widget-100 text-primary p-6 text-xl">
          Widget
        </ColorBlock>
        <ColorBlock className="bg-page text-primary p-6 text-xl">
          Backdrop
        </ColorBlock>
      </figure>
    </div>
  );
}
