/**
 * Address-related types
 */

// Address data structure used in checkout
export interface AddressCardData {
  id: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode?: string
  country: string
  phone?: string
  isDefault: boolean
}
