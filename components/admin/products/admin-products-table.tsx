"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminProduct, StockStatus } from "./data";

interface AdminProductsTableProps {
  products: AdminProduct[];
  onDeleteProduct?: (productId: string) => void;
  onToggleStatus?: (productId: string, status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => void;
}

const stockStatusConfig: Record<StockStatus, { label: string; className: string }> = {
  IN_STOCK: { label: "In Stock", className: "bg-success/10 text-success border-success/20" },
  LOW_STOCK: { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
  OUT_OF_STOCK: { label: "Out of Stock", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statusDisplay: Record<string, string> = {
  ACTIVE: "Active",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

export function AdminProductsTable({
  products,
  onDeleteProduct,
  onToggleStatus,
}: AdminProductsTableProps) {
  const router = useRouter();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-border/50 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider w-[80px]">
              Image
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Product
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              SKU
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Price
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Stock
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const mainSku = product.variants[0]?.sku || '—'
            const isVisible = product.status === 'ACTIVE'
            return (
            <TableRow key={product.id} className="hover:bg-muted/30">
              {/* Product Image */}
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden border border-border/50 bg-muted">
                  {product.image ? (
                    <OptimizedImage
                      src={product.image.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">
                      —
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Product Name */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    {product.name}
                  </span>
                  {!isVisible && (
                    <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                      {statusDisplay[product.status] || product.status}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* SKU */}
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {mainSku}
              </TableCell>

              {/* Price */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    ${product.basePrice.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${
                    isVisible
                      ? 'bg-success/10 text-success border-success/20'
                      : product.status === 'DRAFT'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-muted text-muted-foreground border-border/50'
                  }`}
                >
                  {statusDisplay[product.status] || product.status}
                </Badge>
              </TableCell>

              {/* Stock */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${stockStatusConfig[product.stockStatus].className}`}
                >
                  {stockStatusConfig[product.stockStatus].label}
                </Badge>
                <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground ml-2">
                  ({product.totalStock})
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-secondary"
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>

                  {/* More Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-secondary/50 hover:text-secondary"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {product.status === 'ACTIVE' ? (
                        <DropdownMenuItem
                          onClick={() => onToggleStatus?.(product.id, 'DRAFT')}
                          className="font-[family-name:var(--font-montserrat)] text-sm"
                        >
                          Move to Draft
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onToggleStatus?.(product.id, 'ACTIVE')}
                          className="font-[family-name:var(--font-montserrat)] text-sm"
                        >
                          Publish
                        </DropdownMenuItem>
                      )}
                      {product.status !== 'ARCHIVED' && (
                        <DropdownMenuItem
                          onClick={() => onToggleStatus?.(product.id, 'ARCHIVED')}
                          className="font-[family-name:var(--font-montserrat)] text-sm text-warning"
                        >
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDeleteProduct?.(product.id)}
                        className="font-[family-name:var(--font-montserrat)] text-sm text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
