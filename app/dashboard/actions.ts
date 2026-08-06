'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createPreset(formData: FormData) {
  const supabase = await createClient()

  const shopId = formData.get('shopId') as string
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const paperType = formData.get('paper_type') as string
  const widthStr = formData.get('width') as string
  const heightStr = formData.get('height') as string
  const defaultSideOption = formData.get('default_side_option') as string

  const width = widthStr ? parseFloat(widthStr) : null
  const height = heightStr ? parseFloat(heightStr) : null

  await supabase
    .from('presets')
    .insert({
      shop_id: shopId,
      name,
      category,
      paper_type: paperType || null,
      width_inches: width,
      height_inches: height,
      default_side_option: defaultSideOption,
      is_active: true,
    })

  revalidatePath('/dashboard')
}

export async function createPricingMatrix(formData: FormData) {
  const supabase = await createClient()

  const shopId = formData.get('shopId') as string
  const presetId = formData.get('presetId') as string
  const name = formData.get('name') as string
  const unit = formData.get('unit') as string
  const colorMode = formData.get('color_mode') as string
  const minQuantity = parseInt(formData.get('min_quantity') as string)
  const maxQuantityStr = formData.get('max_quantity') as string
  const unitPrice = parseFloat(formData.get('unit_price') as string)
  const rushMultiplier = parseFloat(formData.get('rush_multiplier') as string)

  await supabase
    .from('pricing_matrices')
    .insert({
      shop_id: shopId,
      preset_id: presetId,
      name,
      unit,
      color_mode: colorMode,
      min_quantity: minQuantity,
      max_quantity: maxQuantityStr ? parseInt(maxQuantityStr) : null,
      unit_price: unitPrice,
      rush_multiplier: rushMultiplier,
    })

  revalidatePath('/dashboard')
}

export async function updateShopSettings(formData: FormData) {
  const supabase = await createClient()

  const shopId = formData.get('shopId') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!shopId || !name || !slug) return

  await supabase
    .from('shops')
    .update({ name, slug })
    .eq('id', shopId)

  revalidatePath('/dashboard')
  revalidatePath(`/${slug}`)
}
