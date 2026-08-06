import { Printer } from 'lucide-react'

export function ShopHeader({ name, address }: { name: string; address: string | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-4xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Printer className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none">{name}</h1>
          {address && <p className="mt-1 text-sm text-muted-foreground">{address}</p>}
        </div>
      </div>
    </header>
  )
}
