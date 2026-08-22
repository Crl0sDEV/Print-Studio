import { z } from 'zod'

export const SubmitOrderSchema = z.object({
  shopId: z.string().uuid('Invalid shop identifier'),
  slug: z.string().min(1, 'Shop slug is required'),
  customerName: z.string().trim().min(2, 'Customer name is required'),
  customerContact: z.string().trim().min(5, 'Valid contact number is required'),
  presetId: z.string().uuid('Invalid preset').nullable().optional(),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  totalAmount: z.coerce.number().positive('Total amount must be positive'),
})

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid('Invalid order identifier'),
  status: z.enum(['pending', 'processing', 'printing', 'ready', 'completed', 'canceled']),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional(),
})

export type SubmitOrderInput = z.infer<typeof SubmitOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>
