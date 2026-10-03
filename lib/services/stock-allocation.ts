export function distributeTotalStock(totalStock: number, variantCount: number): number[] {
  if (!Number.isInteger(totalStock) || totalStock < 0) {
    throw new RangeError("Total stock must be a non-negative integer")
  }
  if (!Number.isInteger(variantCount) || variantCount < 1) {
    throw new RangeError("Variant count must be a positive integer")
  }

  const stockPerVariant = Math.floor(totalStock / variantCount)
  const remainder = totalStock % variantCount
  return Array.from({ length: variantCount }, (_, index) =>
    stockPerVariant + (index < remainder ? 1 : 0),
  )
}
