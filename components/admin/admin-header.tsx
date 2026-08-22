'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, Store, LogOut, MessageSquare } from 'lucide-react'
import { adminSignOut } from '@/app/admin/login/actions'
import { ThemeToggle } from '@/components/theme-toggle'
import { NotificationBell } from '@/components/notifications/notification-bell'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  profile: {
    full_name: string | null
    role: string | null
  } | null
}

export function AdminHeader({ profile }: AdminHeaderProps) {
  const pathname = usePathname()

  if (pathname === '/admin/login') return null

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand & Nav */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-sm">
            <div className="h-7 w-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span>Prynt SuperAdmin</span>
          </Link>
          <span className="text-muted-foreground/40 hidden sm:inline">|</span>
          <Link
            href="/admin/support"
            className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              pathname.startsWith('/admin/support')
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Support Helpdesk</span>
          </Link>
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Store className="h-3.5 w-3.5" />
            <span>Shop View</span>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight">{profile?.full_name || 'Admin'}</span>
              <span className="text-[10px] uppercase font-mono text-amber-500 font-bold">Superadmin</span>
            </div>
          </div>

          <ThemeToggle />

          <form action={adminSignOut}>
            <Button size="xs" variant="outline" type="submit" className="text-xs gap-1 h-8 text-muted-foreground hover:text-destructive">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
