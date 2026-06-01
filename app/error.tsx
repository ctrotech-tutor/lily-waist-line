"use client";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center justify-center border border-primary/20 bg-background p-4">
        <span className="font-heading text-6xl text-primary">LWL</span>
      </div>
      <h1 className="font-heading text-3xl text-foreground">Something went wrong</h1>
      <p className="max-w-md font-sans text-sm text-muted-foreground">
        An unexpected error occurred. Our team has been notified.
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
