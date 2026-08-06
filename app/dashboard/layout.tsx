import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Printer } from 'lucide-react'

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

  if (!shop) redirect('/onboarding')

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar shop={shop} profile={profile} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4 md:hidden bg-background">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 font-bold ml-2">
              <Printer className="h-5 w-5 text-primary" />
              {shop.name}
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
