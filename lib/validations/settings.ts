import { z } from 'zod'

export const UpdateShopSettingsSchema = z.object({
  shopId: z.string().uuid('Invalid shop identifier'),
  name: z.string().trim().min(2, 'Shop name is required'),
  address: z.string().trim().nullable().optional(),
  contactNumber: z.string().trim().nullable().optional(),
})

export type UpdateShopSettingsInput = z.infer<typeof UpdateShopSettingsSchema>
