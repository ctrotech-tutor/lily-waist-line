"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export function RecentOrdersSkeleton() {
  return (
    <Card className="border-border/50 animate-pulse">
      <CardHeader>
        <div className="h-6 w-32 bg-muted rounded" />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, i) => (
                  <TableHead key={i}>
                    <div className="h-3 w-16 bg-muted rounded" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, row) => (
                <TableRow key={row}>
                  {[...Array(5)].map((_, col) => (
                    <TableCell key={col}>
                      <div className="h-4 w-20 bg-muted rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}