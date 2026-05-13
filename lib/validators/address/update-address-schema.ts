import { z } from 'zod'

export const updateAddressSchema = z.object({
  id: z.string().min(1, 'Address ID is required'),
  
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less')
    .trim()
    .optional(),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less')
    .trim()
    .optional(),
  
  company: z.string()
    .max(100, 'Company name must be 100 characters or less')
    .trim()
    .optional(),
  
  addressLine1: z.string()
    .min(1, 'Address line 1 is required')
    .max(200, 'Address line 1 must be 200 characters or less')
    .trim()
    .optional(),
  
  addressLine2: z.string()
    .max(200, 'Address line 2 must be 200 characters or less')
    .trim()
    .optional(),
  
  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be 100 characters or less')
    .trim()
    .optional(),
  
  state: z.string()
    .min(1, 'State is required')
    .max(100, 'State must be 100 characters or less')
    .trim()
    .optional(),
  
  postalCode: z.string()
    .min(1, 'Postal code is required')
    .max(20, 'Postal code must be 20 characters or less')
    .trim()
    .optional(),
  
  country: z.string()
    .min(1, 'Country is required')
    .max(100, 'Country must be 100 characters or less')
    .trim()
    .optional(),
  
  phone: z.string()
    .max(20, 'Phone number must be 20 characters or less')
    .trim()
    .optional(),
  
  isDefault: z.boolean().optional()
})

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>
