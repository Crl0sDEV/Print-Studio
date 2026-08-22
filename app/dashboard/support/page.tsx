import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupportClientView } from './support-client-view'

export const metadata = {
  title: 'Support & Help Desk | Prynt Studio',
  description: 'Submit support tickets, chat with admin, and find quick answers.',
}

export default async function SupportPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!shop) redirect('/onboarding')

  // Fetch shop's support tickets with message counts
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*, support_messages(count)')
    .eq('shop_id', shop.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Support & Help Desk</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Need help with your subscription, custom templates, or printing studio setup? Our team is here to assist you.
        </p>
      </div>

      <SupportClientView shop={shop} tickets={tickets || []} />
    </div>
  )
}
