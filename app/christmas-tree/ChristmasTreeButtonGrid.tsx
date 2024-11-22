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
    <section className="flex gap-4 md:gap-6 md:flex-col overflow-auto px-4 py-4 shrink-0">
      {availableSprites.map((sprite, index) => (
        <ChristmasTreeSelectButton key={index} sprite={sprite} />
      ))}
    </section>
  );
}
