import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { KanbanBoard } from '@/components/dashboard/kanban-board'

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!shop) redirect('/onboarding')

  // Fetch active orders with their items
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, presets(name, category, paper_type))')
    .eq('shop_id', shop.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
          <p className="text-muted-foreground">Drag and drop orders to update their status in real-time.</p>
        </div>
        
        <KanbanBoard initialOrders={orders || []} />
    </div>
  )
}
