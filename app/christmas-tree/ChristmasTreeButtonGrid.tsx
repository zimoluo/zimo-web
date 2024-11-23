"use client";

import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import ChristmasTreeSelectButton from "./ChristmasTreeSelectButton";

const availableSprites = [
  "cane",
  "bauble",
  "bell1",
  "bell2",
  "bell3",
  "bells",
  "candy",
  "cup",
  "deer",
  "gift",
  "giftbag",
  "gingerbread",
  "glove",
  "hat",
  "sock",
  "headphones",
  "lollipop",
  "mistletoe",
  "ribbon",
  "ring",
  "scarf",
  "snow-globe",
  "snowflake",
  "tag",
];

export default function ChristmasTreeButtonGrid() {
  return (
    <div className="relative md:h-full">
      <section className="flex gap-4 md:gap-6 md:flex-col overflow-auto px-4 py-4 shrink-0 relative h-full">
        {availableSprites.map((sprite, index) => (
          <ChristmasTreeSelectButton key={index} sprite={sprite} />
        ))}
      </section>
      <button className="md:hidden absolute left-4 w-9 px-2 h-12 top-1/2 -translate-y-1/2 bg-pastel bg-opacity-50 backdrop-blur-lg shadow-md rounded-xl">
        <UpDownSwitchIcon className="-rotate-90 w-full h-auto aspect-square" />
      </button>
      <button className="md:hidden absolute right-4 w-9 px-2 h-12 top-1/2 -translate-y-1/2 bg-pastel bg-opacity-50 backdrop-blur-lg shadow-md rounded-xl">
        <UpDownSwitchIcon className="rotate-90 w-full h-auto aspect-square" />
      </button>
    </div>
  );
}
