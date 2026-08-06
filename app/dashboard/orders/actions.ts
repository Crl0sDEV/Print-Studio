'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update status', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}

export async function updatePaymentStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ payment_status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update payment status', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}
