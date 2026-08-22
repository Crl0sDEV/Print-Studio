export type UserRole = 'owner' | 'staff' | 'superadmin'

export type SubscriptionPlan = 'free' | 'pro'

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'canceled'

export type OrderStatus = 'pending' | 'processing' | 'printing' | 'ready' | 'completed' | 'canceled'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type SupportTicketCategory = 'billing' | 'studio' | 'orders' | 'bug' | 'general'

export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type SenderRole = 'user' | 'admin'

export type NotificationType = 'support' | 'subscription' | 'order' | 'system'

export interface Profile {
  id: string
  shop_id: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Shop {
  id: string
  owner_id: string
  name: string
  slug: string
  address: string | null
  contact_number: string | null
  plan: SubscriptionPlan
  plan_expires_at: string | null
  subscription_status: SubscriptionStatus
  created_at: string
}

export interface Order {
  id: string
  shop_id: string
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  total_amount: number
  customer_name: string
  customer_contact: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  preset_id: string | null
  quantity: number
  file_url: string
  file_name: string
  unit_price: number
  subtotal: number
  created_at: string
}

export interface SubscriptionRequest {
  id: string
  shop_id: string
  user_id: string
  plan: SubscriptionPlan
  billing_cycle: 'monthly' | 'annual'
  amount: number
  payment_method: 'gcash' | 'maya'
  reference_number: string
  receipt_url: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by: string | null
  reviewed_at: string | null
  notes: string | null
  created_at: string
}

export interface SupportTicket {
  id: string
  ticket_number: string
  shop_id: string
  user_id: string
  subject: string
  category: SupportTicketCategory
  priority: SupportTicketPriority
  status: SupportTicketStatus
  created_at: string
  updated_at: string
  shops?: {
    name: string
    slug: string
  }
  support_messages?: SupportMessage[]
}

export interface SupportMessage {
  id: string
  ticket_id: string
  sender_id: string
  sender_role: SenderRole
  message: string
  created_at: string
}

export interface AppNotification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  link_url: string | null
  is_read: boolean
  created_at: string
}

export interface PricingMatrix {
  id: string
  preset_id: string
  min_quantity: number
  max_quantity: number | null
  color_mode: string | null
  unit_price: number
  unit?: string
  rush_multiplier?: number
  created_at: string
}

export interface Preset {
  id: string
  shop_id: string
  name: string
  category?: string
  paper_size: string
  paper_type: string
  is_active: boolean
  created_at: string
}

export interface PresetWithMatrix extends Preset {
  pricing_matrices?: PricingMatrix[]
}
