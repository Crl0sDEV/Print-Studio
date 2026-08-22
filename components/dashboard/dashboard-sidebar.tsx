'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  ListTodo, 
  LogOut, 
  BarChart3, 
  Settings, 
  Users, 
  HelpCircle, 
  QrCode, 
  Sparkles,
  CreditCard,
  ShieldCheck,
  Crown,
  LifeBuoy
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/dashboard/actions'
import { TutorialModal } from './tutorial-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { isProPlanActive } from '@/lib/plans'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

interface DashboardSidebarProps {
  shop: {
    name: string
    slug: string
    plan?: string | null
    plan_expires_at?: string | null
    subscription_status?: string | null
  }
  profile: {
    full_name: string | null
    role: string | null
  } | null
}

export function DashboardSidebar({ shop, profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isSuperAdmin = profile?.role === 'superadmin'
  const isPro = isProPlanActive(shop)

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders Board', href: '/dashboard/orders', icon: ListTodo },
    { name: 'Photo & Print Studio', href: '/dashboard/studio', icon: Sparkles },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'QR Code', href: '/dashboard/qr', icon: QrCode },
    { name: 'Subscription & Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Support & Help', href: '/dashboard/support', icon: LifeBuoy },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  if (isSuperAdmin) {
    navItems.splice(6, 0, {
      name: 'Super Admin',
      href: '/admin',
      icon: ShieldCheck,
    })
  }

  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-border/40 p-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 p-1">
            <Image src="/favicon-32x32.png" width={22} height={22} alt="Prynt Logo" className="rounded-sm" />
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="line-clamp-1 font-bold leading-tight text-sm">{shop.name}</span>
            <span className="text-[10px] text-muted-foreground truncate">/{shop.slug}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  isActive={isActive} 
                  tooltip={item.name}
                  render={<Link href={item.href} prefetch={true} />}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${item.name === 'Super Admin' ? 'text-amber-500 font-bold' : ''}`} />
                  <span className="group-data-[collapsible=icon]:hidden">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3">
        <div className="flex items-center justify-between mb-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-xs">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5">
                <span className="line-clamp-1 text-xs font-medium">{profile?.full_name}</span>
                {isPro ? (
                  <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] h-4 px-1 font-bold">
                    <Crown className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500" />
                    PRO
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] h-4 px-1 text-muted-foreground">
                    FREE
                  </Badge>
                )}
              </div>
              <span className="text-[10px] capitalize text-muted-foreground">{profile?.role}</span>
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs h-8 text-muted-foreground"
            onClick={() => setIsTutorialOpen(true)}
            nativeButton={true}
          >
            <HelpCircle className="mr-2 h-3.5 w-3.5" />
            Page Guide
          </Button>

          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-xs h-8 text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </form>
        </div>
      </SidebarFooter>

      <TutorialModal open={isTutorialOpen} onOpenChange={setIsTutorialOpen} />
    </Sidebar>
  )
}
