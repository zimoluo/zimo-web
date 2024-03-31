import ColorBlock from "./ColorBlock";

export default function PaletteOther() {
  return (
    <div className="h-full grid grid-cols-2">
      <ColorBlock className="bg-widget-100 text-primary" text="Widget" />
      <ColorBlock className="bg-page text-primary" text="Page" />
    </div>
  );
}
