import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { PresetsCatalog } from '@/components/dashboard/presets-catalog'
import { QuickCalculator } from '@/components/dashboard/quick-calculator'

export default async function DashboardPage() {
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

  // Optimize multiple queries into Promise.all
  const [{ count: presetsCount }, { data: orders }, { data: presets }] = await Promise.all([
    supabase
      .from('presets')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shop.id)
      .eq('is_active', true),
    supabase
      .from('orders')
      .select('status, total_amount, payment_status')
      .eq('shop_id', shop.id),
    supabase
      .from('presets')
      .select('*, pricing_matrices(*)')
      .eq('shop_id', shop.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
  ])

  const totalOrders = orders?.length || 0
  const totalRevenue = orders
    ?.filter(o => o.payment_status === 'paid')
    .reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <StatsOverview 
          totalOrders={totalOrders} 
          presetsCount={presetsCount || 0} 
          totalRevenue={totalRevenue} 
        />
        
        <QuickCalculator presets={presets} />

        <PresetsCatalog presets={presets} shopId={shop.id} />
    </div>
  )
}