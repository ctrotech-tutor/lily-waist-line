import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrackingAddress {
  id: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string | null
}

interface TrackingAddressCardProps {
  address: TrackingAddress
}

export function TrackingAddressCard({ address }: TrackingAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans text-base">
          <MapPin className="w-4 h-4" /> Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-sans text-sm space-y-1">
          <p className="font-medium">{address.firstName} {address.lastName}</p>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} {address.postalCode}</p>
          <p>{address.country}</p>
          {address.phone && <p className="text-muted-foreground mt-2">{address.phone}</p>}
        </div>
      </CardContent>
    </Card>
  )
}