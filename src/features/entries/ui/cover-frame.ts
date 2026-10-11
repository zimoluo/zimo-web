import type { ImageAsset } from "../model/types";

export function coverFrameRatio(image: ImageAsset): number {
  const ratio = image.width / image.height;
  if (ratio === 1) return 1;
  const identity = new URL(image.src, "https://zimoluo.me").pathname;
  let seed = 0;
  for (let index = 0; index < identity.length; index += 1) seed = (seed << 5) - seed + identity.charCodeAt(index) | 0;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return Number((ratio * (.85 + (seed >>> 0) / 2 ** 32 * .3)).toFixed(3));
}
