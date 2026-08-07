'use client'

import { useState } from 'react'
import { LayoutDashboard, ListTodo, LogOut, BarChart3, Settings, Users, HelpCircle, QrCode } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/dashboard/actions'
import { TutorialModal } from './tutorial-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

export function DashboardSidebar({ shop, profile }: any) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders Board', href: '/dashboard/orders', icon: ListTodo },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'QR Code', href: '/dashboard/qr', icon: QrCode },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center justify-center rounded-sm">
            <Image src="/favicon-32x32.png" width={24} height={24} alt="Prynt Logo" className="rounded-sm" />
          </div>
          <div className="flex flex-col">
            <span className="line-clamp-1 font-bold leading-tight">{shop.name}</span>
            <span className="text-[10px] text-muted-foreground">/{shop.slug}</span>
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
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-xs">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-medium">{profile?.full_name}</span>
              <span className="text-xs capitalize text-muted-foreground">{profile?.role}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-muted-foreground"
            onClick={() => setIsTutorialOpen(true)}
            nativeButton={true}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Page Guide
          </Button>

          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </SidebarFooter>

      <TutorialModal open={isTutorialOpen} onOpenChange={setIsTutorialOpen} />
    </Sidebar>
  )
}
