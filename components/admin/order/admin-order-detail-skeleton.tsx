"use client";

export function AdminOrderDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-24 bg-muted rounded" />

      <div className="space-y-2">
        <div className="h-6 w-64 bg-muted rounded" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-64 bg-muted rounded" />
        <div className="h-10 w-80 bg-muted rounded" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border/50 p-6 space-y-4">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-48 w-full bg-muted rounded" />
            <div className="flex gap-3">
              <div className="h-9 w-28 bg-muted rounded" />
              <div className="h-9 w-28 bg-muted rounded" />
            </div>
          </div>
          <div className="rounded-lg border border-border/50 p-6 space-y-4">
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="h-5 w-24 bg-muted rounded" />
            <div className="flex flex-wrap gap-3">
              <div className="h-9 w-36 bg-muted rounded" />
              <div className="h-9 w-32 bg-muted rounded" />
              <div className="h-9 w-28 bg-muted rounded" />
            </div>
            <div className="h-px bg-border/50" />
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-9 w-56 bg-muted rounded" />
            <div className="h-9 w-36 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border border-border/50 p-6 space-y-3">
            <div className="h-5 w-36 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-4 w-56 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
          <div className="rounded-lg border border-border/50 p-6 space-y-4">
            <div className="h-5 w-28 bg-muted rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            ))}
            <div className="h-px bg-border/50" />
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-16 bg-muted rounded" />
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}