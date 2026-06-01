import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbListSchema } from "@/components/seo/structured-data";
import { getAppUrl } from "@/lib/utils/app-url";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  includeJsonLd?: boolean;
  baseUrl?: string;
}

export function Breadcrumb({
  items,
  className,
  includeJsonLd = true,
  baseUrl = getAppUrl(),
}: BreadcrumbProps) {
  const crumbs = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      {includeJsonLd && (
        <JsonLd
          data={breadcrumbListSchema(
            crumbs.map((c) => ({
              name: c.label,
              item: c.href ? `${baseUrl}${c.href}` : "",
            })),
          )}
        />
      )}
      <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.href ?? crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              {i === 0 && <Home className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              {isLast || !crumb.href ? (
                <span
                  className={cn(
                    isLast ? "font-medium text-foreground" : "",
                    "truncate max-w-[200px]",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors truncate max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
