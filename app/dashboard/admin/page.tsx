import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminStatsCards } from '@/components/admin/admin-stats-cards'
import { SubscriptionApprovalQueue } from '@/components/admin/subscription-approval-queue'
import { UserManagementTable } from '@/components/admin/user-management-table'
import { isProPlanActive } from '@/lib/plans'

export const metadata = {
  title: 'Super Admin Dashboard | Prynt',
  description: 'Platform management, subscription verifications, and shop directory.',
}

export default async function SuperAdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify Super Admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    redirect('/dashboard')
  }

  // Fetch pending subscription requests with shop info
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
  const estimatedRevenuePhp = activeProShops.length * 199 // baseline run-rate

  const stats = {
    totalShops: shopsList.length,
    totalUsers: shopsList.length,
    activeProShops: activeProShops.length,
    pendingRequests: (pendingRequests || []).length,
    estimatedRevenuePhp,
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Platform Master
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verify GCash & Maya manual payment slips, manage print shop subscriptions, and oversee platform growth.
        </p>
      </div>

      {/* 1. Metrics Cards */}
      <AdminStatsCards stats={stats} />

      {/* 2. Pending Approvals Queue */}
      <SubscriptionApprovalQueue requests={pendingRequests || []} />

      {/* 3. User & Shop Directory */}
      <UserManagementTable shops={shopsList} />
    </div>
  )
}
