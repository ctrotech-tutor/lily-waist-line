import { cn } from "@/lib/utils";

export interface OrderDetailsShellProps {
  children: React.ReactNode;
  className?: string;
}

export function OrderDetailsShell({ children, className }: OrderDetailsShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
}