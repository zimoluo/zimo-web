"use client";

export default function ClickingCircle() {
  return (
    <div
      className="bg-primary rounded-full fixed select-none pointer-events-none -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto aspect-square h-4"
      style={{ height: "min(30vh, 30vw)" }}
    />
  );
}
