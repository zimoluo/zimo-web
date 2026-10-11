
import { SurfaceRim } from "../../../ui/SurfaceRim";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album not found",
  robots: { index: false, follow: false },
};

export default function PhotosNotFound() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6">
      <div className="surface-widget surface-widget-80 surface-edge max-w-lg rounded-2xl p-8 text-center">
        <p className="mb-2 text-sm tracking-widest text-text-muted uppercase">404</p>
        <h1 className="mb-3 text-2xl font-bold text-text">That album does not exist</h1>
        <p className="mb-6 leading-relaxed text-text-muted">
          The album you asked for is not here. It may have been renamed, or the link may be
          mistyped.
        </p>
        <Link
          href="/photos"
          className="rounded-full px-5 py-2 text-accent underline-offset-4 hover:underline"
        >
          Browse all album
        </Link>
      <SurfaceRim /></div>
    </main>
  );
}
