import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminHelpdeskConsole } from '@/components/admin/admin-helpdesk-console'

export const metadata = {
  title: 'Support Helpdesk | Prynt SuperAdmin',
  description: 'Master support ticket management and live shop inquiry answering.',
}

export default async function AdminSupportPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  // Verify Superadmin privileges
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'superadmin') {
    redirect('/admin/login?error=Access%20denied')
  }

  // Fetch all support tickets with shop and messages
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*, shops(name, slug), support_messages(*)')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-border/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Support Helpdesk Queue</h1>
            <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Master Support
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Answer questions from print shop owners, troubleshoot studio layouts, and resolve billing inquiries.
          </p>
        </div>
      </div>

      <AdminHelpdeskConsole
        tickets={tickets || []}
        currentAdminId={user.id}
      />
    </div>
  )
}
