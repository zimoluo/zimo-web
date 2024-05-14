export default function GradientSizePosPreview({
  sizeX,
  sizeY,
  posX,
  posY,
  isRepeating = true,
}: RadialGradientData & { isRepeating?: boolean }) {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `radial-gradient(3% 3% at ${posX} ${posY}, rgb(var(--color-saturated)) 0%, rgb(var(--color-saturated)) 99.9%, rgb(var(--color-saturated) / 0) 100%), ${
          isRepeating ? "repeating-" : ""
        }radial-gradient(${sizeX} ${sizeY} at ${posX} ${posY}, rgb(var(--color-saturated) / 0) 0%, rgb(var(--color-saturated) / 0) 94.9%, rgb(var(--color-saturated)) 95%, rgb(var(--color-saturated)) 99.9%, rgb(var(--color-saturated) / 0) 100%)`,
      }}
    />
  );
}
