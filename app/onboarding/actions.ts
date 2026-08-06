'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createShop(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const name = formData.get('shopName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`

  // 1. Insert new Shop
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      owner_id: user.id,
      name,
      slug,
      phone_number: phone,
      address,
    })
    .select()
    .single()

  if (shopError) {
    return redirect(`/onboarding?error=${encodeURIComponent(shopError.message)}`)
  }

  // 2. Update Profile with newly created shop_id
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ shop_id: shop.id })
    .eq('id', user.id)

  if (profileError) {
    return redirect(`/onboarding?error=${encodeURIComponent(profileError.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}