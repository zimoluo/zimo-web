import ColorBlock from "./ColorBlock";
import paletteStyle from "./palette.module.css";

export default function PaletteMain() {
  return (
    <figure className={`h-3/5 md:h-1/2 ${paletteStyle.main}`}>
      <ColorBlock className="bg-text text-panel">Primary</ColorBlock>
      <ColorBlock className="bg-text-muted text-panel">Secondary</ColorBlock>
      <ColorBlock className="bg-fill text-text">Neutral</ColorBlock>
      <ColorBlock className="bg-panel text-text">Contrast</ColorBlock>
    </figure>
  );
}
