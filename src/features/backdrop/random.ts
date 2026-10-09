export const randomUniform = (min: number, max: number): number => Math.random() * (max - min) + min;
export const randomIntFromRange = (min: number, max: number): number => Math.floor(randomUniform(min, max + 1));

export function seededRandom(initial: number): () => number {
  let seed = initial;
  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
}
