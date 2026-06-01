import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { OptimizedImage } from "@/components/shared/optimized-image"

interface TrackingItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  product: {
    id: string
    name: string
    slug: string
    image: { url: string } | null
  }
  variant: {
    id: string
    size: string
    compressionLevel: string
    sku: string
  }
}

interface TrackingItemsCardProps {
  items: TrackingItem[]
}

export function TrackingItemsCard({ items }: TrackingItemsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans text-base">
          <Package className="w-4 h-4" /> Order Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id}>
            {index > 0 && <Separator className="mb-3" />}
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                {item.product.image ? (
                  <OptimizedImage src={item.product.image.url} alt={item.product.name} className="w-full h-full object-cover" width={56} height={56} />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium truncate">{item.product.name}</p>
                <p className="font-sans text-xs text-muted-foreground">
                  {item.variant.size} / {item.variant.compressionLevel}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-sans text-xs text-muted-foreground">Qty: {item.quantity}</span>
                  <span className={cn("font-sans text-sm font-semibold")}>${item.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}