export interface ShippingAddressSnapshotInput {
  firstName: string
  lastName: string
  company: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
}

export interface OrderVariantSnapshotInput {
  size: string
  compressionLevel: string
  color: string | null
  sku: string
}

export function createShippingAddressSnapshot(address: ShippingAddressSnapshotInput) {
  return {
    shippingFirstName: address.firstName,
    shippingLastName: address.lastName,
    shippingCompany: address.company,
    shippingAddressLine1: address.addressLine1,
    shippingAddressLine2: address.addressLine2,
    shippingCity: address.city,
    shippingState: address.state,
    shippingPostalCode: address.postalCode,
    shippingCountry: address.country,
    shippingPhone: address.phone,
  }
}

export function createOrderItemSnapshot(productName: string, variant: OrderVariantSnapshotInput) {
  return {
    productNameSnapshot: productName,
    variantSizeSnapshot: variant.size,
    variantCompressionLevelSnapshot: variant.compressionLevel,
    variantColorSnapshot: variant.color,
    variantSkuSnapshot: variant.sku,
  }
}
