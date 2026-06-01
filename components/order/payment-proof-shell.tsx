import { cn } from "@/lib/utils";

export interface PaymentProofShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PaymentProofShell({
  children,
  className,
}: PaymentProofShellProps) {
  return (
    <div className={cn("min-h-full bg-background", className)}>
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12 lg:py-16">
        {children}
      </div>
    </div>
  );
}