import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrintReceiptClient } from './print-client'

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      shops (*),
      order_items (
        *,
        presets (*)
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (!order) return <div>Order not found</div>

  return <PrintReceiptClient order={order} />
}
