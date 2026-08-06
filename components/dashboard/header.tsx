import { Button } from '@/components/ui/button'
import { Printer, LogOut } from 'lucide-react'
import { signOut } from '@/app/dashboard/actions'

interface Profile {
  full_name: string | null;
  role: string | null;
}

interface Shop {
  name: string;
  slug: string;
}

export function DashboardHeader({ shop, profile }: { shop: Shop; profile: Profile | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Printer className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">{shop.name}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">Slug: /{shop.slug}</p>
          </div>
          <nav className="ml-8 hidden items-center gap-6 md:flex">
            <a href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Overview</a>
            <a href="/dashboard/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Orders Board</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            {profile?.full_name}{' '}
            <span className="ml-1 rounded bg-primary/10 px-2 py-0.5 font-mono text-xs capitalize text-primary">
              {profile?.role}
            </span>
          </span>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
