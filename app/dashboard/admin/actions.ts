'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Helper to check superadmin authority
async function verifySuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    throw new Error('Unauthorized: Superadmin access required')
  }

  return { supabase, user }
}

export async function approveSubscription(requestId: string, shopId: string, durationDays: number = 30) {
  const { supabase, user } = await verifySuperAdmin()

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + durationDays)

  // 1. Update subscription request
  const { error: reqError } = await supabase
    .from('subscription_requests')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (reqError) {
    console.error('Approve subscription request error:', reqError)
    return { error: 'Failed to approve request' }
  }

  // 2. Activate Pro plan for the shop
  const { error: shopError } = await supabase
    .from('shops')
    .update({
      plan: 'pro',
      plan_expires_at: expiresAt.toISOString(),
      subscription_status: 'active',
    })
    .eq('id', shopId)

  if (shopError) {
    console.error('Update shop plan error:', shopError)
    return { error: 'Failed to activate Pro on shop' }
  }

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/billing')
  revalidatePath('/dashboard/studio')
  return { success: true }
}

export async function rejectSubscription(requestId: string, adminNotes: string) {
  const { supabase, user } = await verifySuperAdmin()

  const { error } = await supabase
    .from('subscription_requests')
    .update({
      status: 'rejected',
      admin_notes: adminNotes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (error) {
    console.error('Reject subscription error:', error)
    return { error: 'Failed to reject request' }
  }

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/billing')
  return { success: true }
}

export async function updateShopPlanManually(shopId: string, plan: string, durationDays: number | null) {
  const { supabase } = await verifySuperAdmin()

  let expiresAt: string | null = null
  if (durationDays && durationDays > 0) {
    const d = new Date()
    d.setDate(d.getDate() + durationDays)
    expiresAt = d.toISOString()
  }

  const { error } = await supabase
    .from('shops')
    .update({
      plan: plan,
      plan_expires_at: expiresAt,
      subscription_status: plan === 'free' ? 'active' : 'active',
    })
    .eq('id', shopId)

  if (error) {
    console.error('Manual plan update error:', error)
    return { error: 'Failed to update plan' }
  }

  revalidatePath('/dashboard/admin')
  revalidatePath('/dashboard/billing')
  revalidatePath('/dashboard/studio')
  return { success: true }
}
