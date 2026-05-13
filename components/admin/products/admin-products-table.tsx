"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
  onToggleVisibility?: (productId: string, isVisible: boolean) => void;
}

const stockStatusConfig: Record<StockStatus, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  "low-stock": { label: "Low Stock", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  "out-of-stock": { label: "Out of Stock", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminProductsTable({
  products,
  onDeleteProduct,
  onToggleVisibility,
}: AdminProductsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (productId: string) => {
    setDeletingId(productId);
    // Simulate delete delay
    setTimeout(() => {
      onDeleteProduct?.(productId);
      setDeletingId(null);
    }, 300);
  };

  const handleToggleVisibility = (productId: string, currentVisibility: boolean) => {
    onToggleVisibility?.(productId, !currentVisibility);
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-border/50">
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
              Stock Status
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
              Category
            </TableHead>
            <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-muted/30">
              {/* Product Image */}
              <TableCell>
                <div className="relative h-12 w-12 overflow-hidden border border-border/50 bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              </TableCell>

              {/* Product Name */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    {product.name}
                  </span>
                  {!product.isVisible && (
                    <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
              </TableCell>

              {/* SKU */}
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {product.sku}
              </TableCell>

              {/* Price */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Stock Status */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={`font-[family-name:var(--font-montserrat)] text-xs ${stockStatusConfig[product.stockStatus].className}`}
                >
                  {stockStatusConfig[product.stockStatus].label}
                </Badge>
                <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground ml-2">
                  ({product.stockQuantity})
                </span>
              </TableCell>

              {/* Category */}
              <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {product.category}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* View Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/product/${product.id}/${product.name.toLowerCase().replace(/\s+/g, "-")}`)}
                    className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    View
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                    className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
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
                        disabled={deletingId === product.id}
                        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs border-border/50 hover:border-[#d4af37]/50 hover:text-[#d4af37] rounded-none"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                      <DropdownMenuItem
                        onClick={() => handleToggleVisibility(product.id, product.isVisible)}
                        className="font-[family-name:var(--font-montserrat)] text-sm"
                      >
                        {product.isVisible ? "Hide Product" : "Show Product"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="font-[family-name:var(--font-montserrat)] text-sm text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
