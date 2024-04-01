import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteOther() {
  return (
    <figure className={`h-full ${paletteStyle.other}`}>
      <ColorBlock className="bg-widget-100 text-primary p-6" text="Widget" />
      <ColorBlock className="bg-page text-primary p-6" text="Page Background" />
    </figure>
  );
}
