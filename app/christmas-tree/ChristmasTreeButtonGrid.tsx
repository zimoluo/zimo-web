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
    <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-5 md:gap-6">
      {availableSprites.map((sprite, index) => (
        <ChristmasTreeSelectButton key={index} sprite={sprite} />
      ))}
    </section>
  );
}
