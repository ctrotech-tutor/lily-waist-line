"use client";

export function AdminShippingStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse border border-border/50 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-4 w-4 bg-muted rounded" />
          </div>
          <div className="h-8 w-16 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function AdminShippingTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="overflow-x-auto border border-border/50">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              {["Order ID", "Customer", "Status", "Carrier", "Tracking", "Actions"].map((_, i) => (
                <th key={i} className="h-10 px-4 text-left">
                  <div className="h-3 w-16 bg-muted rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, row) => (
              <tr key={row} className="border-t border-border/50">
                {[...Array(6)].map((_, col) => (
                  <td key={col} className="px-4 py-3">
                    <div className="h-4 w-20 bg-muted rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}