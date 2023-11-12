export function randomIntFromRange(min: number, max: number) {
  return Math.floor(randomUniform(min, max + 1));
}

export function randomUniform(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
