import CircledEllipsisIcon from "@/components/assets/entries/CircledEllipsisIcon";

export default function EmptyLayerPlaceholder() {
  return (
    <div className="w-full h-full rounded-xl bg-light bg-opacity-80 shadow-lg flex items-center justify-center py-10 px-6 pointer-events-none select-none">
      <CircledEllipsisIcon className="opacity-40 h-16 w-auto aspect-square" />
    </div>
  );
}
