import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteMain() {
  return (
    <div className={`h-full ${paletteStyle.main}`}>
      <ColorBlock className="bg-primary text-light" text="Primary" />
      <ColorBlock className="bg-saturated text-light" text="Saturated" />
      <ColorBlock className="bg-middle text-light" text="Middle" />
      <ColorBlock className="bg-soft text-primary" text="Soft" />
      <ColorBlock className="bg-pastel text-primary" text="Pastel" />
      <ColorBlock className="bg-light text-primary" text="Light" />
    </div>
  );
}
