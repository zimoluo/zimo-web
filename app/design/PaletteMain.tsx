import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteMain() {
  return (
    <figure className={`h-3/5 md:h-1/2 ${paletteStyle.main}`}>
      <ColorBlock className="bg-primary text-light">Primary</ColorBlock>
      <ColorBlock className="bg-saturated text-light">Secondary</ColorBlock>
      <ColorBlock className="bg-pastel text-primary">Neutral</ColorBlock>
      <ColorBlock className="bg-light text-primary">Contrast</ColorBlock>
    </figure>
  );
}
