/**
 * Generates a random integer within a specified range, inclusive of both the minimum and maximum values.
 * @param {number} min - The minimum value in the range.
 * @param {number} max - The maximum value in the range.
 * @returns {number} A random integer between min and max, inclusive.
 */
export function randomIntFromRange(min: number, max: number): number {
  return Math.floor(randomUniform(min, max + 1));
}

/**
 * Generates a random floating-point number within a specified range, including the minimum value but excluding the maximum value.
 * @param {number} min - The minimum value in the range.
 * @param {number} max - The maximum value in the range.
 * @returns {number} A random floating-point number between min and max, exclusive of max.
 */
export function randomUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function camelToKebabCase(str: string): string {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}

export function isNumber(str: string): boolean {
  return !isNaN(+str);
}
