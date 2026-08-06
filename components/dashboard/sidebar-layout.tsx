'use client'

import { Printer, LayoutDashboard, ListTodo, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/dashboard/actions'

export function SidebarLayout({ children, shop, profile }: any) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders Board', href: '/dashboard/orders', icon: ListTodo },
  ]

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/40 bg-card/40 backdrop-blur-xl md:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/40 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Printer className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-bold leading-tight line-clamp-1">{shop.name}</h1>
            <p className="text-[10px] text-muted-foreground">/{shop.slug}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border/40 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-medium">{profile?.full_name}</span>
              <span className="text-xs capitalize text-muted-foreground">{profile?.role}</span>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pb-16 md:pb-0 md:pl-64">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md md:hidden">
           <div className="flex items-center gap-2 font-bold">
             <Printer className="h-5 w-5 text-primary" />
             <span className="line-clamp-1">{shop.name}</span>
           </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/40 bg-card/60 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex flex-1 flex-col items-center justify-center gap-1">
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
        <form action={signOut} className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1">
          <button type="submit" className="flex flex-col items-center gap-1">
            <LogOut className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Logout</span>
          </button>
        </form>
      </div>
    </div>
  )
}
