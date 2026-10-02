// Shared order number formatting — single source of truth
export function formatOrderNumber(id: string, year?: number | Date): string {
  const y = year instanceof Date ? year.getFullYear() : (year ?? new Date().getFullYear())
  return `LWL-${y}-${id.slice(-6).toUpperCase()}`
}