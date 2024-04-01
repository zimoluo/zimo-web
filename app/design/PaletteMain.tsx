import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteMain() {
  return (
    <figure className={`h-full ${paletteStyle.main}`}>
      <ColorBlock className="bg-primary text-light" text="Primary" />
      <ColorBlock className="bg-saturated text-light" text="Secondary" />
      <ColorBlock className="bg-middle text-light" text="Accent" />
      <ColorBlock className="bg-soft text-primary" text="Soft" />
      <ColorBlock className="bg-pastel text-primary" text="Neutral" />
      <ColorBlock className="bg-light text-primary" text="Contrast" />
    </figure>
  );
}
