import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteMain() {
  return (
    <figure className={`h-full ${paletteStyle.main}`}>
      <ColorBlock className="bg-primary text-light">Primary</ColorBlock>
      <ColorBlock className="bg-saturated text-light">Secondary</ColorBlock>
      <ColorBlock className="bg-middle text-light">Accent</ColorBlock>
      <ColorBlock className="bg-soft text-primary">Soft</ColorBlock>
      <ColorBlock className="bg-pastel text-primary">Neutral</ColorBlock>
      <ColorBlock className="bg-light text-primary">Contrast</ColorBlock>
    </figure>
  );
}
