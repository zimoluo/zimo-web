const factorialMap: Map<number, number> = new Map([
  [0, 1],
  [1, 1],
  [2, 2],
  [3, 6],
  [4, 24],
  [5, 120],
  [6, 720],
  [7, 5040],
  [8, 40320],
  [9, 362880],
  [10, 3628800],
  [11, 39916800],
  [12, 479001600],
  [13, 6227020800],
  [14, 87178291200],
  [15, 1307674368000],
]);

export function factorial(n: number): number {
  if (n < 0 || typeof n !== "number") {
    return 1;
  }

  n = Math.floor(n);

  if (n > 1000) {
    return Infinity;
  }

  if (factorialMap.has(n)) {
    return factorialMap.get(n)!;
  }

  let result = factorialMap.get(15)!;
  for (let i = 16; i <= n; i++) {
    result *= i;
  }

  return result;
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}
