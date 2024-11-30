export const isTreeContentPositionValid = (
  position: [number, number],
  treeData: TreeContent[]
): boolean => {
  const [x, y] = position;

  if (
    x < 0 ||
    x > 1000 ||
    y < 0 ||
    y > 1000 ||
    y < 130 ||
    y > 850 ||
    y < -1.7143 * x + 850.0 ||
    y < 1.885 * x - 1035
  ) {
    return false;
  }

  const isTooCloseToAnotherItem = treeData.some(
    ({ position: [dataX, dataY] }) =>
      Math.abs(dataX - x) < 50 && Math.abs(dataY - y) < 33
  );

  if (isTooCloseToAnotherItem) {
    return false;
  }

  return true;
};

export const isTreeContentWithinTreeBox = (
  position: [number, number]
): boolean => {
  const [x, y] = position;
  return x < 1100 && y < 1050 && y > -50 && x > -100;
};
