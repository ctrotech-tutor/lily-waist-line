import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createOrderItemSnapshot,
  createShippingAddressSnapshot,
} from '../../lib/services/order-snapshots'

describe('order display snapshots', () => {
  it('copies every shipping field into the order snapshot without changing its value', () => {
    const address = {
      firstName: 'Amina',
      lastName: 'Okafor',
      company: null,
      addressLine1: '14 Broad Street',
      addressLine2: 'Flat 2',
      city: 'Lagos',
      state: 'Lagos',
      postalCode: '101001',
      country: 'Nigeria',
      phone: '+234 800 000 0000',
    }

    const snapshot = createShippingAddressSnapshot(address)
    assert.deepEqual(snapshot, {
      shippingFirstName: 'Amina',
      shippingLastName: 'Okafor',
      shippingCompany: null,
      shippingAddressLine1: '14 Broad Street',
      shippingAddressLine2: 'Flat 2',
      shippingCity: 'Lagos',
      shippingState: 'Lagos',
      shippingPostalCode: '101001',
      shippingCountry: 'Nigeria',
      shippingPhone: '+234 800 000 0000',
    })

    address.firstName = 'Updated Name'
    address.addressLine1 = '99 New Street'
    assert.equal(snapshot.shippingFirstName, 'Amina')
    assert.equal(snapshot.shippingAddressLine1, '14 Broad Street')
  })

  it('copies product and variant labels while preserving optional color', () => {
    const variant = {
      size: 'Medium',
      compressionLevel: 'Firm',
      color: 'Black',
      sku: 'CWT-M-BLK',
    }
    const itemSnapshot = createOrderItemSnapshot('Classic Waist Trainer', variant)
    assert.deepEqual(itemSnapshot, {
      productNameSnapshot: 'Classic Waist Trainer',
      variantSizeSnapshot: 'Medium',
      variantCompressionLevelSnapshot: 'Firm',
      variantColorSnapshot: 'Black',
      variantSkuSnapshot: 'CWT-M-BLK',
    })

    variant.size = 'Large'
    variant.sku = 'UPDATED-SKU'
    assert.equal(itemSnapshot.variantSizeSnapshot, 'Medium')
    assert.equal(itemSnapshot.variantSkuSnapshot, 'CWT-M-BLK')

    assert.equal(createOrderItemSnapshot('Classic Waist Trainer', {
      size: 'Medium',
      compressionLevel: 'Firm',
      color: null,
      sku: 'CWT-M',
    }).variantColorSnapshot, null)
  })
})
