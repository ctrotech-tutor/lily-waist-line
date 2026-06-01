"use client";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-heading text-3xl text-foreground">Something went wrong</h1>
      <p className="max-w-md font-sans text-sm text-muted-foreground">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
      >
        Try Again
      </button>
    </div>
  );
}
