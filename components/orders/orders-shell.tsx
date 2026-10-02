import { cn } from "@/lib/utils";

export interface OrdersShellProps {
  children: React.ReactNode;
  className?: string;
}

export function OrdersShell({ children, className }: OrdersShellProps) {
  return (
    <div className={cn("min-h-full bg-background", className)}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
}