import ChristmasTreeSelectButton from "./ChristmasTreeSelectButton";

const availableSprites = [
  "cane",
  "bell1",
  "bell2",
  "bell3",
  "candy",
  "cup",
  "deer",
  "gift",
  "gingerbread",
  "glove",
  "hat",
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
    <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
      {availableSprites.map((sprite, index) => (
        <ChristmasTreeSelectButton key={index} sprite={sprite} />
      ))}
    </section>
  );
}
