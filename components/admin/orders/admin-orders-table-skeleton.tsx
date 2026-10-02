"use client";

export function AdminOrdersTableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="overflow-x-auto border border-border/50">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              {["Order ID", "Customer", "Amount", "Payment", "Fulfillment", "Date", "Actions"].map((_, i) => (
                <th key={i} className="h-10 px-4 text-left">
                  <div className="h-3 w-16 bg-muted rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, row) => (
              <tr key={row} className="border-t border-border/50">
                {[...Array(7)].map((_, col) => (
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