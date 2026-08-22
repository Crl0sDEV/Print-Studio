import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudioWorkspace } from '@/components/studio/studio-workspace'
import { IdPresetKey } from '@/types/studio'

export const metadata = {
  title: 'Order Item Studio | Prynt',
}

export default async function OrderStudioPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orderItem } = await supabase
    .from('order_items')
    .select(`
      *,
      orders (
        id,
        order_number,
        customer_name
      ),
      presets (*)
    `)
    .eq('id', resolvedParams.itemId)
    .single()

  if (!orderItem) return <div className="p-8 text-center text-muted-foreground">Order item not found</div>

  let detectedPreset: IdPresetKey = '2x2'
  if (orderItem.presets?.name?.toLowerCase().includes('1x1')) {
    detectedPreset = '1x1'
  } else if (orderItem.presets?.name?.toLowerCase().includes('passport')) {
    detectedPreset = 'passport_ph'
  }

  return (
    <StudioWorkspace
      initialImageUrl={orderItem.file_url || undefined}
      initialPreset={detectedPreset}
      orderInfo={{
        orderNumber: orderItem.orders?.order_number || resolvedParams.id.slice(0, 8),
        customerName: orderItem.orders?.customer_name || 'Valued Customer',
      }}
    />
  )
}
