import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminStatsCards } from '@/components/admin/admin-stats-cards'
import { SubscriptionApprovalQueue } from '@/components/admin/subscription-approval-queue'
import { UserManagementTable } from '@/components/admin/user-management-table'
import { isProPlanActive } from '@/lib/plans'

export const metadata = {
  title: 'Platform Master Dashboard | Prynt Admin',
  description: 'Manage print shop subscribers, verify GCash & Maya proof slips, and view platform metrics.',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Verify Superadmin privileges strictly
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    redirect('/admin/login?error=Access%20denied.%20Superadmin%20privileges%20required.')
  }

  // Fetch pending subscription requests with shop details
  const { data: pendingRequests } = await supabase
    .from('subscription_requests')
    .select('*, shops(name, slug)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Fetch all registered shops with owner profile
  const { data: allShops } = await supabase
    .from('shops')
    .select('*, profiles(full_name, role)')
    .order('created_at', { ascending: false })

  const shopsList = allShops || []
  const activeProShops = shopsList.filter((s) => isProPlanActive(s))
  const estimatedRevenuePhp = activeProShops.length * 199

  const stats = {
    totalShops: shopsList.length,
    totalUsers: shopsList.length,
    activeProShops: activeProShops.length,
    pendingRequests: (pendingRequests || []).length,
    estimatedRevenuePhp,
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-border/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Master HQ
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify manual GCash & Maya payments, manage subscribers, and oversee all registered print shops.
          </p>
        </div>
      </div>

      {/* 1. KPIs */}
      <AdminStatsCards stats={stats} />

      {/* 2. Verification Queue */}
      <SubscriptionApprovalQueue requests={pendingRequests || []} />

      {/* 3. Shops Directory */}
      <UserManagementTable shops={shopsList} />
    </div>
  )
}
