import { z } from 'zod'

export const CreateTicketSchema = z.object({
  shopId: z.string().uuid('Invalid shop identifier'),
  category: z.enum(['billing', 'studio', 'orders', 'bug', 'general']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(5, 'Message description must be at least 5 characters'),
})

export const SendMessageSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket identifier'),
  message: z.string().trim().min(1, 'Message cannot be empty'),
  senderRole: z.enum(['user', 'admin']).default('user'),
})

export const UpdateTicketStatusSchema = z.object({
  ticketId: z.string().uuid('Invalid ticket identifier'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
})

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>
export type SendMessageInput = z.infer<typeof SendMessageSchema>
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>
