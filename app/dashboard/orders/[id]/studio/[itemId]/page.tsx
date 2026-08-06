import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrintStudioClient } from './studio-client'

export default async function StudioPage({ params }: { params: Promise<{ id: string, itemId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orderItem } = await supabase
    .from('order_items')
    .select(`
      *,
      orders (*),
      presets (*)
    `)
    .eq('id', resolvedParams.itemId)
    .single()

  if (!orderItem) return <div>Order item not found</div>

  return <PrintStudioClient item={orderItem} />
}
