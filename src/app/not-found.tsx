
import { SurfaceRim } from "../ui/SurfaceRim";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6">
      <div className="surface-widget surface-widget-80 surface-edge max-w-lg rounded-2xl p-8 text-center">
        <p className="mb-2 text-sm tracking-widest text-text-muted uppercase">404</p>
        <h1 className="mb-3 text-2xl font-bold text-text">There is nothing here</h1>
        <p className="mb-6 leading-relaxed text-text-muted">
          That address does not match anything on this site. It may have moved, or it may
          never have existed.
        </p>
        <Link
          href="/"
          className="rounded-full px-5 py-2 text-accent underline-offset-4 hover:underline"
        >
          Go home
        </Link>
      <SurfaceRim /></div>
    </main>
  );
}
