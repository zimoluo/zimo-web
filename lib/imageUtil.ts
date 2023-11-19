import { SyntheticEvent } from "react";

export const imageFallback =
  (fallbackSrc: string) => (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;

    target.src = fallbackSrc;
    target.srcset = fallbackSrc;
  };

export const shimmerDataURL = (w: number, h: number) =>
  toBase64(
    `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient id="g"><stop stop-color="#888" offset="20%" /><stop stop-color="#777" offset="50%" /><stop stop-color="#888" offset="70%" /></linearGradient></defs><rect width="${w}" height="${h}" fill="#888" opacity="0.75" /><rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0.75" /><animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  /></svg>`
  );

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export function imageViewerTextParser(input: ImagesData): ImagesData {
  const { url, text = [], aspectRatio, original } = input;
  let outputText: string[] = [];

  const urlLength = url.length;
  const textLength = text.length;

  if (urlLength === textLength) {
    outputText = text;
  } else if (textLength > urlLength) {
    outputText = text.slice(0, urlLength);
  } else {
    outputText = [...text, ...new Array(urlLength - textLength).fill("")];
  }

  const safeOriginal: string[] = original
    ? original.length === url.length
      ? original
      : original.length < url.length
      ? [...original, ...new Array(url.length - original.length).fill("")]
      : original.slice(0, url.length)
    : new Array(url.length).fill("");

  return {
    url,
    text: outputText,
    aspectRatio,
    original: safeOriginal,
  };
}
