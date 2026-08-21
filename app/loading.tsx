export default function Loading() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center px-6">
      <div
        className="surface-widget surface-widget-60 w-full max-w-2xl animate-pulse rounded-2xl p-8"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading</span>
        <div className="mb-4 h-7 w-2/3 rounded-lg bg-fill/50" />
        <div className="mb-2.5 h-4 w-full rounded-md bg-fill/40" />
        <div className="mb-2.5 h-4 w-11/12 rounded-md bg-fill/40" />
        <div className="h-4 w-3/4 rounded-md bg-fill/40" />
      </div>
    </main>
  );
}
