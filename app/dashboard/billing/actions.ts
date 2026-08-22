'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function submitSubscriptionRequest(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Authentication required' }
  }

  const shopId = formData.get('shopId') as string
  const planTier = formData.get('planTier') as string
  const amountPaid = Number(formData.get('amountPaid'))
  const paymentMethod = formData.get('paymentMethod') as string
  const referenceNumber = formData.get('referenceNumber') as string
  const receiptFile = formData.get('receiptFile') as File | null

  if (!shopId || !planTier || !amountPaid || !referenceNumber || !receiptFile || receiptFile.size === 0) {
    return { error: 'Please provide all required payment details and proof of payment' }
  }

  try {
    // 1. Upload receipt to storage bucket
    const fileExt = receiptFile.name.split('.').pop() || 'png'
    const fileName = `receipt_${shopId}_${Date.now()}.${fileExt}`
    const filePath = `receipts/${shopId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('payment_receipts')
      .upload(filePath, receiptFile, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Receipt upload error:', uploadError)
      return { error: 'Failed to upload receipt screenshot. Please try again.' }
    }

    const { data: { publicUrl } } = supabase.storage.from('payment_receipts').getPublicUrl(filePath)

    // 2. Insert into subscription_requests table
    const { error: dbError } = await supabase
      .from('subscription_requests')
      .insert({
        shop_id: shopId,
        user_id: user.id,
        plan_tier: planTier,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        reference_number: referenceNumber.trim(),
        receipt_url: publicUrl,
        status: 'pending',
      })

    if (dbError) {
      console.error('Subscription request insert error:', dbError)
      return { error: 'Failed to record subscription request.' }
    }

    // 3. Update shop subscription_status to pending_verification
    await supabase
      .from('shops')
      .update({ subscription_status: 'pending_verification' })
      .eq('id', shopId)

    revalidatePath('/dashboard/billing')
    revalidatePath('/dashboard/admin')
    return { success: true }
  } catch (err) {
    console.error('Subscription submission exception:', err)
    return { error: 'Unexpected error occurred while submitting payment' }
  }
}
