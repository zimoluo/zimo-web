import ChristmasTreeSelectButton from "./ChristmasTreeSelectButton";

const availableSprites = [
  "cane",
  "cane",
  "cane",
  "cane",
  "cane",
  "cane",
  "cane",
  "cane",
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
