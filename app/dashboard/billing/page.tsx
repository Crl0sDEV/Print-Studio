import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingClientView } from './billing-client-view'

export const metadata = {
  title: 'Subscription & Billing | Prynt',
  description: 'Manage your print shop subscription plan, invoices, and studio upgrades.',
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch shop
  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!shop) redirect('/onboarding')

  // Fetch subscription requests history
  const { data: subscriptionRequests } = await supabase
    .from('subscription_requests')
    .select('*')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })

  const pendingRequest = (subscriptionRequests || []).find((r) => r.status === 'pending') || null

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Subscription & Billing</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upgrade your print shop to unlock unlimited AI background removal, Philippine formal attire, and custom gang sheet imposition.
        </p>
      </div>

      <BillingClientView
        shop={shop}
        pendingRequest={pendingRequest}
        history={subscriptionRequests || []}
      />
    </div>
  )
}
