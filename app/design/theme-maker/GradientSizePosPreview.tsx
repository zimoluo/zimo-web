export default function GradientSizePosPreview({
  sizeX,
  sizeY,
  posX,
  posY,
  isRepeating = true,
  isCircle,
  sizeKeyword,
}: RadialGradientData &
  Required<CircleRadialGradientAdditionalData> & { isRepeating?: boolean }) {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `radial-gradient(${isCircle ? "circle " : ""}${
          isCircle ? sizeKeyword : "3% 3%"
        } at ${posX}% ${posY}%, rgb(var(--color-saturated)) 0%, rgb(var(--color-saturated)) ${
          isCircle ? "5.99" : "99.99"
        }%, rgb(var(--color-saturated) / 0) ${isCircle ? "6" : "100"}%), ${
          isRepeating ? "repeating-" : ""
        }radial-gradient(${isCircle ? "circle " : ""}${
          isCircle ? sizeKeyword : `${sizeX}% ${sizeY}%`
        } at ${posX}% ${posY}%, rgb(var(--color-saturated) / 0) 0%, rgb(var(--color-saturated) / 0) 94.99%, rgb(var(--color-saturated)) 95%, rgb(var(--color-saturated)) 99.9%, rgb(var(--color-saturated) / 0) 100%), radial-gradient(${
          isCircle ? "circle " : ""
        }${
          isCircle ? sizeKeyword : `${sizeX}% ${sizeY}%`
        } at ${posX}% ${posY}%, rgb(var(--color-saturated) / 0.2) 0%, rgb(var(--color-saturated) / 0.2) 95%, rgb(var(--color-saturated) / 0) 95.01%)`,
      }}
    />
  );
}
