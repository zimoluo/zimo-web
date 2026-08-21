if (!("matchMedia" in globalThis)) {
  Object.defineProperty(globalThis, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

if (!("requestAnimationFrame" in globalThis)) {
  Object.defineProperty(globalThis, "requestAnimationFrame", {
    writable: true,
    value: (callback: FrameRequestCallback) =>
      setTimeout(() => callback(performance.now()), 16) as unknown as number,
  });
  Object.defineProperty(globalThis, "cancelAnimationFrame", {
    writable: true,
    value: (handle: number) => clearTimeout(handle as unknown as NodeJS.Timeout),
  });
}
