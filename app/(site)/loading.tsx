export default function SiteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Loading</p>
      </div>
    </div>
  );
}