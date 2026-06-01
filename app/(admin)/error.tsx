"use client";

export default function AdminError({
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
 <div className="flex items-center justify-center border border-destructive/20 bg-destructive/5 p-4">
 <span className="font-heading text-4xl text-destructive">Error</span>
 </div>
 <h1 className="font-heading text-2xl text-foreground">Admin dashboard error</h1>
 <p className="max-w-md 
text-sm text-muted-foreground">
 Something went wrong loading this page. Please try again.
 </p>
 <button
 onClick={reset}
 className="bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
 >
 Reload
 </button>
 </div>
 );
}
