import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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

  const isSuperAdmin = profile?.role === 'superadmin'
  if (!shop && !isSuperAdmin) redirect('/onboarding')

  const activeShop = shop || {
    name: 'Prynt Admin HQ',
    slug: 'admin',
    plan: 'pro',
    plan_expires_at: null,
    subscription_status: 'active',
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <DashboardSidebar shop={activeShop} profile={profile} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30 print:hidden">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="text-xs text-muted-foreground hidden sm:inline">
                Toggle sidebar: <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[10px] border border-border/50">Ctrl+B</kbd>
              </div>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
