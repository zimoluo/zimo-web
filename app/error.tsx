"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RouteError({
  error,
  reset,
}: {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6">
      <div className="surface-widget surface-widget-80 surface-edge max-w-lg rounded-2xl p-8 text-center">
        <h1 className="mb-3 text-2xl font-bold text-text">Something went wrong</h1>
        <p className="mb-6 leading-relaxed text-text-muted">
          This part of the page failed to load. You can try again, or head back home.
        </p>
        {error.digest !== undefined && (
          <p className="mb-6 text-xs text-text-muted">Reference: {error.digest}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line px-5 py-2 text-text transition-colors hover:bg-fill/40"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full px-5 py-2 text-accent underline-offset-4 hover:underline"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
