import type { ImageAsset } from "../model/types";

function frameMultiplier(src: string): number {
  const identity = src.split(/[?#]/, 1)[0] ?? src;
  let seed = 0;
  for (let index = 0; index < identity.length; index += 1) seed = (seed << 5) - seed + identity.charCodeAt(index) | 0;
  seed ^= seed << 13;
  seed ^= seed >> 17;
  seed ^= seed << 5;
  return .85 + (seed >>> 0) / 2 ** 32 * .3;
}

export function coverFrameRatio(image: ImageAsset): number {
  const ratio = image.width / image.height;
  return ratio === 1 ? 1 : Number((ratio * frameMultiplier(image.src)).toFixed(3));
}

export function galleryFrameRatio(image: ImageAsset): number {
  return image.width / image.height * frameMultiplier(image.src);
}
