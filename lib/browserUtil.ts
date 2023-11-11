export function isWebkit(): boolean {
  if (typeof window !== "undefined") {
    const ua = window.navigator.userAgent;
    return (
      /WebKit/.test(ua) &&
      !/Chrome/.test(ua) &&
      !/Chromium/.test(ua) &&
      !/OPR/.test(ua) &&
      !/Edg/.test(ua) &&
      !/SamsungBrowser/.test(ua) &&
      !/Firefox/.test(ua)
    );
  }
  return false;
}
