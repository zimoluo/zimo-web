import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteOther() {
  return (
    <figure className={`h-2/5 md:h-1/2 ${paletteStyle.other}`}>
      <ColorBlock className="surface-widget surface-widget-100 text-text p-6 backdrop-blur-reading">
        Widget
      </ColorBlock>
      <ColorBlock className="surface-page text-text p-6 backdrop-blur-reading">
        Backdrop
      </ColorBlock>
    </figure>
  );
}
