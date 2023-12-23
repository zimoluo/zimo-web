export const isTreeContentPositionValid = (
  position: [number, number]
): boolean => {
  const [x, y] = position;
  return !(
    x < 0 ||
    x > 1000 ||
    y < 0 ||
    y > 1000 ||
    y < 130 ||
    y > 850 ||
    y < -1.7143 * x + 850.0 ||
    y < 1.885 * x - 1035
  );
};
