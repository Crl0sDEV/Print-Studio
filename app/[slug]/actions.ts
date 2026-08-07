'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { google } from 'googleapis'
import { Readable } from 'stream'

const OrderSchema = z.object({
  shopId: z.string().uuid(),
  presetId: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  estimatedPrice: z.number().min(0),
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().min(5, 'Contact is required'),
  slug: z.string(),
})

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    shopId: formData.get('shopId'),
    presetId: formData.get('presetId'),
    quantity: Number(formData.get('quantity')),
    estimatedPrice: Number(formData.get('estimatedPrice')),
    customerName: formData.get('customerName'),
    customerEmail: formData.get('customerEmail'),
    slug: formData.get('slug'),
  }

  const validatedData = OrderSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error('Validation Error:', validatedData.error)
    redirect(`/${rawData.slug}?error=invalid_data`)
  }

  const { shopId, presetId, quantity, estimatedPrice: totalAmount, customerName, customerEmail: customerContact, slug } = validatedData.data
  const file = formData.get('printFile') as File | null

  let fileUrl = null
  let originalFileName = null

  // Fetch Shop Settings for GDrive Token
  const { data: shop } = await supabase
    .from('shops')
    .select('gdrive_refresh_token')
    .eq('id', shopId)
    .single()

  // Process File Upload if attached
  if (file && file.size > 0) {
    if (shop?.gdrive_refresh_token) {
      // Use Google Drive
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      )
      oauth2Client.setCredentials({ refresh_token: shop.gdrive_refresh_token })
      const drive = google.drive({ version: 'v3', auth: oauth2Client })

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const stream = Readable.from(buffer)

      try {
        const driveRes = await drive.files.create({
          requestBody: { name: `PRYNT_${Date.now()}_${file.name}` },
          media: { mimeType: file.type, body: stream },
          fields: 'id, webViewLink'
        })
        fileUrl = driveRes.data.webViewLink
        originalFileName = file.name
      } catch (err) {
        console.error('Google Drive Upload Failed:', err)
        redirect(`/${slug}?error=upload_failed`)
      }
    } else {
      // Fallback to Supabase
      const fileExt = file.name.split('.').pop()
      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `orders/${shopId}/${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('print_assets')
        .upload(filePath, file)

      if (uploadError) {
        console.error('File upload failed:', uploadError)
        redirect(`/${slug}?error=upload_failed`)
      }

      const { data } = supabase.storage.from('print_assets').getPublicUrl(filePath)
      fileUrl = data.publicUrl
      originalFileName = file.name
    }
  }

  const { data, error } = await supabase.rpc('submit_public_order', {
    p_shop_id: shopId,
    p_order_number: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    p_total_amount: totalAmount,
    p_customer_name: customerName,
    p_customer_contact: customerContact,
    p_preset_id: presetId,
    p_quantity: quantity,
    p_file_url: fileUrl,
    p_file_name: originalFileName,
    p_unit_price: totalAmount / quantity
  })

  if (error) {
    console.error('Order submission failed via RPC:', error)
    redirect(`/${slug}?error=submission_failed`)
  }

  redirect(`/${slug}?success=true`)
}
