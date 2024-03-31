import ColorBlock from "./ColorBlock";

export default function PaletteMain() {
  return (
    <div className="h-full grid grid-rows-6 grid-cols-1 md:grid-rows-1 md:grid-cols-6">
      <ColorBlock className="bg-primary text-light" text="Primary" />
      <ColorBlock className="bg-saturated text-light" text="Saturated" />
      <ColorBlock className="bg-middle text-light" text="Middle" />
      <ColorBlock className="bg-soft text-primary" text="Soft" />
      <ColorBlock className="bg-pastel text-primary" text="Pastel" />
      <ColorBlock className="bg-light text-primary" text="Light" />
    </div>
  );
}
