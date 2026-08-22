import { z } from 'zod'

export const SubscriptionUpgradeSchema = z.object({
  shopId: z.string().uuid('Invalid shop identifier'),
  plan: z.enum(['pro', 'free']),
  billingCycle: z.enum(['monthly', 'annual']),
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['gcash', 'maya']),
  referenceNumber: z
    .string()
    .trim()
    .min(6, 'Reference number is required')
    .max(30, 'Reference number is too long'),
})

export const ReviewSubscriptionSchema = z.object({
  requestId: z.string().uuid('Invalid request identifier'),
  shopId: z.string().uuid('Invalid shop identifier'),
  action: z.enum(['approve', 'reject']),
  durationDays: z.coerce.number().int().positive().optional().default(30),
})

export const ManualPlanUpdateSchema = z.object({
  shopId: z.string().uuid('Invalid shop identifier'),
  plan: z.enum(['pro', 'free']),
  durationDays: z.coerce.number().int().positive().optional().default(30),
})

export type SubscriptionUpgradeInput = z.infer<typeof SubscriptionUpgradeSchema>
export type ReviewSubscriptionInput = z.infer<typeof ReviewSubscriptionSchema>
export type ManualPlanUpdateInput = z.infer<typeof ManualPlanUpdateSchema>
