"use client";

import { AdminProductFormShell } from "@/components/admin/products/form";

export default function NewProductPage() {
  return (
    <div className="py-4">
      <AdminProductFormShell mode="create" />
    </div>
  );
}
