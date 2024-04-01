import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteOther() {
  return (
    <figure className={`h-full ${paletteStyle.other}`}>
      <ColorBlock className="bg-widget-100 text-primary" text="Widget" />
      <ColorBlock className="bg-page text-primary" text="Page" />
    </figure>
  );
}
